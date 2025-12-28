import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { google } from "googleapis";
import fs from "fs";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5050;
const SPREADSHEET_ID = process.env.SPREADSHEET_ID;
const SHEET_NAME = process.env.SHEET_NAME || "גיליון1";
const SA_PATH = process.env.GOOGLE_APPLICATION_CREDENTIALS || "./service-account.json";

if (!SPREADSHEET_ID) throw new Error("Missing env: SPREADSHEET_ID");

// מיפוי עמודות לפי התמונה שלך (A=0, B=1, ...)
const COLS = {
  orderNo: 0,        // A מספר הזמנה
  customerNo: 1,     // B מספר לקוח
  customerName: 2,   // C שם לקוח
  contactName: 4,    // E איש קשר
  phone: 5,          // F טלפון
  orderType: 11,     // L סוג הזמנה
  status: 13,        // N סטטוס  ✅ חדש
  deliveryDate: 15,   // P תאריך אספקה סופי
  linesFromSheet: 8, // I כמות שורות ✅ חדש

};

function pick(row, idx) {
  return row?.[idx] ?? "";
}

function normalize(v) {
  return String(v ?? "").trim();
}

function parseDateComparable(v) {
  const s = normalize(v);
  if (!s) return null;

  // dd/mm/yyyy
  const m = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (m) {
    const dd = Number(m[1]), mm = Number(m[2]), yyyy = Number(m[3]);
    const d = new Date(Date.UTC(yyyy, mm - 1, dd));
    return isNaN(d.getTime()) ? null : d.getTime();
  }

  const d2 = new Date(s);
  return isNaN(d2.getTime()) ? null : d2.getTime();
}

/*async function getSheetsClient() {
  const creds = JSON.parse(fs.readFileSync(SA_PATH, "utf8"));
  const auth = new google.auth.GoogleAuth({
    credentials: creds,
    scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"]
  });
  return google.sheets({ version: "v4", auth });
}
async function getSheetsClient() {
  const raw = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
  if (!raw) throw new Error("Missing env: GOOGLE_SERVICE_ACCOUNT_JSON");

  const creds = JSON.parse(raw);

  const auth = new google.auth.GoogleAuth({
    credentials: creds,
    scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"]
  });

  return google.sheets({ version: "v4", auth });
}*/
async function getSheetsClient() {
  const keyPath = new URL("./service-account.json", import.meta.url);
  const raw = fs.readFileSync(keyPath, "utf8");
  const creds = JSON.parse(raw);

  const auth = new google.auth.GoogleAuth({
    credentials: creds,
    scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"]
  });

  return google.sheets({ version: "v4", auth });
}


const ALLOWED_STATUSES = new Set([
  "", // ריק
  "נקלט ממתין לאישור",
  "נקלט ממתין לסיגמנט",
  "קו אלי"
]);

app.get("/api/health", (_req, res) => res.json({ ok: true }));

/**
 * GET /api/customers/:customerNo/orders
 * Output:
 * {
 *   customer: { customerNo, name, contact, phone },
 *   orders: [{ orderNo, orderType, lineCount, deliveryDateMax }]
 * }
 */
app.get("/api/customers/:customerNo/orders", async (req, res) => {
  try {
    const customerNo = normalize(req.params.customerNo);
    if (!customerNo) return res.status(400).json({ error: "customerNo is required" });

    const sheets = await getSheetsClient();
    const range = `${SHEET_NAME}!A:Q`;

    const resp = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range
    });

    const values = resp.data.values || [];
    if (values.length <= 1) return res.status(404).json({ error: "No data in sheet" });

    // דילוג כותרת
    const rows = values.slice(1);

    // התאמה מדויקת למספר לקוח
    //const matched = rows.filter(r => normalize(pick(r, COLS.customerNo)) === customerNo);
  const matched = rows.filter(r => {
  const cNo = normalize(pick(r, COLS.customerNo));
  if (cNo !== customerNo) return false;

  const st = normalize(pick(r, COLS.status));
  // אם ריק או אחד הסטטוסים המותרים
  return ALLOWED_STATUSES.has(st);
});

    if (matched.length === 0) {
      return res.status(404).json({ error: "Customer not found or no orders" });
    }

    const first = matched[0];
    const customer = {
      customerNo,
      name: normalize(pick(first, COLS.customerName)),
      contact: normalize(pick(first, COLS.contactName)),
      phone: normalize(pick(first, COLS.phone))
    };

    // אגרגציה להזמנות: orderNo + orderType
    /*const map = new Map();

    for (const r of matched) {
      const orderNo = normalize(pick(r, COLS.orderNo));
      const orderType = normalize(pick(r, COLS.orderType));
      const delivery = normalize(pick(r, COLS.deliveryDate));
      if (!orderNo) continue;

      const key = `${orderNo}__${orderType}`;
      if (!map.has(key)) {
        map.set(key, {
          orderNo,
          orderType,
          lineCount: 0,
          deliveryDateMax: ""
        });
      }

      const obj = map.get(key);
      obj.lineCount += 1;

      const curTs = parseDateComparable(obj.deliveryDateMax);
      const nextTs = parseDateComparable(delivery);

      if (nextTs != null && (curTs == null || nextTs > curTs)) {
        obj.deliveryDateMax = delivery;
      } else if (!obj.deliveryDateMax && delivery) {
        obj.deliveryDateMax = delivery;
      }
    }*/
  const map = new Map();

for (const r of matched) {
  const orderNo = normalize(pick(r, COLS.orderNo));
  const orderType = normalize(pick(r, COLS.orderType));
  const delivery = normalize(pick(r, COLS.deliveryDate));

  // הערך מעמודה I (כמות שורות)
  const linesValRaw = normalize(pick(r, COLS.linesFromSheet));
  const linesValNum = Number(linesValRaw);

  if (!orderNo) continue;

  const key = `${orderNo}__${orderType}`;
  if (!map.has(key)) {
    map.set(key, {
      orderNo,
      orderType,
      lineCount: "",          // יהיה מה- sheet
      deliveryDateMax: ""
    });
  }

  const obj = map.get(key);

  // אם בעמודה I יש מספר תקין – נשמור אותו
  // אם יש כמה שורות לאותה הזמנה, ניקח את המספר הגדול ביותר (בטוח)
  if (!Number.isNaN(linesValNum) && linesValNum > 0) {
    const current = Number(obj.lineCount);
    if (Number.isNaN(current) || linesValNum > current) {
      obj.lineCount = linesValNum;
    }
  }

  // תאריך אספקה סופי (מקסימום)
  const curTs = parseDateComparable(obj.deliveryDateMax);
  const nextTs = parseDateComparable(delivery);
  if (nextTs != null && (curTs == null || nextTs > curTs)) {
    obj.deliveryDateMax = delivery;
  } else if (!obj.deliveryDateMax && delivery) {
    obj.deliveryDateMax = delivery;
  }
}


    const orders = Array.from(map.values()).sort((a, b) => {
      const at = parseDateComparable(a.deliveryDateMax) ?? Number.POSITIVE_INFINITY;
      const bt = parseDateComparable(b.deliveryDateMax) ?? Number.POSITIVE_INFINITY;
      if (at !== bt) return at - bt;
      return a.orderNo.localeCompare(b.orderNo);
    });

    res.json({ customer, orders });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error", details: String(err?.message || err) });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
