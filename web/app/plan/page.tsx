"use client";
import { useEffect, useState } from "react";
const DEFAULTS = ["Watch orientation recap (30m)", "Draft prototype problem statement", "Join Orientation Live — same cohort link"];
export default function Plan() {
  const [items, setItems] = useState<{ t: string; done: boolean }[]>([]);
  useEffect(() => {
    const s = localStorage.getItem("qaf-plan");
    setItems(s ? JSON.parse(s) : DEFAULTS.map((t) => ({ t, done: false })));
  }, []);
  useEffect(() => { if (items.length) localStorage.setItem("qaf-plan", JSON.stringify(items)); }, [items]);
  return (
    <main style={{ maxWidth: 640, margin: "0 auto", padding: 16 }}>
      <h2>Weekly plan (personal ≠ official)</h2>
      {items.map((it, i) => (
        <label key={i} style={{ display: "block", padding: 8, border: "1px solid #ddd", borderRadius: 8, margin: "6px 0" }}>
          <input type="checkbox" checked={it.done} onChange={() => setItems(items.map((x, j) => (j === i ? { ...x, done: !x.done } : x)))} /> {it.t}
        </label>
      ))}
      <p style={{ color: "#555", fontSize: 13 }}>Completing this checklist ≠ completing official assessment. Official due: Assessment 1, 18 Oct 23:59 WAT.</p>
    </main>
  );
}
