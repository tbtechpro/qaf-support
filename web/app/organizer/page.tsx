"use client";
import { useEffect, useState } from "react";
import { loadExtra, saveExtra, validate, type Extra } from "../../lib/schedules";
type Form = { kind: "live_session" | "deadline"; title: string; datetime_iso: string; timezone: string; join_link: string; source: string; action: string };
const EMPTY: Form = { kind: "live_session", title: "", datetime_iso: "", timezone: "Africa/Lagos", join_link: "", source: "", action: "" };
export default function Organizer() {
  const [ok, setOk] = useState(false);
  const [pw, setPw] = useState("");
  const [items, setItems] = useState<Extra[]>([]);
  const [f, setF] = useState<Form>({ ...EMPTY });
  const [err, setErr] = useState("");
  const [msg, setMsg] = useState("");
  useEffect(() => { setItems(loadExtra()); }, []);
  const persist = (next: Extra[]) => { setItems(next); saveExtra(next); };
  if (!ok) return (<main><div className="card" style={{ maxWidth: 460, margin: "40px auto" }}><h2>🔒 Organizer only</h2><p className="meta">Restricted workspace. Learners can never approve content or see others’ chats. (Pilot stub — PocketBase auth in production.)</p><input value={pw} onChange={(e) => setPw(e.target.value)} onKeyDown={(e) => e.key === "Enter" && pw && setOk(true)} placeholder="Organizer passcode" style={{ width: "100%", padding: 12, borderRadius: 12, border: "1px solid var(--line)", background: "#111a36", color: "#fff" }} /><button className="btn btn-p" style={{ marginTop: 10, width: "100%" }} onClick={() => pw && setOk(true)}>Unlock workspace</button></div></main>);
  const submit = () => {
    const v = validate(f);
    if (v) { setErr(v); return; }
    setErr("");
    persist([...items, { ...f, cohort_id: "pilot-2026-01", id: `org-${Date.now()}` }]);
    setMsg(`Saved “${f.title}” — 24h/3h/1h reminders queued, old ones withdrawn on edit.`);
    setF({ ...EMPTY });
  };
  const withdraw = (id: string) => persist(items.map((x) => (x.id === id ? { ...x, withdrawn: true } : x)));
  const live = items.filter((x) => !x.withdrawn);
  return (
    <main>
      <div className="pills"><span className="pill hot">● ORGANIZER FEED</span><span className="pill">Links + deadlines in</span><span className="pill">24/3/1 out</span></div>
      <h2 style={{ fontSize: 30, margin: "10px 0" }}>Feed the <span className="grad">system</span></h2>
      <div className="card">
        <h3>{f.kind === "live_session" ? "🎥 New live session (meeting link)" : "📝 New submission deadline"}</h3>
        <div style={{ display: "grid", gap: 8, marginTop: 10 }}>
          <div style={{ display: "flex", gap: 8 }}>
            <button className="btn btn-g" style={{ borderColor: f.kind === "live_session" ? "var(--emerald)" : undefined }} onClick={() => setF({ ...f, kind: "live_session" })}>Live session</button>
            <button className="btn btn-g" style={{ borderColor: f.kind === "deadline" ? "var(--emerald)" : undefined }} onClick={() => setF({ ...f, kind: "deadline" })}>Deadline</button>
          </div>
          <input value={f.title} onChange={(e) => setF({ ...f, title: e.target.value })} placeholder={f.kind === "live_session" ? "e.g. Orientation Live" : "e.g. Assessment 1 due"} style={inp} />
          <input type="datetime-local" value={f.datetime_iso} onChange={(e) => setF({ ...f, datetime_iso: e.target.value })} style={inp} />
          {f.kind === "live_session"
            ? <input value={f.join_link} onChange={(e) => setF({ ...f, join_link: e.target.value })} placeholder="https:// meeting link (same for cohort)" style={inp} />
            : <input value={f.action} onChange={(e) => setF({ ...f, action: e.target.value })} placeholder="Action e.g. Submit on learn.qubators.org" style={inp} />}
          <input value={f.source} onChange={(e) => setF({ ...f, source: e.target.value })} placeholder="Source e.g. Schedule v2, 20-Oct-2026" style={inp} />
          {err && <p style={{ color: "var(--rose)" }}>{err}</p>}
          {msg && <p style={{ color: "var(--emerald)" }}>{msg}</p>}
          <button className="btn btn-p" onClick={submit}>Publish → queue 24h / 3h / 1h</button>
          <p className="meta">Timezone saved as Africa/Lagos (WAT). Editing an event withdraws its old reminders. Missing link/date → learners see “Awaiting organizer confirmation”.</p>
        </div>
      </div>
      <div className="card" style={{ marginTop: 14 }}>
        <h3>Fed this pilot ({live.length}) + seed</h3>
        <table><thead><tr><th>Event</th><th>Date</th><th>Link / Action</th><th></th></tr></thead><tbody>
          {live.map((s) => (<tr key={s.id}><td>{s.title}</td><td>{s.datetime_iso}</td><td>{s.kind === "live_session" ? s.join_link : s.action}</td><td><button onClick={() => withdraw(s.id)} style={linkBtn}>withdraw</button></td></tr>))}
        </tbody></table>
        {live.length === 0 && <p className="meta">Nothing fed yet — seed shows Orientation Live + Assessment 1 below on learner screens.</p>}
      </div>
    </main>
  );
}
const inp: React.CSSProperties = { padding: 12, borderRadius: 12, border: "1px solid var(--line)", background: "#111a36", color: "#fff", width: "100%" };
const linkBtn: React.CSSProperties = { background: "none", border: "1px solid var(--line)", color: "var(--rose)", borderRadius: 8, padding: "4px 10px", cursor: "pointer" };
