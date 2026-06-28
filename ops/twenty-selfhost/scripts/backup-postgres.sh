#!/usr/bin/env bash
set -euo pipefail

BACKUP_DIR=${BACKUP_DIR:-/var/backups/mhp-twenty}
CONTAINER=${TWENTY_POSTGRES_CONTAINER:-twenty-postgres}
POSTGRES_USER=${POSTGRES_USER:-postgres}
DATABASE=${POSTGRES_DB:-twenty}
STAMP=$(date -u +%Y%m%dT%H%M%SZ)
mkdir -p "$BACKUP_DIR"

OUT="$BACKUP_DIR/twenty_${STAMP}.sql"
docker exec "$CONTAINER" pg_dump -U "$POSTGRES_USER" "$DATABASE" > "$OUT"
gzip "$OUT"
find "$BACKUP_DIR" -name 'twenty_*.sql.gz' -type f -mtime +30 -delete
printf 'backup=%s.gz\n' "$OUT"
