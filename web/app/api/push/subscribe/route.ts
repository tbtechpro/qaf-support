import { NextResponse } from "next/server";
// POST /api/push/subscribe {endpoint,p256dh,auth,learner?} -> stored in PB.
// Proxy exists because browsers on the public link cannot reach PB directly.
const PB = process.env.PB_URL || "http://localhost:8090";
export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const { endpoint, p256dh, auth, learner } = body as Record<string, string>;
  if (!endpoint || !p256dh || !auth) return NextResponse.json({ error: "endpoint, p256dh, auth required" }, { status: 400 });
  try {
    const r = await fetch(`${PB}/api/collections/push_subscriptions/records`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ endpoint, p256dh, auth, learner: learner || "" }),
    });
    if (!r.ok) throw new Error("pb " + r.status);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "subscription store unreachable" }, { status: 502 });
  }
}
