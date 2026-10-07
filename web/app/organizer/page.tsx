"use client";
import { useEffect, useState } from "react";
import { loadExtra, saveExtra, validate, type Extra } from "../../lib/schedules";
import { bootstrapOwner as _b, createInvite, currentOrg, loadInvites, loadOrgs, logout, redeem, requestAccessLink, type Org } from "../../lib/organizers";
void _b;
type Form = { kind: "live_session" | "deadline"; title: string; datetime_iso: string; timezone: string; join_link: string; source: string; action: string };
const EMPTY: Form = { kind: "live_session", title: "", datetime_iso: "", timezone: "Africa/Lagos", join_link: "", source: "", action: "" };
export default function Organizer() {
  const [me, setMe] = useState<Org | null>(null);
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [err, setErr] = useState("");
  const [items, setItems] = useState<Extra[]>([]);
  const [f, setF] = useState<Form>({ ...EMPTY });
  const [ferr, setFerr] = useState("");
  const [msg, setMsg] = useState("");
  const [inviteFor, setInviteFor] = useState("");
  const [csv, setCsv] = useState("");
  const [fb, setFb] = useState<{ vote: string; stars: string; note: string; created: string }[]>([]);
  const [fbLive, setFbLive] = useState(false);
  useEffect(() => {
    fetch("/api/feedback").then((r) => r.json()).then((j) => { setFb(j.items || []); setFbLive(!!j.items); }).catch(() => {});
  }, [me]);
  const [preview, setPreview] = useState<{ title: string; err: string | null; done?: boolean; row?: Omit<Extra, "id" | "publishedBy"> }[]>([]);
  const [invites, setInvites] = useState(loadInvitesSafe());
  const [orgs, setOrgs] = useState<Org[]>([]);
  useEffect(() => { setMe(currentOrg()); setItems(loadExtra()); setOrgs(loadOrgs()); setInvites(loadInvites()); }, []);
  const persist = (next: Extra[]) => { setItems(next); saveExtra(next); };
  function loadInvitesSafe() { try { return loadInvites(); } catch { return []; } }

  if (!me) return (
    <main>
      <div className="card" style={{ maxWidth: 480, margin: "30px auto" }}>
        <div className="pills"><span className="pill hot">● ORGANIZER SIGN-IN</span><span className="pill">Invite only</span></div>
        <h2>🔒 Organizer access</h2>
        <p className="meta">Restricted workspace — learners can never approve content or see others’ chats. Live: PocketBase accounts (email + password or Google, allowlisted). Pilot: email + single-use invite code below.</p>
        <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.org" style={inp} />
        <input value={code} onChange={(e) => setCode(e.target.value)} onKeyDown={(e) => e.key === "Enter" && go()} placeholder="Invite code e.g. QAF-AB12CD (first organizer: any code)" style={{ ...inp, marginTop: 8 }} />
        {err && <p style={{ color: "var(--rose)" }}>{err}</p>}
        <button className="btn btn-p" style={{ marginTop: 10, width: "100%" }} onClick={go}>Sign in →</button>
        <p className="meta">No code? {process.env.NEXT_PUBLIC_ADMIN_WHATSAPP ? (<a href={requestAccessLink(process.env.NEXT_PUBLIC_ADMIN_WHATSAPP || "", email || "my email")} target="_blank" rel="noreferrer">Request access via WhatsApp →</a>) : (<span>Ask the owner directly for a one-time code (admin contact pending).</span>)} (owner sends you a one-time code in a DM).</p>
      </div>
    </main>
  );
  function go() {
    const r = redeem(email, code);
    if (!r.ok) { setErr(r.msg); return; }
    setMe(r.org!); setOrgs(loadOrgs()); setInvites(loadInvites()); setErr("");
  }
  const submit = () => {
    const v = validate(f);
    if (v) { setFerr(v); return; }
    setFerr("");
    persist([...items, { ...f, cohort_id: "pilot-2026-01", id: `org-${Date.now()}`, publishedBy: me.email }]);
    setMsg(`Saved “${f.title}” as ${me.email} — 24h/3h/1h queued, old ones withdrawn on edit.`);
    setF({ ...EMPTY });
  };
  const withdraw = (id: string) => persist(items.map((x) => (x.id === id ? { ...x, withdrawn: true } : x)));
  const parseCsv = () => {
    const lines = csv.split("\n").map((l) => l.trim()).filter(Boolean);
    const rows = (lines[0] || "").startsWith("cohort_id,") ? lines.slice(1) : lines;
    return rows.map((l) => {
      const [cohort_id, type, title, datetime_iso, timezone, join_link, source, action] = l.split(",").map((s) => (s || "").trim());
      const row = { cohort_id: cohort_id || "pilot-2026-01", kind: type === "deadline" ? "deadline" : "live_session", title: title || "", datetime_iso: datetime_iso || "", timezone: timezone || "Africa/Lagos", join_link: join_link || "", source: source || "", action: action || "" } as Omit<Extra, "id" | "publishedBy">;
      return { title: row.title, err: validate({ kind: row.kind, title: row.title, datetime_iso: row.datetime_iso, join_link: row.join_link, source: row.source }), row };
    });
  };
  const doPreview = () => { setPreview(parseCsv().map((p) => ({ ...p, done: false }))); setMsg(""); };
  const doImport = () => {
    const list = preview.length ? preview : parseCsv().map((p) => ({ ...p, done: false }));
    const valid = list.filter((p) => !p.err && !p.done && p.row);
    if (!valid.length) { setMsg("Nothing valid to import."); return; }
    persist([...items, ...valid.map((p) => ({ ...p.row!, id: `org-${Date.now()}-${Math.floor(Math.random() * 1e6)}`, publishedBy: me.email }))]);
    setPreview(list.map((p) => (p.err ? p : { ...p, done: true })));
    setMsg(`Imported ${valid.length} row(s) as ${me.email} — 24h/3h/1h queued.`);
  };
  const live = items.filter((x) => !x.withdrawn);
  const mkInvite = () => {
    if (!inviteFor.includes("@")) { setMsg("Enter an email to invite."); return; }
    const inv = createInvite(inviteFor);
    setInvites(loadInvites()); setInviteFor("");
    setMsg(`Invite for ${inv.email}: ${inv.code} — share it in a private DM (not the group). Single use.`);
  };
  return (
    <main>
      <div className="pills"><span className="pill hot">● {me.role.toUpperCase()}: {me.email}</span><span className="pill">Feed links + deadlines</span><button className="pill" style={{ cursor: "pointer" }} onClick={() => { logout(); setMe(null); }}>Sign out</button></div>
      <h2 style={{ fontSize: 30, margin: "10px 0" }}>Feed the <span className="grad">system</span></h2>
      {me.role === "owner" && (
        <div className="card">
          <h3>✉️ Invite organizers (free, no vendor)</h3>
          <p className="meta">Create a single-use code per email. Share privately (WhatsApp DM). They sign in at <u>/organizer</u> — no link guessable, every publish is attributed.</p>
          <div className="cbar" style={{ border: 0, padding: 0, background: "transparent" }}>
            <input value={inviteFor} onChange={(e) => setInviteFor(e.target.value)} placeholder="organizer@example.org" />
            <button onClick={mkInvite}>Create code</button>
          </div>
          {invites.filter((i) => !i.used).length > 0 && <table style={{ marginTop: 8 }}><thead><tr><th>Email</th><th>Code</th><th>Status</th></tr></thead><tbody>
            {invites.filter((i) => !i.used).map((i, k) => (<tr key={k}><td>{i.email}</td><td>{i.code}</td><td>unused</td></tr>))}
          </tbody></table>}
          <p className="meta">Team: {orgs.map((o) => `${o.email} (${o.role})`).join(" · ") || "just you"}</p>
        </div>
      )}
      <div className="card" style={{ marginTop: 14 }}>
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
          {ferr && <p style={{ color: "var(--rose)" }}>{ferr}</p>}
          {msg && <p style={{ color: "var(--emerald)" }}>{msg}</p>}
          <button className="btn btn-p" onClick={submit}>Publish as {me.email} → queue 24h / 3h / 1h</button>
        </div>
      </div>
      <div className="card" style={{ marginTop: 14 }}>
        <h3>📥 Bulk import (CSV from coordinator)</h3>
        <p className="meta">Paste rows like <span className="kbd">content/seed/schedule.csv</span>: cohort_id,type(live_session|deadline),title,datetime_iso,timezone,join_link,source,action. Invalid rows are rejected with reasons — nothing half-imported.</p>
        <textarea value={csv} onChange={(e) => setCsv(e.target.value)} rows={4} placeholder={"pilot-2026-01,live_session,Orientation Live,2026-10-13T18:00:00+01:00,Africa/Lagos,https://meet.example.org/qaf-orientation,Schedule v1 6-Oct-2026,Join via same cohort link"} style={{ ...inp, fontFamily: "monospace", fontSize: 12 }} />
        {preview.length > 0 && (
          <table style={{ marginTop: 8 }}><thead><tr><th>Row</th><th>Check</th></tr></thead><tbody>
            {preview.map((p, i) => (<tr key={i}><td>{p.title || "(untitled)"}</td><td style={{ color: p.err ? "var(--rose)" : "var(--emerald)" }}>{p.err || "ok → will publish"}</td></tr>))}
          </tbody></table>
        )}
        <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
          <button className="btn btn-g" onClick={doPreview}>Preview</button>
          <button className="btn btn-p" onClick={doImport}>Import valid ({preview.filter((p) => !p.err && !p.done).length}) as {me.email}</button>
        </div>
        {msg && <p style={{ color: "var(--emerald)" }}>{msg}</p>}
      </div>
      <div className="card" style={{ marginTop: 14 }}>
        <h3>Published ({live.length}) — attributed</h3>
        <table><thead><tr><th>Event</th><th>Date</th><th>Link / Action</th><th>By</th><th></th></tr></thead><tbody>
          {live.map((s) => (<tr key={s.id}><td>{s.title}</td><td>{s.datetime_iso}</td><td>{s.kind === "live_session" ? s.join_link : s.action}</td><td>{s.publishedBy || "—"}</td><td><button onClick={() => withdraw(s.id)} style={linkBtn}>withdraw</button></td></tr>))}
        </tbody></table>
      </div>
      <div className="card" style={{ marginTop: 14 }}>
        <h3>📊 Pilot signals {fbLive ? "(live)" : "(waiting for votes)"}</h3>
        {(() => {
          const total = fb.length;
          const helped = fb.filter((f) => f.vote === "helped").length;
          const stars = fb.map((f) => parseInt(f.stars || "", 10)).filter((n) => n >= 1 && n <= 5);
          const avg = stars.length ? (stars.reduce((a, b) => a + b, 0) / stars.length).toFixed(1) : "—";
          return <p className="meta">Helpfulness: {total ? `${Math.round((helped / total) * 100)}% (${helped}/${total})` : "no votes yet"} · ★ avg {avg} ({stars.length}) · report counts + response rate alongside %.</p>;
        })()}
        {fb.filter((f) => f.vote === "not_quite" || f.note).slice(0, 20).map((f, i) => (
          <p key={i} className="meta" style={{ borderTop: "1px solid var(--line)", paddingTop: 6 }}>“{f.note || "(no note)"}” — {f.vote}{f.stars ? ` · ${f.stars}★` : ""} · {String(f.created || "").slice(0, 10)}</p>
        ))}
        {fb.length === 0 && <p className="meta">No feedback yet — votes and ★ ratings from Ask land here with notes; “looks wrong” flags arrive marked for source review.</p>}
      </div>
    </main>
  );
}
const inp: React.CSSProperties = { padding: 12, borderRadius: 12, border: "1px solid var(--line)", background: "#111a36", color: "#fff", width: "100%" };
const linkBtn: React.CSSProperties = { background: "none", border: "1px solid var(--line)", color: "var(--rose)", borderRadius: 8, padding: "4px 10px", cursor: "pointer" };
