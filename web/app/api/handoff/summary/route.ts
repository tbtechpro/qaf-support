import { NextResponse } from "next/server";
// POST /api/handoff/summary { question, attempts } -> editable summary + wa.me link. Nothing auto-sent.
export async function POST(req: Request) {
  const { question = "", attempts = "" } = await req.json().catch(() => ({}));
  const summary = `Hi, I need help: ${String(question).slice(0, 300)}${attempts ? ` | Tried: ${String(attempts).slice(0, 300)}` : ""}`;
  const admin = process.env.NEXT_PUBLIC_ADMIN_WHATSAPP || "";
  const link = admin ? `https://wa.me/${admin.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(summary)}` : "";
  return NextResponse.json({ summary, wa_link: link, note: "Learner reviews/edits, then chooses to open. No auto-send, no passwords." });
}
