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
- Personal weekly plan + in-app-only reminders (deadlines, live sessions, weekly check-in, WAT default)
- Helpfulness feedback, star ratings, repair journey for unsatisfactory answers
- Learner-controlled WhatsApp handoff to confirmed organizer
- Organizer workspace: content review, schedules, gaps, feedback, pilot monitoring

## What V1 defers

- Bot inside WhatsApp groups / DMs
- Automatic WhatsApp broadcasts, email / push outside web app
- Multi-org / multi-cohort support
- Private course content without authorization
- Automated grading, certificates, extensions, permission changes

Reminders appear **within QAF Support only** — no alert guarantee when app is closed.

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
doc/
  QAF_Support_V1_PRD.md   # product requirements, source of truth for V1
README.md                 # this file
```

## Next steps

1. Finish PRD review bit-by-bit (see TODO tracking in session)
2. Confirm pilot cohort, FAQ / learner guide, authorized lessons, schedule, admin WhatsApp number, baseline + targets
3. Refine UI against PRD, approve support content, validate answers + handoffs, run limited pilot

Technical choices and delivery specs to be addressed after PRD is settled.
