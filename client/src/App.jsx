/*import { useMemo, useState } from "react";

const API_BASE = "http://localhost:5050";

export default function App() {
  const [customerNo, setCustomerNo] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [data, setData] = useState(null);

  const canSearch = useMemo(() => customerNo.trim().length > 0, [customerNo]);

  async function onSearch(e) {
    e?.preventDefault?.();
    setErr("");
    setData(null);

    const c = customerNo.trim();
    if (!c) return;

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/customers/${encodeURIComponent(c)}/orders`);
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || "שגיאה בחיפוש");
      setData(json);
    } catch (e2) {
      setErr(e2.message || "שגיאה");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ fontFamily: "Arial", padding: 16, direction: "rtl", maxWidth: 1100, margin: "0 auto" }}>
      <h2 style={{ marginTop: 0 }}>מסך מחסנאי – חיפוש הזמנות לפי לקוח</h2>

      <form onSubmit={onSearch} style={{ display: "flex", gap: 12, alignItems: "end", flexWrap: "wrap" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <label style={{ fontWeight: 700 }}>מספר לקוח</label>
          <input
            value={customerNo}
            onChange={(e) => setCustomerNo(e.target.value)}
            placeholder="לדוגמה: 2050679"
            style={{ padding: 10, minWidth: 240, border: "1px solid #ccc", borderRadius: 8 }}
          />
        </div>

        <button
          type="submit"
          disabled={!canSearch || loading}
          style={{
            padding: "10px 16px",
            borderRadius: 10,
            border: "1px solid #333",
            background: loading ? "#eee" : "white",
            cursor: loading ? "not-allowed" : "pointer",
            fontWeight: 700
          }}
        >
          {loading ? "מחפש..." : "חיפוש"}
        </button>
      </form>

      {err && (
        <div style={{ marginTop: 16, padding: 12, borderRadius: 10, border: "1px solid #ffb3b3", background: "#fff5f5" }}>
          <b>שגיאה:</b> {err}
        </div>
      )}

      {data?.customer && (
        <div style={{ marginTop: 16, padding: 14, borderRadius: 14, border: "1px solid #ddd", background: "#fafafa" }}>
          <div style={{ fontWeight: 800, marginBottom: 8 }}>פרטי לקוח</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(140px, 1fr))", gap: 10 }}>
            <Info label="מספר לקוח" value={data.customer.customerNo} />
            <Info label="שם לקוח" value={data.customer.name} />
            <Info label="איש קשר" value={data.customer.contact} />
            <Info label="טלפון" value={data.customer.phone} />
          </div>
        </div>
      )}

      {data?.orders?.length > 0 && (
        <div style={{ marginTop: 16 }}>
          <div style={{ fontWeight: 800, marginBottom: 8 }}>הזמנות ({data.orders.length})</div>

          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 750 }}>
              <thead>
                <tr>
                  <Th>מספר הזמנה</Th>
                  <Th>סוג הזמנה</Th>
                  <Th>מספר שורות</Th>
                  <Th>תאריך אספקה סופי</Th>
                </tr>
              </thead>
              <tbody>
                {data.orders.map((o) => (
                  <tr key={`${o.orderNo}-${o.orderType}`}>
                    <Td>{o.orderNo}</Td>
                    <Td>{o.orderType || "-"}</Td>
                    <Td>{o.lineCount}</Td>
                    <Td>{o.deliveryDateMax || "-"}</Td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {data && (!data.orders || data.orders.length === 0) && (
        <div style={{ marginTop: 16 }}>לא נמצאו הזמנות ללקוח הזה.</div>
      )}
    </div>
  );
}

function Info({ label, value }) {
  return (
    <div style={{ padding: 10, borderRadius: 12, border: "1px solid #e5e5e5", background: "white" }}>
      <div style={{ fontSize: 12, color: "#555" }}>{label}</div>
      <div style={{ fontWeight: 800 }}>{value || "-"}</div>
    </div>
  );
}

function Th({ children }) {
  return (
    <th style={{ textAlign: "right", borderBottom: "2px solid #ddd", padding: 10, background: "#f3f3f3" }}>
      {children}
    </th>
  );
}

function Td({ children }) {
  return <td style={{ borderBottom: "1px solid #eee", padding: 10 }}>{children}</td>;
}*/
import { useMemo, useState } from "react";
import logo from "./assets/adar-logo.jpg.jpeg";
import "./App.css";

const API_BASE = "http://localhost:5050";

export default function App() {
  const [customerNo, setCustomerNo] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [data, setData] = useState(null);

  const canSearch = useMemo(() => customerNo.trim().length > 0, [customerNo]);

  async function onSearch(e) {
    e?.preventDefault?.();
    setErr("");
    setData(null);

    const c = customerNo.trim();
    if (!c) return;

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/customers/${encodeURIComponent(c)}/orders`);
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || "שגיאה בחיפוש");
      setData(json);
    } catch (e2) {
      setErr(e2.message || "שגיאה");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page" dir="rtl">
      <div className="bgGlow" aria-hidden="true" />

      <header className="header">
        <img className="logo" src={logo} alt="ADAR Toys & More" />
        <div className="titleWrap">
          <h1 className="title">מסך מחסנאי</h1>
          <p className="subtitle">חיפוש הזמנות לפי לקוח (הזמנות פעילות בלבד)</p>
        </div>
      </header>

      <main className="card">
        <form className="searchRow" onSubmit={onSearch}>
          <div className="field">
            <label className="label">מספר לקוח</label>
            <input
              className="input"
              value={customerNo}
              onChange={(e) => setCustomerNo(e.target.value)}
              inputMode="numeric"
              placeholder="לדוגמה: 201832"
            />
          </div>

          <button className="btn" type="submit" disabled={!canSearch || loading}>
            {loading ? "מחפש..." : "חיפוש"}
          </button>
        </form>

        {err && (
          <div className="alert alertError">
            <strong>שגיאה:</strong> {err}
          </div>
        )}

        {data?.customer && (
          <section className="section">
            <div className="sectionTitle">פרטי לקוח</div>

            <div className="grid">
              <Info label="מספר לקוח" value={data.customer.customerNo} />
              <Info label="שם לקוח" value={data.customer.name} />
              <Info label="איש קשר" value={data.customer.contact} />
              <Info label="טלפון" value={data.customer.phone} />
            </div>
          </section>
        )}

        {data?.orders?.length > 0 && (
          <section className="section">
            <div className="sectionTitle">
              הזמנות <span className="pill">{data.orders.length}</span>
            </div>

            <div className="tableWrap">
              <table className="table">
                <thead>
                  <tr>
                    <th>מספר הזמנה</th>
                    <th>סוג הזמנה</th>
                    <th>מספר שורות</th>
                    <th>תאריך אספקה סופי</th>
                  </tr>
                </thead>
                <tbody>
                  {data.orders.map((o) => (
                    <tr key={`${o.orderNo}-${o.orderType}`}>
                      <td className="mono">{o.orderNo}</td>
                      <td>{o.orderType || "-"}</td>
                      <td className="center">{o.lineCount}</td>
                      <td className="mono">{o.deliveryDateMax || "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="hint">
              טיפ: אם תאריך אספקה ריק (-), ההזמנה עדיין ללא תאריך סופי.
            </div>
          </section>
        )}

        {data && (!data.orders || data.orders.length === 0) && (
          <div className="alert alertInfo">לא נמצאו הזמנות פעילות ללקוח הזה.</div>
        )}
      </main>

      <footer className="footer">
        <span>ADAR Toys & More</span>
        <span className="dot">•</span>
        <span>Warehouse Console</span>
      </footer>
    </div>
  );
}

function Info({ label, value }) {
  return (
    <div className="info">
      <div className="infoLabel">{label}</div>
      <div className="infoValue">{value || "-"}</div>
    </div>
  );
}

