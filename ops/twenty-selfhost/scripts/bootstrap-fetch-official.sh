#!/usr/bin/env bash
set -euo pipefail

# Fetches official Twenty Docker assets into the current server directory.
# Run on the target server, not from GitHub Pages.

curl -fsSL -o .env.official.example https://raw.githubusercontent.com/twentyhq/twenty/refs/heads/main/packages/twenty-docker/.env.example
curl -fsSL -o docker-compose.yml https://raw.githubusercontent.com/twentyhq/twenty/refs/heads/main/packages/twenty-docker/docker-compose.yml

if [ ! -f .env ]; then
  cp .env.official.example .env
  echo "Created .env from official example. Merge values from ops/twenty-selfhost/.env.template before launch."
else
  echo ".env already exists; not overwriting. Compare with .env.official.example manually."
fi
