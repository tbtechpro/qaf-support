"use client";
import { useState } from "react";
import { answer, waLink } from "../../lib/seed";
type M = { who: "bot" | "user"; text: string };
export default function Ask() {
  const [msgs, setMsgs] = useState<M[]>([{ who: "bot", text: "Welcome to QAF Support. What would you like help with today? (Name optional — tell me what to call you.)" }]);
  const [q, setQ] = useState("");
  const [name, setName] = useState("");
  const [vote, setVote] = useState<string>("");
  const send = () => {
    if (!q.trim()) return;
    const r = answer(q, name);
    setMsgs((m) => [...m, { who: "user", text: q }, { who: "bot", text: r.text + (r.escalation ? "\n\n[Organizer needed — review the summary before sending. Nothing auto-sent.]" : "") }]);
    setQ("");
  };
  const summary = `Hi, I need help: ${msgs.filter((m) => m.who === "user").slice(-2).join(" | ")}`;
  return (
    <main style={{ maxWidth: 640, margin: "0 auto", padding: 16 }}>
      <h2>Ask</h2>
      <input value={name} onChange={(e) => setName(e.target.value)} placeholder="What should I call you? (optional)" style={{ width: "100%", padding: 8, marginBottom: 8 }} />
      <div style={{ border: "1px solid #ddd", borderRadius: 12, padding: 12, minHeight: 220 }}>
        {msgs.map((m, i) => (<p key={i} style={{ background: m.who === "bot" ? "#f1f5f9" : "#dbeafe", padding: 8, borderRadius: 8 }}>{m.text}</p>))}
      </div>
      <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
        <input value={q} onChange={(e) => setQ(e.target.value)} onKeyDown={(e) => e.key === "Enter" && send()} placeholder="How do I submit?" style={{ flex: 1, padding: 10 }} />
        <button onClick={send}>Send</button>
      </div>
      <div style={{ marginTop: 8, display: "flex", gap: 8 }}>
        <button onClick={() => setVote("helped")}>This helped</button>
        <button onClick={() => setVote("not_quite")}>Not quite</button>
        {vote && <span>Vote: {vote} (tracked separately from resolution)</span>}
        <a href={waLink(process.env.NEXT_PUBLIC_ADMIN_WHATSAPP || "", summary) || "#ask"} target="_blank">WhatsApp organizer →</a>
      </div>
    </main>
  );
}
