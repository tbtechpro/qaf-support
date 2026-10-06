# QAF Support

Web-based AI support assistant for **Qubators AI Foundry** participants.

**Product promise:** Give learners a relevant, supported answer and a practical next step; acknowledge uncertainty and offer human help when information is insufficient.

Learners open a link shared in their WhatsApp group and ask privately in the web app. When an organizer is needed, they review a short summary and open the confirmed organizer WhatsApp inbox — nothing is sent automatically.

## Status — V1 PRD Draft (6 Oct 2026)

This repo currently holds the product definition. Implementation follows after PRD review.

- Spec: `doc/QAF_Support_V1_PRD.md` (16 sections, 270 lines)
- Preview (UI demo only, no live AI / saved records): https://qaf-support.trailblazerent00.chatgpt.site
- Scope: one programme, one pilot cohort

## What V1 includes

- Mobile-friendly web support conversation
- Optional learner context, follow-up questions, continuity
- Answers grounded in approved docs, FAQs, designated website pages, authorized learning-platform resources
- Supplementary general learning advice from reviewed sources (labeled separately)
- Personal weekly plan + opt-in early reminders (24h + 3h + 1h before deadlines and live sessions, same cohort link shown personally, WAT default). In-app by default, optional WhatsApp/email/push where opted in
- Helpfulness feedback, star ratings, repair journey for unsatisfactory answers
- Learner-controlled WhatsApp handoff to confirmed organizer
- Organizer workspace: content review, schedules + verified links, gaps, feedback, pilot monitoring, plus organizer session reminders

## What V1 defers

- Bot inside WhatsApp groups / DMs
- Unsolicited bulk broadcasts without opt-in and verified contact
- Multi-org / multi-cohort support
- Private course content without authorization
- Automated grading, certificates, extensions, permission changes

Reminders are **in-app by default** + optional 24h/3h/1h early reminders via WhatsApp/email/push where opted in. Same verified cohort link for all learners. In-app gives no alert guarantee when app is closed.

## Pilot targets (proposed, to confirm vs baseline)

- Answer accuracy ≥95% of reviewed sample
- Self-service resolution ≥60%
- Repeat-question reduction ≥30%
- Helpfulness ≥80%
- Appropriate escalation: all reviewed cases
- Deadline integrity: all dates traceable to approved schedule

Report sample sizes, response rates, unresolved cases alongside %. Stars ≠ accuracy, link click ≠ resolution.

## Repo layout

```
doc/ QAF_Support_V1_PRD.md   # product requirements, source of truth
docs/ IMPLEMENTATION_PLAN.md # 100% free plan
docs/ ARCHITECTURE.md        # single-VM ports, backup, first boot
docs/ demo.html              # clickable architecture + product demo (double-click)
docker-compose.yml Caddyfile # free self-host (no Supabase/Vercel/Resend)
web/                         # Next.js PWA: ask/plan/reminders/organizer + /api/*
worker/                      # 24h/3h/1h scheduler (15min tick, WAT)
pocketbase/pb_migrations/    # cohorts, schedules, prefs, queue, feedback, docs
content/seed/                # FAQ.md + schedule.csv (same cohort link)
tests/run.mjs                # `node tests/run.mjs` — must pass
```

## Quickstart (free, VM)

```
cp .env.example .env   # fill ADMIN_WHATSAPP_E164, VAPID keys
docker compose up -d --build
docker exec ollama ollama pull llama3.1:8b-instruct-q4_K_M
node tests/run.mjs && node pocketbase/seed_import.mjs
```

## Next steps

1. Finish PRD review bit-by-bit (see TODO tracking in session)
2. Confirm pilot cohort, FAQ / learner guide, authorized lessons, schedule, admin WhatsApp number, baseline + targets
3. Refine UI against PRD, approve support content, validate answers + handoffs, run limited pilot

Technical choices and delivery specs to be addressed after PRD is settled.
