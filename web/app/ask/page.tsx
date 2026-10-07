"use client";
import { useEffect, useState } from "react";
import { answer, repairReply, waLink, type RepairKind, type Schedule } from "../../lib/seed";
import { toFeedbackRecord, type Vote } from "../../lib/feedback";
import { allSchedules, fetchLive, mergeByTitle } from "../../lib/schedules";
type M = { who: "bot" | "user"; text: string };
export default function Ask() {
  const [msgs, setMsgs] = useState<M[]>([{ who: "bot", text: "Welcome to QAF Support. What would you like help with today? (Tell me what to call you — optional.)" }]);
  const [q, setQ] = useState("");
  const [name, setName] = useState("");
  const [vote, setVote] = useState("");
  const [repairDone, setRepairDone] = useState(false);
  const [liveFeed, setLiveFeed] = useState<Schedule[]>([]);
  useEffect(() => { fetchLive().then(({ items }) => setLiveFeed(items)).catch(() => {}); }, []);
  const send = (preset?: string) => {
    const text = (preset ?? q).trim();
    if (!text) return;
    const low = text.toLowerCase();
    // Prefer organizer-fed feed for session links / deadlines (same cohort link, never invented).
    if (low.includes("link") || low.includes("live") || low.includes("session") || low.includes("join") || low.includes("when") || low.includes("deadline") || low.includes("due")) {
      const feed = mergeByTitle(liveFeed, allSchedules());
      const ev = feed.find((x) => x.kind === "live_session" && (x as { withdrawn?: boolean }).withdrawn !== true);
      if (ev && (low.includes("link") || low.includes("live") || low.includes("session") || low.includes("join"))) {
        const hi = name.trim() ? `Hi ${name.trim()} — ` : "";
        const body = ev.join_link ? `${hi}${ev.title} — ${ev.datetime_iso} (${ev.timezone}). Join (same for cohort): ${ev.join_link}. Source: ${ev.source}. You’ll get 24h / 3h / 1h nudges.`
          : "Awaiting organizer confirmation for the session link — I won’t invent one.";
        setMsgs((m) => [...m, { who: "user", text }, { who: "bot", text: body }]);
        setQ("");
        return;
      }
    }
    const r = answer(text, name.trim());
    setMsgs((m) => [...m, { who: "user", text }, { who: "bot", text: r.text + (r.escalation ? "\n\n🛟 Organizer needed — review the WhatsApp summary before sending. Nothing is sent automatically." : "") }]);
    setQ("");
  };
  const lastUser = msgs.filter((m) => m.who === "user").slice(-2).map((m) => m.text).join(" | ");
  const admin = process.env.NEXT_PUBLIC_ADMIN_WHATSAPP || "";
  const waUrl = admin ? waLink(admin, `Hi, I need help: ${lastUser}`) : "";
  const [copied, setCopied] = useState(false);
  const [stars, setStars] = useState<number | null>(null);
  const [note, setNote] = useState("");
  const [sid] = useState(() => {
    try {
      let s = localStorage.getItem("qaf-sid");
      if (!s) { s = Math.random().toString(36).slice(2) + Date.now().toString(36); localStorage.setItem("qaf-sid", s); }
      return s;
    } catch { return Math.random().toString(36).slice(2); }
  });
  const sendFeedback = (v: Vote, s: number | null, n = "") => {
    fetch("/api/feedback", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(toFeedbackRecord(v, s, n, sid)) }).catch(() => {});
  };
  const copySummary = () => {
    const t = `Hi, I need help: ${lastUser || "(no question yet)"}`;
    if (navigator.clipboard) navigator.clipboard.writeText(t).then(() => setCopied(true)).catch(() => setCopied(false));
  };
  const doRepair = (kind: RepairKind) => {
    const lastBot = [...msgs].reverse().find((m) => m.who === "bot")?.text || "";
    const r = repairReply(kind, lastBot);
    setRepairDone(true);
    if (kind === "wrong") sendFeedback("not_quite", stars, "flagged inaccurate via repair: " + lastBot.slice(0, 200));
    setMsgs((m) => [...m, { who: "bot", text: r.text + (r.escalation ? "\n\n🛟 Still stuck? Use the WhatsApp organizer option above — a person takes it from here." : "") }]);
  };
  return (
    <main>
      <div className="pills"><span className="pill hot">● PRIVATE CHAT</span><span className="pill">Sources cited</span><span className="pill">No auto-send</span></div>
      <h2 style={{ fontSize: 30, margin: "10px 0" }}>Ask <span className="grad">anything</span></h2>
      <div className="phone">
        <div className="phone-head"><span className="dot" />QAF Support · private</div>
        <div className="chat">{msgs.map((m, i) => (<div key={i} className={`bub ${m.who}`}>{m.text.split("\n").map((l, j) => (<p key={j} style={{ margin: "4px 0" }}>{l}</p>))}</div>))}</div>
        <div className="chips">
          <span className="chip" onClick={() => send("How do I submit Assessment 1?")}>How do I submit?</span>
          <span className="chip" onClick={() => send("Where is the live session link?")}>Session link?</span>
          <span className="chip" onClick={() => send("I am behind")}>I’m behind</span>
        </div>
        <div className="cbar"><input value={q} onChange={(e) => setQ(e.target.value)} onKeyDown={(e) => e.key === "Enter" && send()} placeholder="Ask… e.g. How do I submit?" /><button onClick={() => send()}>Send</button></div>
      </div>
      <div className="card" style={{ marginTop: 14 }}>
        <h3>Make it yours</h3>
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="What should I call you? (optional)" style={{ width: "100%", padding: 12, borderRadius: 12, border: "1px solid var(--line)", background: "#111a36", color: "#fff" }} />
        <div className="fb">
          <button className={vote === "helped" ? "yes" : ""} onClick={() => { setVote("helped"); setRepairDone(false); sendFeedback("helped", stars); }}>👍 This helped</button>
          <button onClick={() => { setVote("not_quite"); setRepairDone(false); sendFeedback("not_quite", stars); }}>🤔 Not quite</button>
          {[1, 2, 3, 4, 5].map((n) => (
            <button key={n} className={stars === n ? "yes" : ""} onClick={() => { setStars(n); if (vote) sendFeedback(vote as Vote, n, note); }}>★{n}</button>
          ))}
          {waUrl ? (
            <a className="btn btn-g" style={{ padding: "7px 12px", fontSize: 12 }} href={waUrl} target="_blank" rel="noreferrer">WhatsApp organizer →</a>
          ) : (
            <>
              <button onClick={copySummary}>{copied ? "Copied ✓" : "Copy summary for organizer"}</button>
              <span className="meta">Admin contact pending — your summary is copied; paste it to the organizer.</span>
            </>
          )}
        </div>
        {vote && <p className="meta">Vote recorded: {vote}{stars ? ` · ${stars}★` : ""} (tracked separately from resolution — silence ≠ resolved).</p>}
        {vote === "not_quite" && (
          <div style={{ marginTop: 8 }}>
            <input value={note} onChange={(e) => setNote(e.target.value)} onBlur={() => { if (note.trim()) sendFeedback("not_quite", stars, note.trim()); }} placeholder="What was missing? (optional, sent to organizers)" style={{ width: "100%", padding: 10, borderRadius: 10, border: "1px solid var(--line)", background: "#111a36", color: "#fff", marginBottom: 6 }} />
          </div>
        )}
        {vote === "not_quite" && !repairDone && (
          <div style={{ marginTop: 8 }}>
            <p className="meta">What was missing? One revised attempt, then a human if needed:</p>
            <div className="fb">
              <button onClick={() => doRepair("simpler")}>Simpler steps</button>
              <button onClick={() => doRepair("different")}>Different explanation</button>
              <button onClick={() => doRepair("wrong")}>Info looks wrong</button>
              <button onClick={() => doRepair("organizer")}>Talk to organizer</button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
