export type Schedule = { cohort_id: string; kind: "live_session" | "deadline"; title: string; datetime_iso: string; timezone: string; join_link: string; source: string; action: string };
export const SCHEDULES: Schedule[] = [
  { cohort_id: "pilot-2026-01", kind: "live_session", title: "Orientation Live", datetime_iso: "2026-10-13T18:00:00+01:00", timezone: "Africa/Lagos", join_link: "https://meet.example.org/qaf-orientation", source: "Schedule v1 6-Oct-2026", action: "Join via same cohort link" },
  { cohort_id: "pilot-2026-01", kind: "deadline", title: "Assessment 1 due", datetime_iso: "2026-10-18T23:59:00+01:00", timezone: "Africa/Lagos", join_link: "", source: "Schedule v1 6-Oct-2026", action: "Submit on learn.qubators.org" },
];
export const FAQS = [
  { q: "submit", a: "Assessment 1 — approved steps: 1. Open learn.qubators.org → Assessments → Assessment 1 2. Upload → Confirm.", source: "Learner Guide v1" },
];
export function answer(q: string, name = ""): { text: string; escalation: boolean } {
  const s = q.toLowerCase();
  const hi = name ? `Hi ${name} — ` : "";
  if (s.includes("submit")) {
    if (!s.includes("assessment 1") && !s.includes("assessment 2")) {
      return { text: "Which assessment do you mean — Assessment 1 or Assessment 2? I’ll give the approved steps once confirmed.", escalation: false };
    }
    return { text: `${hi}Assessment 1 — approved steps: open learn.qubators.org → Assessments → Assessment 1 → Upload → Confirm. Source: Learner Guide v1. Next: tell me if upload fails and I’ll prepare a WhatsApp summary.`, escalation: false };
  }
  if (s.includes("link") || s.includes("live") || s.includes("session") || s.includes("join")) {
    const ev = SCHEDULES.find((x) => x.kind === "live_session");
    if (!ev || !ev.join_link) return { text: "Awaiting organizer confirmation for the session link — I won’t invent one. Ask me again after the schedule is confirmed, or request an organizer.", escalation: true };
    return { text: `${hi}${ev.title} — ${ev.datetime_iso} (${ev.timezone}). Join (same for cohort): ${ev.join_link}. Source: ${ev.source}. You’ll get 24h / 3h / 1h nudges.`, escalation: false };
  }
  if (s.includes("behind")) return { text: "Tell me available hours + project stage and I’ll make a manageable next step. Personal plan ≠ deadline waiver. Would a simple example or step-by-step help more?", escalation: false };
  if (s.includes("lesson") || s.includes("understand")) return { text: "Which concept or step is difficult? Tell me the lesson + step and I’ll explain with an example from authorized material only.", escalation: false };
  return { text: "I’m not sure from approved docs — I won’t guess. I can prepare an editable WhatsApp summary for the confirmed organizer.", escalation: true };
}
export function waLink(adminE164: string, text: string) {
  if (!adminE164) return "";
  return `https://wa.me/${adminE164.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(text)}`;
}
// Repair journey (PRD Sec 9): one revised attempt per complaint, then human route. Never repeats the same text.
export type RepairKind = "simpler" | "different" | "wrong" | "organizer";
export function repairReply(kind: RepairKind, lastBot: string): { text: string; escalation: boolean } {
  const short = lastBot.split("\n")[0].slice(0, 220);
  if (kind === "simpler") return { text: `Simpler version: ${short}\nTell me which single step trips you up and I'll walk just that one. No jargon, one step at a time.`, escalation: false };
  if (kind === "different") return { text: `Different angle on the same answer: ${short}\nExample-first: picture the finished result, then work backwards to today's smallest action. Want me to tailor it to your project stage?`, escalation: false };
  if (kind === "wrong") return { text: `Thanks for flagging — I've marked this for organizer review so the underlying source gets fixed, not just this answer. In the meantime, treat it as unconfirmed and check with an organizer for anything deadline-critical.`, escalation: true };
  return { text: `Understood — let's bring in a person. I'll prepare an editable WhatsApp summary of your question and what we've tried. Nothing sends until you approve it.`, escalation: true };
}
