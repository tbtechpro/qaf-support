#!/usr/bin/env bash
# Nightly PocketBase snapshot. Run on VM via cron: 0 2 * * * /srv/qaf/scripts/backup.sh
set -euo pipefail
APP_DIR="${APP_DIR:-/srv/qaf}"
KEEP="${KEEP:-7}"
STAMP="$(date +%F)"
SNAP="$APP_DIR/backups/pb_data-$STAMP.tar.gz"
mkdir -p "$APP_DIR/backups"
tar -czf "$SNAP" -C "$APP_DIR" pocketbase/pb_data
ls -t "$APP_DIR"/backups/pb_data-*.tar.gz | tail -n +$((KEEP + 1)) | xargs -r rm --
echo "backup ok: $SNAP ($(du -h "$SNAP" | cut -f1))"
# Optional offsite: set R2_* and uncomment:
# rclone copy "$SNAP" "r2:qaf-backups/" 2>/dev/null || echo "offsite skipped (rclone/R2 not configured)"
