// Organizer-fed schedules: sessions (meeting link) + deadlines.
// Pilot store: localStorage now, PocketBase `schedules` collection on VM (same shape).
// Rules: confirmed only; date + tz + source required; sessions need https join link;
// missing -> "Awaiting organizer confirmation", never invented; edit withdraws old reminders.
import { SCHEDULES as SEED, type Schedule } from "./seed";
export type Extra = Schedule & { id: string; withdrawn?: boolean; publishedBy?: string };
const KEY = "qaf-schedules-extra";
export function loadExtra(): Extra[] {
  try { const s = localStorage.getItem(KEY); return s ? JSON.parse(s) : []; } catch { return []; }
}
export function saveExtra(items: Extra[]) {
  try { localStorage.setItem(KEY, JSON.stringify(items)); } catch {}
}
export function allSchedules(): (Schedule & { id?: string; withdrawn?: boolean })[] {
  if (typeof window === "undefined") return SEED;
  const extra = loadExtra().filter((e) => !e.withdrawn);
  const withdrawnTitles = new Set(loadExtra().filter((e) => e.withdrawn).map((e) => e.title));
  return [...extra, ...SEED.filter((s) => !withdrawnTitles.has(s.title))];
}
// Order: live PB rows first, then this-browser extras, then static seed. Dedupe by title.
export function mergeByTitle(...lists: Schedule[][]): Schedule[] {
  const seen = new Set<string>();
  const out: Schedule[] = [];
  for (const l of lists) for (const s of l) {
    if (seen.has(s.title)) continue;
    seen.add(s.title);
    out.push(s);
  }
  return out;
}
export async function fetchLive(): Promise<{ live: boolean; items: Schedule[] }> {
  try {
    const r = await fetch("/api/schedules", { cache: "no-store" });
    if (!r.ok) throw new Error("http " + r.status);
    return (await r.json()) as { live: boolean; items: Schedule[] };
  } catch {
    return { live: false, items: [] };
  }
}
export function validate(ev: { kind: string; title: string; datetime_iso: string; join_link: string; source: string }): string | null {
  if (!ev.title.trim()) return "Title is required.";
  if (!ev.datetime_iso || Number.isNaN(new Date(ev.datetime_iso).getTime())) return "Valid date + time required (with timezone).";
  if (!ev.source.trim()) return "Source is required (e.g. Schedule v2, 20-Oct-2026).";
  if (ev.kind === "live_session" && !/^https:\/\/.+\..+/.test(ev.join_link.trim())) return "Sessions need a valid https:// meeting link — never invent one; leave empty only to show Awaiting confirmation.";
  return null;
}
