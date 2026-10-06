import { NextResponse } from "next/server";
import { answer } from "../../../lib/seed";
// POST /api/ask { question, name } -> grounded answer, source, escalation flag.
// Free: seed/approved-docs extractive now; Ollama local when OLLAMA_URL set (no paid LLM).
export async function POST(req: Request) {
  const { question = "", name = "" } = await req.json().catch(() => ({}));
  if (!String(question).trim()) return NextResponse.json({ error: "Empty question. Ask e.g. How do I submit?" }, { status: 400 });
  const ollama = process.env.OLLAMA_URL;
  if (ollama) {
    try {
      const r = await fetch(`${ollama}/api/generate`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ model: process.env.OLLAMA_MODEL || "llama3.1:8b-instruct-q4_K_M", prompt: `Use only approved QAF docs. If unsure say unsure and escalate. Q: ${question}`, stream: false }) });
      if (r.ok) { const j = await r.json(); return NextResponse.json({ text: String(j.response || "").slice(0, 2000), source: "Ollama local (approved-docs prompt)", escalation: false }); }
    } catch { /* fall through to seed */ }
  }
  const r = answer(String(question), String(name));
  return NextResponse.json({ text: r.text, escalation: r.escalation, source: "seed/approved-docs" });
}
