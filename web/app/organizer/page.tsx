"use client";
import { useState } from "react";
import { SCHEDULES } from "../../lib/seed";
export default function Organizer() {
  const [ok, setOk] = useState(false);
  const [pw, setPw] = useState("");
  if (!ok) return (<main style={{ maxWidth: 480, margin: "40px auto", padding: 16 }}><h2>Organizer (restricted)</h2><input value={pw} onChange={(e) => setPw(e.target.value)} placeholder="Organizer passcode" style={{ width: "100%", padding: 10 }} /><button onClick={() => pw && setOk(true)} style={{ marginTop: 8 }}>Unlock (pilot stub — use PB auth in prod)</button></main>);
  return (
    <main style={{ maxWidth: 720, margin: "0 auto", padding: 16 }}>
      <h2>Organizer workspace</h2>
      <h3>Confirmed schedules + same cohort link + 24/3/1</h3>
      <table><tbody>{SCHEDULES.map((s, i) => (<tr key={i}><td>{s.title}</td><td>{s.datetime_iso}</td><td>{s.join_link || "—"}</td><td>queued 24/3/1</td></tr>))}</tbody></table>
      <h3>Unresolved (question + context + reason + status)</h3>
      <p>“Which Assessment?” — ambiguous — needs review<br />“Link looks wrong” — possible inaccuracy — needs review</p>
      <h3>Feedback (helpfulness vs resolution, stars optional)</h3>
      <p>Pilot metrics need sample sizes + response rates. Stars ≠ accuracy.</p>
      <h3>Organizer reminders</h3>
      <p>24h confirm-link/schedule nudge + 1h join nudge (in-workspace + optional outside channel where opted in).</p>
    </main>
  );
}
