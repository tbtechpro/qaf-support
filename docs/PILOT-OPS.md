# Pilot ops — keeping the free hosting alive

The pilot runs in a GitHub Codespace (free 2-core, sleeps when idle). No cards, no servers to pay for — but sleep must be managed.

## Sleep behavior (honest)
- The box auto-stops after ~30 min with nobody in it (idle timeout). A stopped box serves an error page, NOT the app — visitors do not wake it.
- During active pilot days, someone (owner or a pinned browser tab in the codespace) keeps it warm.
- Raise the ceiling: GitHub → Settings → Codespaces → **Default idle timeout** → set to the max. Retention is 7 days after stop; data (PB sqlite, uploads) persists in the workspace.

## Daily routine (owner, 2 min)
1. Open https://github.com/codespaces → `qaf-pilot` (auto-starts in ~1-2 min on first open of the day).
2. TERMINAL → `bash scripts/codespace-start.sh` → confirm `web :3000 -> 200` + `pb :8090 -> 200`.
3. PORTS tab → 3000 Public (stays), 8090 Private except during admin work.
4. First visitor clicks Continue once on GitHub's notice, then the app loads.

## Backups (weekly, 3 min)
- In the codespace TERMINAL: `tar -czf backup-$(date +%F).tar.gz pocketbase/pb_data` → download the file via the file explorer (right-click → Download).
- Before any big content change: snapshot first. Restore = stop PB, untar, start PB.

## Quota watch (free tier: 60 core-hours/month, 15GB storage)
- One 2-core box running 8h/day ≈ within quota for a 3-week pilot. Check usage: GitHub → Settings → Billing → Codespaces.
- If quota runs low: stop the box on off-days (`gh codespace stop` or the … menu → Stop), restart on pilot days.

## Incidents
- 502 on the link → box asleep or web down → wake per daily routine.
- Wrong dates/links → organizer withdraws the row in `/organizer`, publishes corrected row (old reminders die with it).
- Missed reminders → check worker log in box: `.codespace-logs/worker.log` tail; confirm event is confirmed (not “Awaiting”) and learner prefs are on.
- Suspected bad data → PB admin at `…-8090…/_/` (make 8090 public temporarily, set Private after).
