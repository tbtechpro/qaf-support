// Dry-run seed import: reads content/seed/*, validates, prints PB payloads.
// Run on VM with PB_URL + admin auth to actually upsert. Free, no vendor.
import { readFileSync } from "node:fs";
const csv = readFileSync("content/seed/schedule.csv", "utf8").trim().split("\n");
const head = csv[0].split(",");
const rows = csv.slice(1).map((l) => Object.fromEntries(l.split(",").map((v, i) => [head[i], v])));
console.log(`[seed] ${rows.length} schedule rows`);
for (const r of rows) {
  if (!r.datetime_iso || Number.isNaN(new Date(r.datetime_iso).getTime())) { console.error("[seed] BAD DATE", r); process.exit(1); }
  if (!r.timezone) { console.error("[seed] MISSING TZ", r); process.exit(1); }
  console.log(`[seed] ok ${r.type} :: ${r.title} :: ${r.datetime_iso} (${r.timezone}) link=${r.join_link || "awaiting"}`);
}
const faq = readFileSync("content/seed/FAQ.md", "utf8");
if (!faq.includes("Source:")) { console.error("[seed] FAQ missing Source"); process.exit(1); }
console.log("[seed] FAQ ok (has sources). Ready to upsert to PB collections: cohorts, schedules, content_docs.");
