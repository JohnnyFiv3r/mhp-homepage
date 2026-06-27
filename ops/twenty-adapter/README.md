# MHP Twenty Adapter

Scoped production adapter for Murfreesboro Home Pros. It exists because the business plan requires Twenty as system of record while treating native Twenty MCP as alpha/sandbox-only.

## What it provides now

- Intake payload normalization into packet-aligned Twenty concepts.
- Required-field validation.
- HMAC verification helpers for form and Twenty webhook requests.
- JSONL event ledger/dead-letter scaffold.
- Dry-run HTTP endpoints:
  - `GET /health`
  - `POST /intake`
  - `POST /twenty/webhook`
- Node tests for normalization and signature verification.
- Production readiness and schema install docs.

## Local dry-run

```bash
cd ops/twenty-adapter
npm test
npm run check
npm run dev
curl -s http://127.0.0.1:8787/health
curl -s -X POST http://127.0.0.1:8787/intake \
  -H 'content-type: application/json' \
  --data @fixtures/intake.sample.json
```

## Production rule

Do not set `MHP_DRY_RUN=false` until Twenty objects/fields exist, generated API names are confirmed, secrets are installed in the deployment secret store, webhook signature verification is tested, and durable ledger storage is configured.
