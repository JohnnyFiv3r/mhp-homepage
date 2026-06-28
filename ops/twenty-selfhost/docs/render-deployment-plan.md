# Render Deployment Plan for Self-Hosted Twenty

Render is an acceptable MVP host because the owner already has a paid account. Treat this as **managed self-hosting**, not Twenty Cloud.

## Recommendation

Do **not** try to run the entire official Twenty Docker Compose stack inside one Render web service. Render services are designed as separate web/private/background services with managed Postgres/Key Value and optional persistent disks.

Preferred Render layout:

| Component | Render resource | Domain / visibility |
|---|---|---|
| Twenty dashboard/server | Web Service, Docker/prebuilt image if possible | `crm.murfreesborohomepros.com` |
| Twenty worker | Background Worker or Private Service | private |
| Postgres | Render Postgres | private |
| Redis/queue | Render Key Value | private |
| MHP adapter | Web Service, Node | `api.murfreesborohomepros.com` |
| Upload/storage if needed | Render disk or external S3-compatible storage | private |

## Why this split

- Render web services need one HTTP process binding to `0.0.0.0:$PORT`.
- Render filesystems are ephemeral unless a paid persistent disk is attached.
- Render provides managed Postgres and Key Value; use those instead of running database containers in the app service.
- The adapter should remain a separate public surface from the CRM dashboard.

## Domains

- `crm.murfreesborohomepros.com` → Twenty dashboard/API
- `api.murfreesborohomepros.com` → MHP adapter endpoints:
  - `/health`
  - `/intake`
  - `/twenty/webhook`
  - later Telnyx webhook endpoints

## Render setup sequence

1. Create Render Postgres for Twenty.
2. Create Render Key Value/Redis for Twenty.
3. Create Twenty web service using Docker/prebuilt image or a repo wrapper.
4. Create Twenty worker/background service if required by the Twenty deployment mode.
5. Set Twenty environment variables:
   - `SERVER_URL=https://crm.murfreesborohomepros.com`
   - `IS_MULTIWORKSPACE_ENABLED=false`
   - `IS_CONFIG_VARIABLES_IN_DB_ENABLED=true`
   - `ENCRYPTION_KEY=<secret>`
   - database URL from Render Postgres
   - Redis URL from Render Key Value
6. Attach custom domain `crm.murfreesborohomepros.com`.
7. Create first admin user.
8. Create MHP schema from `data/crm/` and adapter docs.
9. Create scoped Twenty API key.
10. Deploy `ops/twenty-adapter` as Render Node web service.
11. Set adapter env vars:
    - `TWENTY_BASE_URL=https://crm.murfreesborohomepros.com`
    - `TWENTY_API_KEY=<secret>`
    - `TWENTY_WEBHOOK_SECRET=<secret>`
    - `MHP_FORM_SHARED_SECRET=<secret>`
    - `MHP_DRY_RUN=false` only after sandbox tests pass
12. Attach custom domain `api.murfreesborohomepros.com`.
13. Add Twenty webhook to `https://api.murfreesborohomepros.com/twenty/webhook`.
14. Run dry-run then live sandbox intake test.

## Backup posture

Render Postgres should have managed backups enabled. Still export periodic logical dumps for portability before we treat Twenty as permanent production source of truth.

## Open implementation question

Confirm the exact Twenty deployment image/env names for Render. Twenty's official self-host docs are Docker Compose-first, so a Render deployment may need either:

- a thin wrapper repo/Dockerfile around the official Twenty image; or
- a Render Blueprint with separate web/worker/database/key-value resources.

Do not switch `MHP_DRY_RUN=false` until those names are verified against the running instance.
