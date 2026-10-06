# DEPLOY — QAF Support to Oracle Always Free VM (100% free)

**You do cloud clicks, I do repo/verify. Nothing paid.**

## 0. Prerequisites (tell me these)
- [ ] Oracle Cloud account (Always Free tier eligible)
- [ ] Domain (e.g. `qaf.yourdomain.org`) with DNS you can edit — or use nip.io for pilot
- [ ] Admin WhatsApp number in `234...` international format (no `+`)
- [ ] Approved FAQ + schedule rows (title, date/time WAT, meeting link, source)

## 1. Create VM (you, ~10 min)
1. Oracle Console → Compute → Create instance → **Always Free** shape: Ampere ARM (4 OCPU, 24GB) + 200GB boot volume, Ubuntu 24.04.
2. Add SSH public key, open ingress: 80, 443 (and 22 for you only).
3. Note public IP. SSH in: `ssh ubuntu@<IP>`.

## 2. Harden + Docker (paste on VM)
```bash
sudo apt update && sudo apt -y upgrade
sudo ufw allow 22,80,443/tcp && sudo ufw --force enable
sudo apt install -y docker.io docker-compose-plugin fail2ban unattended-upgrades
sudo usermod -aG docker $USER && newgrp docker
```

## 3. DNS (you, 2 min)
- A record: `qaf.yourdomain.org` → VM public IP. (No domain? use `<IP>.nip.io` as DOMAIN.)

## 4. Ship code (paste on VM)
```bash
sudo mkdir -p /srv && sudo chown $USER:$USER /srv
git clone https://github.com/tbtechpro/qaf-support /srv/qaf && cd /srv/qaf
cp .env.example .env   # fill: DOMAIN, ADMIN_WHATSAPP_E164, VAPID_*, PB_ADMIN_*
cp Caddyfile.prod Caddyfile   # set {$DOMAIN}
docker compose up -d --build
docker exec ollama ollama pull llama3.1:8b-instruct-q4_K_M
```

## 5. PocketBase live (you in browser, 5 min)
1. Open `https://<DOMAIN>/pb/_/` → create admin (matches `.env`).
2. Collections auto-apply from `pocketbase/pb_migrations`. Verify RLS: only organizers write.
3. Import: run `node pocketbase/seed_import.mjs` checks first, then upsert approved FAQ + schedule rows.
4. Create owner organizer account; invite the rest (single-use codes via WhatsApp DM).

## 6. Go-live checks (we do together)
- [ ] `https://<DOMAIN>` loads, all nav 200
- [ ] TLS valid (Caddy auto)
- [ ] Test matrix (PRD Sec 13): known Q, ambiguous, outdated, conflict, dissatisfied, handoff, failure/retry
- [ ] All dates + links independently verified; withdrawn test stops reminders
- [ ] Backups: `sudo crontab -e` → `0 2 * * * /srv/qaf/scripts/backup.sh`; one restore drill
- [ ] Uptime Kuma: add monitors for web, PB, worker tick
- [ ] Push/Web Push: VAPID set → test one; SMTP stays OFF until SPF/DKIM warm (in-app is source of truth)

## 7. Announce (paste in WhatsApp group)
> QAF Support is live: https://<DOMAIN>. Ask privately, get approved answers + sources. Sessions + deadlines remind at 24h/3h/1h (in-app; WhatsApp/email only if you opt in). Need a person? Use WhatsApp organizer in the app — nothing auto-sent.

## 8. Rollback
- Before each publish: `scripts/backup.sh` snapshot. Roll back: `docker compose down && git checkout <prev> && docker compose up -d --build`, restore `pb_data` tar if needed.

## Gaps closed by this prep
CI (`node tests/run.mjs` + `npm run build` on push), backup script, prod Caddy template, PWA icon, hardening steps.
Still VM-side: SMTP off by default, local LLM ~5GB pull, iOS push needs installed PWA 16.4+.
