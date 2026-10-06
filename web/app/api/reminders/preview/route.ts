import { NextResponse } from "next/server";
import { SCHEDULES } from "../../../../lib/seed";
// GET /api/reminders/preview -> 24h/3h/1h due list for confirmed seed schedules.
function dues(iso: string) {
  const t = new Date(iso).getTime();
  return [{ k: "24h", due: new Date(t - 24 * 3600e3).toISOString() }, { k: "3h", due: new Date(t - 3 * 3600e3).toISOString() }, { k: "1h", due: new Date(t - 1 * 3600e3).toISOString() }];
}
export async function GET() {
  const out = SCHEDULES.filter((s) => s.datetime_iso).map((s) => ({ title: s.title, kind: s.kind, event: s.datetime_iso, timezone: s.timezone, join_link: s.join_link || null, source: s.source, reminders: dues(s.datetime_iso) }));
  return NextResponse.json({ timezone_default: "Africa/Lagos", channel: "in-app always; WhatsApp/email only if opted-in", items: out });
}
