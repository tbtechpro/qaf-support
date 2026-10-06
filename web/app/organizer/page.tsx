"use client";
import { useState } from "react";
import { SCHEDULES } from "../../lib/seed";
export default function Organizer() {
  const [ok, setOk] = useState(false);
  const [pw, setPw] = useState("");
  if (!ok) return (<main><div className="card" style={{ maxWidth: 460, margin: "40px auto" }}><h2>🔒 Organizer only</h2><p className="meta">Restricted workspace. Learners can never approve content or see others’ chats. (Pilot stub — PocketBase auth in production.)</p><input value={pw} onChange={(e) => setPw(e.target.value)} onKeyDown={(e) => e.key === "Enter" && pw && setOk(true)} placeholder="Organizer passcode" style={{ width: "100%", padding: 12, borderRadius: 12, border: "1px solid var(--line)", background: "#111a36", color: "#fff" }} /><button className="btn btn-p" style={{ marginTop: 10, width: "100%" }} onClick={() => pw && setOk(true)}>Unlock workspace</button></div></main>);
  return (
    <main>
      <div className="pills"><span className="pill hot">● ORGANIZER</span><span className="pill">Content accuracy owner</span><span className="pill">Escalation owner</span></div>
      <h2 style={{ fontSize: 30, margin: "10px 0" }}>Mission <span className="grad">control</span></h2>
      <div className="grid">
        <div className="card"><h3>📅 Schedules + links</h3><p>Publish confirmed dates, WAT times, same-for-cohort verified links, 24h/3h/1h plan.</p></div>
        <div className="card"><h3>🔔 Organizer nudges</h3><p>24h confirm-link + 1h join reminders for your own cohort sessions.</p></div>
        <div className="card"><h3>💬 Gaps → FAQs</h3><p>Turn repeats + confirmed answers into reviewed support material.</p></div>
      </div>
      <div className="card" style={{ marginTop: 14 }}>
        <h3>Confirmed events + 24/3/1 status</h3>
        <table><thead><tr><th>Event</th><th>Date (WAT)</th><th>Link</th><th>Reminders</th></tr></thead><tbody>
          {SCHEDULES.map((s, i) => (<tr key={i}><td>{s.title}</td><td>{s.datetime_iso}</td><td>{s.join_link || "awaiting"}</td><td>queued 24/3/1</td></tr>))}
        </tbody></table>
      </div>
      <div className="card" style={{ marginTop: 14 }}>
        <h3>Needs review</h3>
        <table><thead><tr><th>Question</th><th>Reason</th><th>Status</th></tr></thead><tbody>
          <tr><td>“Which assessment?”</td><td>ambiguous</td><td>needs review</td></tr>
          <tr><td>“Link looks wrong”</td><td>possible inaccuracy</td><td>needs review</td></tr>
        </tbody></table>
        <p className="meta">Metrics need sample sizes + response rates. Stars ≠ accuracy, link click ≠ resolution.</p>
      </div>
    </main>
  );
}
