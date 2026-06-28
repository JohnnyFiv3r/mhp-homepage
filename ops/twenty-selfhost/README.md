# Self-Hosted Twenty for Murfreesboro Home Pros

Self-hosted Twenty is the default CRM deployment path for MHP.

## Architecture

```text
GitHub Pages form
  -> MHP Twenty Adapter HTTPS endpoint
  -> Self-hosted Twenty API/webhooks
  -> Twenty Postgres/Redis/storage volumes
  -> Telnyx adapter later for SMS/voice
```

## Target defaults

- Public CRM URL: `https://crm.murfreesborohomepros.com`
- Twenty mode: single-workspace
- Deployment: Docker Compose using official Twenty Docker assets
- Reverse proxy: Caddy preferred for automatic TLS; Nginx acceptable
- Backups: daily Postgres dumps before we treat CRM as production
- Native Twenty MCP: sandbox/readiness only; production writes still go through `ops/twenty-adapter`

## Why self-host

- Own the CRM data layer.
- Keep adapter/Twenty/Telnyx integration under our control.
- Avoid building core operating machinery on a SaaS tenant we may migrate away from.
- Fits the “general manager / owner” operating model: durable backend first, providers later.

## Important safety rule

Do not run production Twenty without:

1. a backed-up `ENCRYPTION_KEY`;
2. persistent Docker volumes;
3. HTTPS;
4. automated database backups;
5. a documented upgrade/rollback procedure.

Losing `ENCRYPTION_KEY` means losing access to secrets stored in the Twenty database.
