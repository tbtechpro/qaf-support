#!/usr/bin/env bash
# Codespaces pilot runner — no Docker needed.
# Starts: PocketBase :8090 (binary, with migrations) + Next.js web :3000 + reminder worker.
# Idempotent: safe to re-run on every codespace start. Logs in .codespace-logs/.
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
LOG="$ROOT/.codespace-logs"; mkdir -p "$LOG"
PB_VER="${PB_VER:-0.40.4}"
NODE_VER="${NODE_VER:-20.19.0}"
PB_BIN="$ROOT/pocketbase/bin/pocketbase"
NODE_DIR="$ROOT/.codespace-tools/node-v${NODE_VER}-linux-x64"

if ldd --version 2>&1 | grep -qi musl; then
  if ! command -v node >/dev/null; then
    echo "[start] installing node via apk (musl) ..."
    sudo /sbin/apk add --no-cache nodejs npm
  fi
else
  if [ ! -x "$NODE_DIR/bin/node" ]; then
    echo "[start] downloading node $NODE_VER ..."
    mkdir -p "$ROOT/.codespace-tools"
    curl -sSL -o /tmp/node.tar.xz "https://nodejs.org/dist/v${NODE_VER}/node-v${NODE_VER}-linux-x64.tar.xz"
    tar -xJf /tmp/node.tar.xz -C "$ROOT/.codespace-tools"
  fi
  export PATH="$NODE_DIR/bin:$PATH"
fi
node --version; npm --version

if [ ! -x "$PB_BIN" ]; then
  echo "[start] downloading pocketbase $PB_VER ..."
  mkdir -p "$ROOT/pocketbase/bin"
  curl -sSL -o /tmp/pb.zip "https://github.com/pocketbase/pocketbase/releases/download/v${PB_VER}/pocketbase_${PB_VER}_linux_amd64.zip"
  unzip -o -q /tmp/pb.zip -d "$ROOT/pocketbase/bin"
  chmod +x "$PB_BIN"
fi

if ! pgrep -f "pocketbase.*serve" >/dev/null; then
  echo "[start] pocketbase :8090 ..."
  (cd "$ROOT" && nohup "$PB_BIN" serve --http=0.0.0.0:8090 --dir="$ROOT/pocketbase/pb_data" --migrationsDir="$ROOT/pocketbase/pb_migrations" </dev/null >"$LOG/pocketbase.log" 2>&1 &)
fi

if [ ! -d "$ROOT/web/node_modules" ]; then
  echo "[start] web npm ci ..."
  (cd "$ROOT/web" && npm ci --no-audit --no-fund)
fi
if [ ! -d "$ROOT/web/.next" ]; then
  echo "[start] web build ..."
  (cd "$ROOT/web" && npm run build)
fi
if ! pgrep -f "next-server" >/dev/null && ! curl -s -o /dev/null -m 3 http://localhost:3000/; then
  echo "[start] web :3000 ..."
  (cd "$ROOT/web" && nohup npm run start -- -p 3000 </dev/null >"$LOG/web.log" 2>&1 &)
fi

if ! pgrep -f "worker/index.js" >/dev/null; then
  echo "[start] worker (PB_URL=localhost:8090) ..."
  (cd "$ROOT/worker" && PB_URL=http://localhost:8090 nohup node index.js </dev/null >"$LOG/worker.log" 2>&1 &)
fi

sleep 5
echo "--- status ---"
curl -s -o /dev/null -w "web :3000 -> %{http_code}\n" --max-time 10 http://localhost:3000/ || true
curl -s -o /dev/null -w "pb  :8090 -> %{http_code}\n" --max-time 10 http://localhost:8090/api/health || true
pgrep -af "pocketbase.*serve|next-server|worker/index.js" || true
