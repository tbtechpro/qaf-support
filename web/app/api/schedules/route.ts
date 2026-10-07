import { NextResponse } from "next/server";
import { SCHEDULES, type Schedule } from "../../../lib/seed";
// GET /api/schedules -> live PB rows when reachable, seed fallback otherwise.
// PB is public-read for schedules; writes stay organizer-only.
const PB = process.env.PB_URL || "http://localhost:8090";
export async function GET() {
  try {
    const r = await fetch(
      `${PB}/api/collections/schedules/records?perPage=200&filter=${encodeURIComponent("(withdrawn=false||withdrawn=null)")}`,
      { next: { revalidate: 60 } }
    );
    if (!r.ok) throw new Error("pb " + r.status);
    const j = await r.json();
    const items: Schedule[] = (j.items || [])
      .filter((x: { starts_at?: string }) => x.starts_at)
      .map((x: { kind: Schedule["kind"]; title: string; starts_at: string; timezone: string; join_link?: string; source: string; action?: string }) => ({
        cohort_id: "pilot-2026-01",
        kind: x.kind,
        title: x.title,
        datetime_iso: x.starts_at,
        timezone: x.timezone || "Africa/Lagos",
        join_link: x.join_link || "",
        source: x.source,
        action: x.action || "",
      }));
    return NextResponse.json({ live: true, items });
  } catch {
    return NextResponse.json({ live: false, items: SCHEDULES });
  }
}
