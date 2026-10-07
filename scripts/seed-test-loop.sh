#!/usr/bin/env bash
# Proves organizer-feed -> PB -> worker 24h reminder loop with a TEST row, then deletes it.
# Usage: bash scripts/seed-test-loop.sh <superuser-password>
set -euo pipefail
PW="${1:?superuser password required}"
ROOT=/workspaces/qaf-support
TOKEN=$(curl -s --max-time 10 http://localhost:8090/api/collections/_superusers/auth-with-password -H 'Content-Type: application/json' -d "{\"identity\":\"pilot-admin@qaf-support.local\",\"password\":\"$PW\"}" | node -e "let s='';process.stdin.on('data',d=>s+=d).on('end',()=>console.log(JSON.parse(s).token))")
echo "auth ok"
START=$(node -e "console.log(new Date(Date.now() + (23*60+50)*60000).toISOString())")
ID=$(curl -s --max-time 10 -X POST http://localhost:8090/api/collections/schedules/records -H 'Content-Type: application/json' -H "Authorization: $TOKEN" -d "{\"kind\":\"live_session\",\"title\":\"TEST loop-check\",\"starts_at\":\"$START\",\"timezone\":\"Africa/Lagos\",\"join_link\":\"https://example.org/test\",\"source\":\"loop-check\",\"action\":\"Join test\"}" | node -e "let s='';process.stdin.on('data',d=>s+=d).on('end',()=>console.log(JSON.parse(s).id))")
echo "seeded $ID (24h-due ~10 min ago; restarting worker for immediate tick)"
pkill -f "[n]ode index.js"; sleep 2
(cd "$ROOT/worker" && PB_URL=http://localhost:8090 nohup node index.js </dev/null >"$ROOT/.codespace-logs/worker.log" 2>&1 &)
sleep 25
for i in $(seq 1 20); do
  if grep -q "DUE 24h.*TEST loop-check" "$ROOT/.codespace-logs/worker.log" 2>/dev/null; then echo "LOOP PROVEN: worker fired 24h reminder from PB row"; break; fi
  sleep 30
done
grep "TEST loop-check" "$ROOT/.codespace-logs/worker.log" | tail -3
curl -s --max-time 10 -X DELETE "http://localhost:8090/api/collections/schedules/records/$ID" -H "Authorization: $TOKEN" > /dev/null
echo "cleaned up $ID"
