/*
import { useMemo, useState } from "react";
import logo from "./assets/adar-logo.jpg.jpeg";
import "./App.css";

const API_BASE = "https://warehouse-system-7e56.onrender.com";


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
}*/
import { useMemo, useState } from "react";
import logo from "./assets/adar-logo.jpg.jpeg";
import "./App.css";

const API_BASE = "https://warehouse-system-7e56.onrender.com";

export default function App() {
  const [mode, setMode] = useState("customer"); // "customer" | "order"
  const [customerNo, setCustomerNo] = useState("");
  const [orderNo, setOrderNo] = useState("");

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [data, setData] = useState(null);

  const canSearchCustomer = useMemo(
    () => customerNo.trim().length > 0,
    [customerNo]
  );
  const canSearchOrder = useMemo(() => orderNo.trim().length > 0, [orderNo]);

  function resetResults() {
    setErr("");
    setData(null);
  }

  function switchMode(next) {
    setMode(next);
    resetResults();
    // לא מוחק את הערכים בכוונה, כדי שיהיה נוח לעבור בין מצבים
  }

  async function doSearch(e) {
    e?.preventDefault?.();
    resetResults();

    setLoading(true);
    try {
      let url = "";

      if (mode === "customer") {
        const c = customerNo.trim();
        if (!c) return;
        url = `${API_BASE}/api/customers/${encodeURIComponent(c)}/orders`;
      } else {
        const o = orderNo.trim();
        if (!o) return;
        url = `${API_BASE}/api/orders/${encodeURIComponent(o)}`;
      }

      const res = await fetch(url);
      const json = await res.json().catch(() => ({}));
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
          <p className="subtitle">
            {mode === "customer"
              ? "חיפוש הזמנות לפי לקוח (הזמנות פעילות בלבד)"
              : "חיפוש הזמנה לפי מספר הזמנה (הזמנות פעילות בלבד)"}
          </p>
        </div>
      </header>

      <main className="card">
        {/* מצב חיפוש */}
        <div className="modeRow" role="tablist" aria-label="מצב חיפוש">
          <button
            type="button"
            className={`btn btnGhost ${mode === "customer" ? "btnActive" : ""}`}
            onClick={() => switchMode("customer")}
          >
            חיפוש לפי מספר לקוח
          </button>

          <button
            type="button"
            className={`btn btnGhost ${mode === "order" ? "btnActive" : ""}`}
            onClick={() => switchMode("order")}
          >
            חיפוש לפי מספר הזמנה
          </button>
        </div>

        {/* חיפוש */}
        <form className="searchRow" onSubmit={doSearch}>
          {mode === "customer" ? (
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
          ) : (
            <div className="field">
              <label className="label">מספר הזמנה</label>
              <input
                className="input"
                value={orderNo}
                onChange={(e) => setOrderNo(e.target.value)}
                inputMode="numeric"
                placeholder="לדוגמה: 6161570"
              />
            </div>
          )}

          <button
            className="btn"
            type="submit"
            disabled={
              loading || (mode === "customer" ? !canSearchCustomer : !canSearchOrder)
            }
          >
            {loading ? "מחפש..." : "חיפוש"}
          </button>
        </form>

        {err && (
          <div className="alert alertError">
            <strong>שגיאה:</strong> {err}
          </div>
        )}

        {/* תוצאות - חיפוש לפי לקוח */}
        {mode === "customer" && data?.customer && (
          <>
            <section className="section">
              <div className="sectionTitle">פרטי לקוח</div>

              <div className="grid">
                <Info label="מספר לקוח" value={data.customer.customerNo} />
                <Info label="שם לקוח" value={data.customer.name} />
                <Info label="איש קשר" value={data.customer.contact} />
                <Info label="טלפון" value={data.customer.phone} />
              </div>
            </section>

            {Array.isArray(data?.orders) && data.orders.length > 0 ? (
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
                          <td className="center">{o.lineCount ?? "-"}</td>
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
            ) : (
              data && (
                <div className="alert alertInfo">
                  לא נמצאו הזמנות פעילות ללקוח הזה.
                </div>
              )
            )}
          </>
        )}

        {/* תוצאות - חיפוש לפי הזמנה */}
        {mode === "order" && data && (
          <>
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

            {data?.order ? (
              <section className="section">
                <div className="sectionTitle">
                  הזמנה <span className="pill">1</span>
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
                      <tr>
                        <td className="mono">{data.order.orderNo}</td>
                        <td>{data.order.orderType || "-"}</td>
                        <td className="center">{data.order.lineCount ?? "-"}</td>
                        <td className="mono">{data.order.deliveryDateMax || "-"}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </section>
            ) : (
              <div className="alert alertInfo">
                לא נמצאה הזמנה פעילה עם המספר הזה.
              </div>
            )}
          </>
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


