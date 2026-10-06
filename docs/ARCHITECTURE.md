# Architecture (free P0)

Single Oracle Always Free VM (4 OCPU ARM / 24GB / 200GB / 10TB egress).

Ports (internal, Caddy fronts 80/443):
- web :3000 — Next.js PWA (chat, plan, prefs, feedback, organizer)
- pocketbase :8090 — auth, cohorts, schedules + same-for-cohort link, plans, inbox, feedback + RLS rules
- worker — node-cron 15min: due = event_time - (24h|3h|1h); write inbox + Web Push; SMTP only if opted-in
- redis :6379 — BullMQ
- ollama :11434 — `ollama pull llama3.1:8b-instruct-q4_K_M`
- uptime-kuma :3001 — warm ping + alerts

Backup: nightly `tar pb_data` + `pg` snapshot to VM volume + weekly copy to R2 free 10GB or local disk.
Restore: stop PB, untar, restart.

Caddyfile (VM):
```
qaf.example.org {
  reverse_proxy web:3000
  handle /pb/* { reverse_proxy pocketbase:8090 }
}
```

First boot on VM:
```
docker compose up -d --build
docker exec ollama ollama pull llama3.1:8b-instruct-q4_K_M
# create PB admin, import content/seed/schedule.csv + FAQ.md after organizer approval
```
