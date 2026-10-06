// Organizer access (free, no vendor).
// Pilot: allowlisted emails + single-use invite codes in localStorage.
// Live (VM): same shapes map to PocketBase `organizers` collection + PB auth
// (email+password or Google OAuth allowlist). RLS: only role=organizer writes
// schedules/content; learners never see others' chats. Every feed item records
// publishedBy for audit.
export type Org = { email: string; role: "owner" | "organizer"; createdAt: string };
export type Invite = { code: string; email: string; used: boolean; createdAt: string };
const ORGS = "qaf-orgs";
const INVITES = "qaf-invites";
const SESSION = "qaf-org-session";
const norm = (e: string) => e.trim().toLowerCase();
export function loadOrgs(): Org[] {
  try { return JSON.parse(localStorage.getItem(ORGS) || "[]"); } catch { return []; }
}
export function loadInvites(): Invite[] {
  try { return JSON.parse(localStorage.getItem(INVITES) || "[]"); } catch { return []; }
}
function save(k: string, v: unknown) { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} }
export function currentOrg(): Org | null {
  try { return JSON.parse(localStorage.getItem(SESSION) || "null"); } catch { return null; }
}
export function logout() { try { localStorage.removeItem(SESSION); } catch {} }
// First-ever organizer bootstraps ownership (live: done in PB admin instead).
export function bootstrapOwner(email: string): Org {
  const orgs = loadOrgs();
  const o: Org = { email: norm(email), role: "owner", createdAt: new Date().toISOString() };
  save(ORGS, [...orgs.filter((x) => x.email !== o.email), o]);
  save(SESSION, o);
  return o;
}
// Owner creates single-use invite code for an organizer email.
export function createInvite(email: string): Invite {
  const code = `QAF-${Math.random().toString(36).slice(2, 6).toUpperCase()}${Date.now().toString(36).slice(-3).toUpperCase()}`;
  const inv: Invite = { code, email: norm(email), used: false, createdAt: new Date().toISOString() };
  save(INVITES, [...loadInvites(), inv]);
  return inv;
}
// Redeem: email + code must match an unused invite (or owner bootstrap if none exist).
export function redeem(email: string, code: string): { ok: boolean; msg: string; org?: Org } {
  const e = norm(email);
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(e)) return { ok: false, msg: "Enter a valid email." };
  const orgs = loadOrgs();
  if (orgs.length === 0) return { ok: true, msg: "First organizer — ownership created.", org: bootstrapOwner(e) };
  const invs = loadInvites();
  const inv = invs.find((i) => i.email === e && i.code.toUpperCase() === code.trim().toUpperCase() && !i.used);
  if (!inv) return { ok: false, msg: "No matching unused invite for this email. Ask the owner for a code." };
  save(INVITES, invs.map((i) => (i === inv ? { ...i, used: true } : i)));
  const o: Org = { email: e, role: "organizer", createdAt: new Date().toISOString() };
  save(ORGS, [...orgs.filter((x) => x.email !== e), o]);
  save(SESSION, o);
  return { ok: true, msg: "Welcome — signed in.", org: o };
}
export function requestAccessLink(adminE164: string, email: string) {
  const t = `Hi, please invite me as QAF organizer. My email: ${email}`;
  return adminE164 ? `https://wa.me/${adminE164.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(t)}` : "";
}
