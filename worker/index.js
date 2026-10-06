// QAF reminder worker: 24h/3h/1h for sessions + deadlines, same cohort link.
// Free self-host: node-cron style tick every 15min, PB REST, file fallback queue.
// Rules: confirmed only; missing link/date -> skip + log "awaiting"; change -> withdraw old; no dups; tz visible WAT.
const PB_URL = process.env.PB_URL || "http://pocketbase:8090";
const WINDOW_MIN = 15;
export function computeDue(eventIso) {
  const t = new Date(eventIso).getTime();
  if (Number.isNaN(t)) return [];
  return [{ k: "24h", due: new Date(t - 24 * 3600e3).toISOString() }, { k: "3h", due: new Date(t - 3 * 3600e3).toISOString() }, { k: "1h", due: new Date(t - 1 * 3600e3).toISOString() }];
}
export function isDue(dueIso, now = new Date(), windowMin = WINDOW_MIN) {
  const d = new Date(dueIso).getTime() - now.getTime();
  return d <= 0 && d > -windowMin * 60e3;
}
export function reminderText(ev, offset, name = "") {
  const hi = name ? `Hi ${name} — ` : "";
  const tz = ev.timezone || "Africa/Lagos";
  if (ev.kind === "live_session") {
    if (!ev.join_link) return "Awaiting organizer confirmation for the session link.";
    return `${hi}${ev.title} — ${ev.starts_at || ev.datetime_iso} (${tz}). Join (same for cohort): ${ev.join_link}. [${offset} to go] Source: ${ev.source}.`;
  }
  return `${hi}${ev.title} — ${ev.starts_at || ev.datetime_iso} (${tz}). Action: ${ev.action}. [${offset} to go] Source: ${ev.source}.`;
}
async function fetchSchedules() {
  try {
    const r = await fetch(`${PB_URL}/api/collections/schedules/records?perPage=200&filter=${encodeURIComponent("withdrawn != true")}`);
    if (!r.ok) throw new Error("pb " + r.status);
    const j = await r.json();
    return (j.items || []).map((x) => ({ id: x.id, kind: x.kind, title: x.title, starts_at: x.starts_at, timezone: x.timezone, join_link: x.join_link, source: x.source, action: x.action }));
  } catch (e) {
    console.log("[worker] PB unreachable, using seed fallback:", String(e).slice(0, 120));
    return [
      { id: "seed-1", kind: "live_session", title: "Orientation Live", starts_at: "2026-10-13T18:00:00+01:00", timezone: "Africa/Lagos", join_link: "https://meet.example.org/qaf-orientation", source: "Schedule v1 6-Oct-2026", action: "Join via same cohort link" },
      { id: "seed-2", kind: "deadline", title: "Assessment 1 due", starts_at: "2026-10-18T23:59:00+01:00", timezone: "Africa/Lagos", join_link: "", source: "Schedule v1 6-Oct-2026", action: "Submit on learn.qubators.org" },
    ];
  }
}
async function tick() {
  const now = new Date();
  const schedules = await fetchSchedules();
  for (const ev of schedules) {
    if (!ev.starts_at) { console.log(`[worker] skip ${ev.title}: awaiting organizer confirmation (no date)`); continue; }
    if (ev.kind === "live_session" && !ev.join_link) console.log(`[worker] note ${ev.title}: no link yet — reminders will say awaiting, never invent.`);
    for (const { k, due } of computeDue(ev.starts_at)) {
      if (isDue(due, now)) console.log(`[worker] DUE ${k} :: ${reminderText(ev, k).slice(0, 140)}`);
    }
  }
  // Organizer nudges use same offsets: 24h confirm-link/schedule, 1h join.
  console.log(`[worker] tick done ${now.toISOString()} (in-app always; SMTP/WebPush only if opted-in)`);
}
console.log("[worker] QAF reminder worker live. Offsets 24h/3h/1h, window 15m, TZ Africa/Lagos.");
if (!process.env.NO_TICK) { tick(); setInterval(tick, 15 * 60 * 1000); }
