#!/usr/bin/env bash
# Seeds pilot content (cohort, 2 schedules, 2 docs). Idempotent: skips titles/codes that exist.
# Usage: bash scripts/seed-pilot.sh <superuser-password>
set -euo pipefail
PW="${1:?password}"
BASE=http://localhost:8090
TOKEN=$(curl -s --max-time 10 "$BASE/api/collections/_superusers/auth-with-password" -H 'Content-Type: application/json' -d "{\"identity\":\"pilot-admin@qaf-support.local\",\"password\":\"$PW\"}" | node -e "let s='';process.stdin.on('data',d=>s+=d).on('end',()=>console.log(JSON.parse(s).token))")
exists() { curl -s --max-time 10 "$BASE/api/collections/$1/records?perPage=1&filter=$2" | node -e "let s='';process.stdin.on('data',d=>s+=d).on('end',()=>process.exit(JSON.parse(s).totalItems>0?0:1))"; }
post() { curl -s --max-time 10 -X POST "$BASE/api/collections/$1/records" -H 'Content-Type: application/json' -H "Authorization: $TOKEN" -d "$2" | head -c 200; echo; }

if exists cohorts 'code="pilot-2026-01"'; then echo "cohort exists"; else
  post cohorts '{"code":"pilot-2026-01","name":"Pilot Cohort","timezone":"Africa/Lagos"}'
fi
if exists schedules 'title="Orientation Live"'; then echo "orientation exists"; else
  post schedules '{"kind":"live_session","title":"Orientation Live","starts_at":"2026-10-13T17:00:00.000Z","timezone":"Africa/Lagos","join_link":"https://meet.example.org/qaf-orientation","source":"Schedule v1 6-Oct-2026","action":"Join via same cohort link"}'
fi
if exists schedules 'title="Assessment 1 due"'; then echo "assessment exists"; else
  post schedules '{"kind":"deadline","title":"Assessment 1 due","starts_at":"2026-10-18T22:59:00.000Z","timezone":"Africa/Lagos","join_link":"","source":"Schedule v1 6-Oct-2026","action":"Submit on learn.qubators.org"}'
fi
if exists content_docs 'title="How do I submit Assessment 1?"'; then echo "faq1 exists"; else
  post content_docs '{"title":"How do I submit Assessment 1?","body":"Open learn.qubators.org, Assessments, Assessment 1, Upload, Confirm.","source":"Learner Guide v1","owner":"content-owner","review_date":"2026-10-01T00:00:00.000Z","cohort":"pilot-2026-01"}'
fi
if exists content_docs 'title="Where is the live session link?"'; then echo "faq2 exists"; else
  post content_docs '{"title":"Where is the live session link?","body":"Same verified cohort link for all learners, shown personally in reminders. If missing: Awaiting organizer confirmation.","source":"Schedule v1 6-Oct-2026","owner":"content-owner","review_date":"2026-10-01T00:00:00.000Z","cohort":"pilot-2026-01"}'
fi
echo SEED_DONE
