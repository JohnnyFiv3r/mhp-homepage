# Decision Log: Twenty Hosting

## Decision

Murfreesboro Home Pros will self-host Twenty by default.

## Rationale

The owner explicitly prefers self-hosting, and the business plan emphasizes durable machinery, no orphaned service loops, and Twenty as the system of record. Self-hosting gives us control of the CRM data layer and makes the MHP operating system less dependent on a SaaS tenant during validation.

## Guardrails

Self-hosting is only acceptable if we treat the CRM like production infrastructure:

- persistent storage;
- HTTPS;
- backed-up `ENCRYPTION_KEY`;
- daily Postgres backups;
- pre-upgrade dumps;
- least-privilege API credentials;
- adapter-mediated production writes;
- native Twenty MCP stays sandbox-only until it passes controls.

## Cloud fallback

Twenty Cloud remains a fallback only if self-hosting slows validation materially or host reliability becomes a distraction.
