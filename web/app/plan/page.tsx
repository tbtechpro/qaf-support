"use client";
import { useEffect, useState } from "react";
const DEFAULTS = ["Watch orientation recap (30m)", "Draft prototype problem statement", "Join Orientation Live — same cohort link"];
export default function Plan() {
  const [items, setItems] = useState<{ t: string; done: boolean }[]>([]);
  const [fresh, setFresh] = useState("");
  useEffect(() => {
    try { const s = localStorage.getItem("qaf-plan"); setItems(s ? JSON.parse(s) : DEFAULTS.map((t) => ({ t, done: false }))); } catch { setItems(DEFAULTS.map((t) => ({ t, done: false }))); }
  }, []);
  useEffect(() => { if (items.length) try { localStorage.setItem("qaf-plan", JSON.stringify(items)); } catch {} }, [items]);
  const done = items.filter((i) => i.done).length;
  const [hours, setHours] = useState("");
  const [goal, setGoal] = useState("");
  const [history, setHistory] = useState<{ d: string; done: number; total: number; hours: string; goal: string }[]>([]);
  useEffect(() => { try { const h = localStorage.getItem("qaf-checkins"); if (h) setHistory(JSON.parse(h)); } catch {} }, []);
  const checkin = () => {
    const entry = { d: new Date().toISOString().slice(0, 10), done, total: items.length, hours: hours.trim() || "—", goal: goal.trim() || "—" };
    const next = [entry, ...history].slice(0, 8);
    setHistory(next);
    try { localStorage.setItem("qaf-checkins", JSON.stringify(next)); } catch {}
    setHours(""); setGoal("");
    setItems((cur) => [...cur.filter((i) => !i.done), ...cur.filter((i) => i.done).map((i) => ({ ...i, done: false }))]);
  };
const box: React.CSSProperties = { padding: 12, borderRadius: 12, border: "1px solid var(--line)", background: "#111a36", color: "#fff", width: "100%" };
  return (
    <main>
      <div className="pills"><span className="pill hot">● {done}/{items.length} DONE</span><span className="pill">Personal ≠ official</span></div>
      <h2 style={{ fontSize: 30, margin: "10px 0" }}>Your <span className="grad">week</span>, sized to your hours</h2>
      <div style={{ height: 10, borderRadius: 999, background: "rgba(255,255,255,.08)", overflow: "hidden" }}>
        <div style={{ width: `${items.length ? (done / items.length) * 100 : 0}%`, height: "100%", background: "linear-gradient(90deg,var(--emerald),var(--sky))", transition: "width .4s" }} />
      </div>
      <div className="card list" style={{ marginTop: 12 }}>
        {items.map((it, i) => (
          <label key={i} style={{ opacity: it.done ? .55 : 1, textDecoration: it.done ? "line-through" : "none" }}>
            <input type="checkbox" checked={it.done} onChange={() => setItems(items.map((x, j) => (j === i ? { ...x, done: !x.done } : x)))} />{it.t}
          </label>
        ))}
        <div className="cbar" style={{ border: 0, padding: "8px 0 0", background: "transparent" }}>
          <input value={fresh} onChange={(e) => setFresh(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter" && fresh.trim()) { setItems([...items, { t: fresh.trim(), done: false }]); setFresh(""); } }} placeholder="+ Add a small step…" />
          <button onClick={() => { if (fresh.trim()) { setItems([...items, { t: fresh.trim(), done: false }]); setFresh(""); } }}>Add</button>
        </div>
      </div>
      <p className="meta">Completing this checklist ≠ completing an official assessment. Official due: Assessment 1, 18 Oct 23:59 WAT.</p>
      <div className="card" style={{ marginTop: 14 }}>
        <h3>📝 Weekly check-in (30 seconds)</h3>
        <p className="meta">Lock this week, seed next week. {history.length ? `Streak log: ${history.length} check-in(s), latest ${history[0].done}/${history[0].total} done.` : "No check-ins yet — first one starts your log."}</p>
        <div style={{ display: "grid", gap: 8, marginTop: 8 }}>
          <input value={hours} onChange={(e) => setHours(e.target.value)} placeholder="Hours available next week? e.g. 5" style={box} />
          <input value={goal} onChange={(e) => setGoal(e.target.value)} placeholder="One main goal? e.g. finish prototype draft" style={box} />
          <button className="btn btn-p" onClick={checkin}>Check in → roll open items forward</button>
        </div>
        {history.length > 0 && (
          <table style={{ marginTop: 10 }}><thead><tr><th>Date</th><th>Done</th><th>Hours</th><th>Goal</th></tr></thead><tbody>
            {history.map((h, i) => (<tr key={i}><td>{h.d}</td><td>{h.done}/{h.total}</td><td>{h.hours}</td><td>{h.goal}</td></tr>))}
          </tbody></table>
        )}
      </div>
    </main>
  );
}
