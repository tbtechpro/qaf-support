import { NextResponse } from "next/server";
import { SCHEDULES, type Schedule } from "../../../../lib/seed";
// GET /api/reminders/preview -> 24h/3h/1h due list for confirmed schedules.
// Live PB rows when reachable (withdrawn excluded), static seed fallback otherwise.
const PB = process.env.PB_URL || "http://localhost:8090";
function dues(iso: string) {
  const t = new Date(iso).getTime();
  return [{ k: "24h", due: new Date(t - 24 * 3600e3).toISOString() }, { k: "3h", due: new Date(t - 3 * 3600e3).toISOString() }, { k: "1h", due: new Date(t - 1 * 3600e3).toISOString() }];
}
type Item = { title: string; kind: string; event: string; timezone: string; join_link: string | null; source: string; reminders: { k: string; due: string }[] };
function shape(title: string, kind: string, iso: string, timezone: string, join_link: string, source: string): Item {
  return { title, kind, event: iso, timezone, join_link: join_link || null, source, reminders: dues(iso) };
}
export async function GET() {
  const base = { timezone_default: "Africa/Lagos", channel: "in-app always; WhatsApp/email only if opted-in" };
  try {
    const r = await fetch(
      `${PB}/api/collections/schedules/records?perPage=200&filter=${encodeURIComponent("(withdrawn=false||withdrawn=null)")}`,
      { next: { revalidate: 60 } }
    );
    if (!r.ok) throw new Error("pb " + r.status);
    const j = await r.json();
    const items: Item[] = ((j.items || []) as { title: string; kind: string; starts_at?: string; timezone?: string; join_link?: string; source: string }[])
      .filter((x) => x.starts_at)
      .map((x) => shape(x.title, x.kind, x.starts_at as string, x.timezone || "Africa/Lagos", x.join_link || "", x.source));
    return NextResponse.json({ ...base, live: true, items });
  } catch {
    const out = SCHEDULES.filter((s: Schedule) => s.datetime_iso).map((s: Schedule) => shape(s.title, s.kind, s.datetime_iso, s.timezone, s.join_link || "", s.source));
    return NextResponse.json({ ...base, live: false, items: out });
  }
}
