# Twenty Self-Host Install Runbook

Use this when we have a target VPS/server.

## 0. Host assumptions

- Ubuntu LTS or comparable Linux host.
- At least 2GB RAM; 4GB+ preferred once adapter, reverse proxy, and backups run nearby.
- Docker and Docker Compose installed and current.
- DNS A/AAAA record pointed at host: `crm.murfreesborohomepros.com`
- Firewall exposes only required ports: 22 SSH, 80/443 public, 3000 local only if using reverse proxy.

## 1. Server directory

```bash
sudo mkdir -p /opt/mhp/twenty
sudo chown "$USER":"$USER" /opt/mhp/twenty
cd /opt/mhp/twenty
```

## 2. Fetch official Twenty Docker assets

```bash
bash /path/to/mhp-homepage/ops/twenty-selfhost/scripts/bootstrap-fetch-official.sh
```

This downloads the official `.env.example` and `docker-compose.yml`.

## 3. Create secrets

```bash
openssl rand -base64 32  # ENCRYPTION_KEY
openssl rand -base64 24  # PG_DATABASE_PASSWORD candidate
```

Store `ENCRYPTION_KEY` in a password manager. Losing it can make stored secrets unrecoverable.

## 4. Configure `.env`

Merge the official `.env.example` with our `ops/twenty-selfhost/.env.template` expectations:

```ini
SERVER_URL=https://crm.murfreesborohomepros.com
IS_MULTIWORKSPACE_ENABLED=false
IS_CONFIG_VARIABLES_IN_DB_ENABLED=true
ENCRYPTION_KEY=<generated-secret>
PG_DATABASE_PASSWORD=<generated-password>
```

Pin `TAG` to a known Twenty version before production. `latest` is acceptable only for initial throwaway smoke testing.

## 5. Reverse proxy / HTTPS

Preferred: Caddy with `ops/twenty-selfhost/templates/Caddyfile`.

Twenty should listen internally on `localhost:3000`; public users should use HTTPS on `crm.murfreesborohomepros.com`.

## 6. Start Twenty

```bash
docker compose up -d
docker compose ps
curl -fsS http://127.0.0.1:3000 >/dev/null && echo ok
```

Then visit `https://crm.murfreesborohomepros.com` and create the first admin user.

## 7. Configure admin panel

In Twenty:

- Settings → Admin Panel → Configuration Variables
- Confirm app URL / server URL behavior.
- Configure email only when needed.
- Leave mailbox/calendar integrations for later unless they unblock operations.

## 8. Create MHP schema

Follow existing repo docs:

- `ops/twenty-adapter/docs/schema-install-guide.md`
- `data/crm/twenty-objects.csv`
- `data/crm/lead-fields.csv`
- `data/crm/provider-fields.csv`
- `data/crm/pipeline-statuses.csv`

## 9. API key and webhook

Create a least-privilege adapter API key in Twenty.

Later, after deploying `ops/twenty-adapter`, create webhook:

```text
https://<adapter-host>/twenty/webhook
```

## 10. Backups

Run a manual backup before declaring production:

```bash
BACKUP_DIR=/var/backups/mhp-twenty bash /path/to/mhp-homepage/ops/twenty-selfhost/scripts/backup-postgres.sh
```

Then install a daily cron/systemd timer. Do not rely on Docker volumes alone as “backup.”

## 11. Upgrade rule

Before every Twenty upgrade:

1. Run `pre-upgrade-backup.sh`.
2. Stop Twenty: `docker compose down`.
3. Change `TAG` in `.env`.
4. Start: `docker compose up -d`.
5. Check logs and Twenty upgrade status.

Never upgrade blind without a fresh dump.
