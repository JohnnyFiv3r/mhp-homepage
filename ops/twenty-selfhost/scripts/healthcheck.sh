#!/usr/bin/env bash
set -euo pipefail
URL=${TWENTY_HEALTH_URL:-http://127.0.0.1:3000}
curl -fsS "$URL" >/dev/null
printf 'ok %s\n' "$URL"
