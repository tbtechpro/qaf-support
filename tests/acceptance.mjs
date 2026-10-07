// Behavioral acceptance tests for QAF Support (PRD Sec 13 logic).
// Compiles web TS libs with the project's own tsc, then asserts real behavior.
// Run: node tests/acceptance.mjs (needs web/node_modules installed). Exit 0 = pass.
import { execSync } from "node:child_process";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { createRequire } from "node:module";

let pass = 0, fail = 0;
const ok = (c, m) => { if (c) { pass++; console.log("PASS " + m); } else { fail++; console.log("FAIL " + m); } };

// localStorage shim (organizers lib persists via localStorage; Node has none)
globalThis.localStorage = new (class {
  constructor() { this.m = new Map(); }
  getItem(k) { const v = this.m.get(k); return v === undefined ? null : v; }
  setItem(k, v) { this.m.set(k, String(v)); }
  removeItem(k) { this.m.delete(k); }
})();

process.env.NO_TICK = "1";
const tmp = mkdtempSync(join(tmpdir(), "qaf-test-"));
try {
  execSync(`npx tsc lib/seed.ts lib/schedules.ts lib/organizers.ts --outDir ${tmp} --module commonjs --target es2020 --skipLibCheck`, { cwd: "web", stdio: "pipe" });
} catch (e) {
  console.log("FAIL typescript compile: " + String(e.message).slice(0, 200));
  process.exit(1);
}
const req = createRequire(join(tmp, "x.js"));
const seed = req(join(tmp, "seed.js"));
const sched = req(join(tmp, "schedules.js"));
const orgs = req(join(tmp, "organizers.js"));
process.env.NO_TICK = "1";
const worker = await import("../worker/index.js");

// --- Sec 13: relevant answers + clarification ---
let r = seed.answer("How do I submit?");
ok(!r.escalation && /which assessment/i.test(r.text), "ambiguous submit asks which assessment");
r = seed.answer("How do I submit Assessment 1?");
ok(/learn\.qubators\.org/.test(r.text) && /Learner Guide/.test(r.text), "assessment answer has steps + source");
r = seed.answer("Where is the live session link?", "Ada");
ok(/Ada/.test(r.text) && /meet\.example\.org/.test(r.text) && /24h/.test(r.text), "session answer personalized with same link + 24/3/1");
r = seed.answer("I am behind");
ok(/waiver|deadline waiver/i.test(r.text), "behind answer never waives deadline");
r = seed.answer("I don't understand this lesson");
ok(/which concept/i.test(r.text), "lesson asks which concept first");
r = seed.answer("blargh wibble?");
ok(r.escalation === true, "unknown escalates to human instead of guessing");

// --- handoff: reviewable, never auto-sent, digits only ---
const w = seed.waLink("+234 807 823 9107", "Hi, I need help: x");
ok(w === "https://wa.me/2348078239107?text=" + encodeURIComponent("Hi, I need help: x"), "wa.me digits stripped + encoded");
ok(seed.waLink("", "x") === "", "no admin number yields no link (honest fallback)");

// --- organizer feed validation (never invent link/date) ---
const V = sched.validate;
ok(V({ kind: "x", title: "", datetime_iso: "2026-10-13T18:00", join_link: "", source: "s" }) !== null, "rejects empty title");
ok(V({ kind: "x", title: "t", datetime_iso: "not-a-date", join_link: "", source: "s" }) !== null, "rejects bad date");
ok(V({ kind: "live_session", title: "t", datetime_iso: "2026-10-13T18:00", join_link: "notaurl", source: "s" }) !== null, "rejects non-https session link");
ok(V({ kind: "live_session", title: "t", datetime_iso: "2026-10-13T18:00", join_link: "https://m.example.org/x", source: "Schedule v2" }) === null, "accepts valid session");
ok(V({ kind: "deadline", title: "t", datetime_iso: "2026-10-18T23:59", join_link: "", source: "Schedule v2" }) === null, "deadline needs no link");

// --- merge: live PB first, dedupe by title ---
const merged = sched.mergeByTitle(
  [{ title: "Orientation Live", kind: "live_session", datetime_iso: "B", timezone: "WAT", join_link: "L2", source: "PB", action: "", cohort_id: "p" }],
  [{ title: "Orientation Live", kind: "live_session", datetime_iso: "A", timezone: "WAT", join_link: "L1", source: "seed", action: "", cohort_id: "p" }]
);
ok(merged.length === 1 && merged[0].join_link === "L2", "live row wins, no duplicates");

// --- worker: 24h/3h/1h math, window, text ---
const dues = worker.computeDue("2026-10-13T18:00:00+01:00");
ok(dues.length === 3 && dues[0].k === "24h" && dues[2].k === "1h", "three offsets 24/3/1");
ok(worker.isDue(new Date(Date.now() - 5 * 60e3).toISOString()) === true, "due 5m ago is due");
ok(worker.isDue(new Date(Date.now() + 3600e3).toISOString()) === false, "due in 1h is not due");
ok(/Awaiting organizer confirmation/.test(worker.reminderText({ kind: "live_session", title: "t", source: "s", timezone: "WAT", join_link: "" }, "24h")), "missing link never invented");
ok(/same for cohort/.test(worker.reminderText({ kind: "live_session", title: "t", starts_at: "x", timezone: "WAT", join_link: "L", source: "s", action: "" }, "1h")), "session text carries same link");

// --- organizer access: bootstrap, single-use invites ---
let red = orgs.redeem("owner@example.org", "anything");
ok(red.ok && red.org.role === "owner", "first organizer bootstraps ownership");
const inv = orgs.createInvite("help@example.org");
ok(/^QAF-/.test(inv.code) && inv.used === false, "invite code issued unused");
red = orgs.redeem("help@example.org", inv.code);
ok(red.ok && red.org.role === "organizer", "valid invite redeems once");
red = orgs.redeem("help@example.org", inv.code);
ok(!red.ok, "used invite rejected");
red = orgs.redeem("stranger@example.org", inv.code);
ok(!red.ok, "wrong email rejected");
ok(orgs.requestAccessLink("2348078239107", "a@b.c").includes("wa.me/2348078239107"), "request-access points at admin");

// --- repair journey: one revised attempt, never a repeat, human route after ---
let rep = seed.repairReply("simpler", "Assessment 1 — approved steps: open X.");
ok(!rep.escalation && /Simpler version/.test(rep.text) && rep.text !== "Assessment 1 — approved steps: open X.", "simpler revises, not repeats");
rep = seed.repairReply("different", "Line one.\nLine two.");
ok(!rep.escalation && /Different angle/.test(rep.text), "different reframes");
rep = seed.repairReply("wrong", "Some claim.");
ok(rep.escalation && /organizer review/.test(rep.text), "wrong flags source for review + escalates");
rep = seed.repairReply("organizer", "Anything.");
ok(rep.escalation && /editable WhatsApp summary/.test(rep.text), "organizer offers reviewable handoff");

console.log(fail ? `\n${fail} FAILURES (${pass} passed)` : `\nALL PASS (${pass})`);
rmSync(tmp, { recursive: true, force: true });
process.exit(fail ? 1 : 0);
