# QAF Support — Implementation Plan (100% Free, Zero-Cost Pilot)

**Date:** 6 Oct 2026
**PRD:** `doc/QAF_Support_V1_PRD.md`
**Scope:** one programme, one pilot cohort. 24h+3h+1h early reminders for sessions + deadlines, same cohort link, organizer reminders.
**Principle:** remove anything that can incur charges. Self-host where managed free has quotas.

## 1. Cost audit — removed vs free replacement

| Paid risk | Removed | Free replacement (no billing) |
|---|---|---|
| Supabase overage (500MB, 5GB egress, pause) | No managed DB | PocketBase self-hosted on Oracle Always Free VM (unlimited MAU/rows, disk-only limit) |
| Vercel overage (100GB BW, cron daily) | No Vercel | Next.js Docker on same VM + Caddy + Cloudflare Tunnel (10TB egress/mo free) |
| Resend/Brevo overage (100–300/d) | No email vendor | In-app inbox + Web Push VAPID (free, unlimited) primary; self-hosted Postal/SMTP on VM or Gmail 500/d fallback, opt-in only |
| WhatsApp Cloud API (templates, per-convo) | No Cloud API, no auto-send | `wa.me` click-to-chat handoff + manual forward to existing group (free, learner sends) |
| Upstash/QStash overage (500/d) | No QStash | node-cron + Redis/BullMQ self-hosted in Docker (unlimited) |
| OpenAI/paid LLM | No paid LLM | Ollama Llama-3.1-8B quantized local (unlimited, private) + optional Gemini Flash free-tier (no card, rate-limited, fallback to local) |
| Zoom paid / Meet limits | No paid meeting | Google Meet free (60min/100) or Jitsi self-hosted on same VM (unlimited, same cohort link) |
| Sentry/PostHog paid | No paid observability | PocketBase logs + Uptime Kuma (self-hosted) + Cloudflare analytics free + GitHub Actions free CI |

No credit card required for pilot if you use Oracle Always Free + Cloudflare free + local builds.

## 2. Free architecture (single VM)

Oracle Always Free ARM: 4 OCPU / 24GB RAM / 200GB disk / 10TB egress.

```
Learner PWA (Next.js) → Caddy (TLS) → Cloudflare Tunnel
  ├─ PocketBase :8090 (auth, cohorts, schedules, links, plans, inbox, feedback) — SQLite volumes
  ├─ web :3000 (chat shell, plan, prefs, feedback, organizer workspace, RLS via PB rules)
  ├─ api (Next.js routes: /ask, /reminders/preview, /handoff/summary)
  ├─ worker (node-cron 15min: compute 24h/3h/1h due, write inbox, Web Push, optional SMTP, never invent link/date)
  ├─ redis (BullMQ queue, unlimited)
  ├─ ollama (llama3.1:8b-instruct-q4, unlimited local answers, source-grounded)
  └─ jitsi or Meet link (same verified cohort link per session)
```

Data rules: confirmed events only; missing schedule/link → “Awaiting organizer confirmation”; change → withdraw old, flag revised; no duplicates/wrong cohort; timezone visible, WAT default; pause/off per category; organizer 24h confirm-link + 1h join nudges (in-workspace + optional self-SMTP/Web Push where opted in).

## 3. Repo layout (to scaffold)

```
web/                 # Next.js PWA (chat, plan, reminders prefs, feedback, organizer)
pocketbase/          # pb_data volume, migrations, seed (FAQ, schedule.csv with same link)
worker/              # 24/3/1 scheduler, Web Push sender
docker-compose.yml   # caddy, web, pocketbase, redis, worker, ollama, uptime-kuma
docs/ARCHITECTURE.md # env, ports, backup/restore
content/seed/        # FAQ template, schedule template
```

Env (free, no secrets vendor): `PB_URL`, `VAPID_PUBLIC/PRIVATE`, `SMTP_HOST=self`, `LLM=ollama`, `TZ=Africa/Lagos`, `ADMIN_WHATSAPP_E164` (wa.me only, no API).

## 4. Phases with PRD acceptance

- **P0 Infra (free):** Oracle VM + Docker + Caddy + Tunnel + PocketBase + backup script. Accept: organizer-only access, WAT tz.
- **P1 Learner shell:** shared-link entry, welcome “Welcome to QAF Support…”, optional context (name/stage/depth/device/time), suggested topics, organizer contact visible. Accept: Entry on phone/laptop, clarify when ambiguous.
- **P2 Answers:** Ollama grounded (answer → steps → source → next step), conflict → escalate, withdrawn stops. Accept: source cited, no invented dates/rules/links, external labeled.
- **P3 Plan:** editable weekly plan, personal ≠ official, weekly check-in. Accept: personalization uses only supplied context.
- **P4 Reminders (core new scope):** 24h/3h/1h sessions + deadlines, same cohort link shown personally, in-app + Web Push always, SMTP/wa.me-manual only if opted-in/verified. Organizer 24h/1h nudges. Accept: only confirmed trigger, timing/tz/channel/opt-out clear, no dups, withdrawn stops.
- **P5 Handoff:** explain why → editable summary → open confirmed wa.me → learner sends, no auto-send, no passwords, click = attempt. Accept: reviewed summary, nothing auto-sent.
- **P6 Organizer:** approve content (owner/cohort/review date), publish schedule/links, confirm contacts/hours, review unresolved/feedback/inaccuracies, promote repeats to FAQ, pilot metrics + sample sizes. Accept: restricted access, no learner cross-view.
- **P7 Readiness:** seed approved content, test Sec 13 cases (known, ambiguous, outdated, conflict, dissatisfied, handoff, failure/retry), verify all dates + links independently.
- **P8 Pilot:** measure accuracy ≥95%, self-service ≥60%, repeats −30%, helpfulness ≥80%, escalation 100%, deadline integrity 100% + sample sizes, response rates, unresolved.

## 5. Inputs still needed (block build)

Cohort + learners; FAQ/guide/policies; authorized lessons; schedule + same-for-cohort verified link per session; learner opt-ins + contacts + tz; organizer reminder contacts/channels; admin WhatsApp + owners + response hours; baseline + targets + review sample; tone sign-off.

## 6. Free-tier risks (honest)

- Self-email deliverability (warm up SPF/DKIM, keep email non-critical; in-app is source of truth).
- Local LLM weaker than hosted — keep answers extractive from approved docs, escalate on uncertainty.
- You own uptime/backups (nightly PB SQLite snapshot to R2 free 10GB or VM volume).
- iOS Web Push needs installed PWA + iOS 16.4+; in-app inbox covers the gap (PRD: no guarantee when closed).
- Oracle idle reclaim: keep VM warm with Uptime Kuma pings + weekly activity (unlike Supabase 7-day pause, Oracle does not pause but can reclaim idle — keep load + backups).

## 7. View

- Code: https://github.com/tbtechpro/qaf-support
- This plan: `docs/IMPLEMENTATION_PLAN.md`
- PRD: `doc/QAF_Support_V1_PRD.md`
- UI preview (demo only, may need login, 401 via fetch): https://qaf-support.trailblazerent00.chatgpt.site

Approve this plan and tell me to scaffold P0 (docker-compose + web skeleton + PocketBase seed), or request changes first — no build started yet.
