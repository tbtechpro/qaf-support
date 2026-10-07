import { NextResponse } from "next/server";
// Feedback proxy: browsers can't reach PB directly on the public link.
// POST creates (public rule), GET lists recent for the organizer workspace.
const PB = process.env.PB_URL || "http://localhost:8090";
export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const { vote, stars, note, session_id } = body as Record<string, string>;
  if (vote !== "helped" && vote !== "not_quite") return NextResponse.json({ error: "vote must be helped|not_quite" }, { status: 400 });
  try {
    const r = await fetch(`${PB}/api/collections/feedback/records`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ vote, stars: stars || "", note: (note || "").slice(0, 500), session_id: (session_id || "").slice(0, 64) }),
    });
    if (!r.ok) throw new Error("pb " + r.status);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "feedback store unreachable" }, { status: 502 });
  }
}
export async function GET() {
  try {
    const r = await fetch(`${PB}/api/collections/feedback/records?perPage=50&sort=-created`, { next: { revalidate: 30 } });
    if (!r.ok) throw new Error("pb " + r.status);
    const j = await r.json();
    return NextResponse.json({ items: j.items || [] });
  } catch {
    return NextResponse.json({ items: [], live: false });
  }
}
