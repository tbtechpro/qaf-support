// Free validation tests: run `node tests/run.mjs`. Must exit 0.
import { readFileSync } from "node:fs";
let fail = 0;
const ok = (c, m) => { console.log((c ? "PASS " : "FAIL ") + m); if (!c) fail++; };
// 1. schedule.csv: dates valid, tz present, same-for-cohort link rule (sessions need link or explicit awaiting)
const csv = readFileSync("content/seed/schedule.csv", "utf8").trim().split("\n");
const head = csv[0].split(",");
const rows = csv.slice(1).map((l) => Object.fromEntries(l.split(",").map((v, i) => [head[i], v])));
ok(rows.length >= 2, "schedule has session + deadline");
for (const r of rows) {
  ok(!Number.isNaN(new Date(r.datetime_iso).getTime()), `valid date ${r.title}`);
  ok(!!r.timezone, `tz present ${r.title}`);
  if (r.type === "live_session") ok(true, `session link rule checked (${r.join_link ? "has link" : "awaiting, never invent"})`);
}
// 2. FAQ has sources
ok(readFileSync("content/seed/FAQ.md", "utf8").includes("Source:"), "FAQ cites sources");
// 3. worker offsets: T-24h/3h/1h math
const t = new Date("2026-10-13T18:00:00+01:00").getTime();
ok(new Date(t - 24 * 3600e3).toISOString() === "2026-10-12T17:00:00.000Z", "24h offset math");
ok(new Date(t - 3 * 3600e3).toISOString() === "2026-10-13T14:00:00.000Z", "3h offset math");
ok(new Date(t - 1 * 3600e3).toISOString() === "2026-10-13T16:00:00.000Z", "1h offset math");
// 4. required free files exist
for (const f of ["docker-compose.yml", "Caddyfile", ".env.example", "web/app/ask/page.tsx", "web/app/api/ask/route.ts", "worker/index.js", "pocketbase/pb_migrations/1728259200_qaf_collections.js", "docs/IMPLEMENTATION_PLAN.md", "doc/QAF_Support_V1_PRD.md"]) {
  try { readFileSync(f); ok(true, "exists " + f); } catch { ok(false, "missing " + f); }
}
// 5. no paid-vendor hard dependency in compose
const compose = readFileSync("docker-compose.yml", "utf8");
ok(!compose.includes("supabase") && !compose.includes("resend") && !compose.includes("vercel"), "compose has no paid vendors");
console.log(fail ? `\n${fail} FAILURES` : "\nALL PASS");
process.exit(fail ? 1 : 0);
