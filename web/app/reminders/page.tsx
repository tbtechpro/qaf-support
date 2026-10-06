"use client";
import { useState } from "react";
import { SCHEDULES } from "../../lib/seed";
export default function Reminders() {
  const [prefs, setPrefs] = useState({ deadline: true, live: true, checkin: true, wa: false });
  return (
    <main style={{ maxWidth: 640, margin: "0 auto", padding: 16 }}>
      <h2>Reminder prefs — 24h / 3h / 1h · Africa/Lagos (WAT)</h2>
      {(Object.keys(prefs) as (keyof typeof prefs)[]).map((k) => (
        <label key={k} style={{ display: "flex", justifyContent: "space-between", padding: 10, border: "1px solid #ddd", borderRadius: 8, margin: "6px 0" }}>
          {k === "wa" ? "WhatsApp/email (opt-in only)" : k}<input type="checkbox" checked={prefs[k]} onChange={() => setPrefs({ ...prefs, [k]: !prefs[k] })} />
        </label>
      ))}
      <p style={{ fontSize: 13, color: "#555" }}>In-app always. WhatsApp/email only if opted-in + verified. Pause/off per category. In-app gives no alert when closed.</p>
      {SCHEDULES.map((s, i) => (
        <div key={i} style={{ border: "1px solid #ddd", borderRadius: 8, padding: 10, margin: "6px 0" }}>
          <b>{s.title}</b> — {s.datetime_iso} ({s.timezone})<br />
          {s.kind === "live_session" ? <>Join (same for cohort): {s.join_link || "Awaiting organizer confirmation"}</> : <>Action: {s.action}</>}<br />
          <small>24h · 3h · 1h · Source: {s.source}</small>
        </div>
      ))}
    </main>
  );
}
