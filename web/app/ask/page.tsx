"use client";
import { useEffect, useState } from "react";
import { answer, waLink, type Schedule } from "../../lib/seed";
import { allSchedules, fetchLive, mergeByTitle } from "../../lib/schedules";
type M = { who: "bot" | "user"; text: string };
export default function Ask() {
  const [msgs, setMsgs] = useState<M[]>([{ who: "bot", text: "Welcome to QAF Support. What would you like help with today? (Tell me what to call you — optional.)" }]);
  const [q, setQ] = useState("");
  const [name, setName] = useState("");
  const [vote, setVote] = useState("");
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
          <button className={vote === "helped" ? "yes" : ""} onClick={() => setVote("helped")}>👍 This helped</button>
          <button onClick={() => setVote("not_quite")}>🤔 Not quite</button>
          <button>★ Rate</button>
          <a className="btn btn-g" style={{ padding: "7px 12px", fontSize: 12 }} href={waLink(process.env.NEXT_PUBLIC_ADMIN_WHATSAPP || "", `Hi, I need help: ${lastUser}`) || "#"} target="_blank">WhatsApp organizer →</a>
        </div>
        {vote && <p className="meta">Vote recorded: {vote} (tracked separately from resolution — silence ≠ resolved).</p>}
      </div>
    </main>
  );
}
