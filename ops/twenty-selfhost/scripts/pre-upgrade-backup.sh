#!/usr/bin/env bash
set -euo pipefail

BACKUP_DIR=${BACKUP_DIR:-/var/backups/mhp-twenty/pre-upgrade}
CONTAINER=${TWENTY_POSTGRES_CONTAINER:-twenty-postgres}
POSTGRES_USER=${POSTGRES_USER:-postgres}
STAMP=$(date -u +%Y%m%dT%H%M%SZ)
mkdir -p "$BACKUP_DIR"

OUT="$BACKUP_DIR/twenty_all_${STAMP}.sql"
docker exec "$CONTAINER" pg_dumpall -U "$POSTGRES_USER" > "$OUT"
gzip "$OUT"
printf 'pre_upgrade_backup=%s.gz\n' "$OUT"
