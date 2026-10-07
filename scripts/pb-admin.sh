#!/usr/bin/env bash
# Authenticated PocketBase calls for pilot ops.
# Usage: bash scripts/pb-admin.sh <superuser-password> <METHOD> <api-path> [json-body]
set -euo pipefail
PW="${1:?password}"; METHOD="${2:?method}"; P="${3:?path}"; BODY="${4:-}"
TOKEN=$(curl -s --max-time 10 http://localhost:8090/api/collections/_superusers/auth-with-password -H 'Content-Type: application/json' -d "{\"identity\":\"pilot-admin@qaf-support.local\",\"password\":\"$PW\"}" | node -e "let s='';process.stdin.on('data',d=>s+=d).on('end',()=>console.log(JSON.parse(s).token))")
if [ -n "$BODY" ]; then
  curl -s --max-time 15 -X "$METHOD" "http://localhost:8090$P" -H 'Content-Type: application/json' -H "Authorization: $TOKEN" -d "$BODY"
else
  curl -s --max-time 15 -X "$METHOD" "http://localhost:8090$P" -H "Authorization: $TOKEN"
fi
echo
