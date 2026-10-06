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
    </main>
  );
}
