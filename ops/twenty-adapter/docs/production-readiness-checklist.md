# Twenty Production Readiness Checklist

Use this before connecting live forms or Telnyx production traffic.

## Twenty workspace

- [ ] Choose Cloud Pro unless self-hosting is already operationally routine.
- [ ] Create production workspace and a separate sandbox workspace if available.
- [ ] Configure least-privilege roles for founder, operator, adapter/API key, and read-only reporting.
- [ ] Create a scoped API key under Settings → API & Webhooks.
- [ ] Store API key in the deployment secret store only; never in GitHub Pages or repo files.
- [ ] Create required packet objects from `data/crm/twenty-objects.csv`.
- [ ] Create required fields from `data/crm/lead-fields.csv` and `data/crm/provider-fields.csv`.
- [ ] Create enumerations from `data/crm/pipeline-statuses.csv`.
- [ ] Confirm generated REST/GraphQL names in Twenty workspace API docs.
- [ ] Update `src/twenty-client.mjs` mutations/endpoints to match generated workspace schema.

## Adapter

- [ ] Deploy `ops/twenty-adapter` behind HTTPS.
- [ ] Set `MHP_DRY_RUN=false` only after all tests pass.
- [ ] Configure `TWENTY_BASE_URL`, `TWENTY_API_KEY`, `TWENTY_WEBHOOK_SECRET`, and `MHP_FORM_SHARED_SECRET`.
- [ ] Require form endpoint HMAC signatures or equivalent server-side CSRF/bot protection.
- [ ] Persist ledger/dead-letter queues to durable storage, not ephemeral disk.
- [ ] Run `npm test` and `npm run check`.
- [ ] POST `fixtures/intake.sample.json` to `/intake` in dry-run and production-sandbox modes.
- [ ] Verify idempotency: repeat same request and confirm no duplicate ServiceRequest.
- [ ] Verify missing required fields return 422 and do not create records.

## Twenty webhooks

- [ ] Create Twenty webhook URL: `https://<adapter-host>/twenty/webhook`.
- [ ] Store webhook secret as `TWENTY_WEBHOOK_SECRET`.
- [ ] Verify `X-Twenty-Webhook-Signature` and `X-Twenty-Webhook-Timestamp` validation.
- [ ] Ledger all webhook events.
- [ ] Dead-letter invalid/failed events with enough detail for replay.
- [ ] Confirm replay protection policy.

## Native Twenty MCP

- [ ] Treat native Twenty MCP as sandbox-only while alpha.
- [ ] Do not grant production write access through native MCP until it passes the same object/action authorization and regression tests as the adapter.
- [ ] If enabled later, prefer OAuth and least-privilege roles.

## Go-live gate

- [ ] Legal/entity basics complete.
- [ ] Privacy/SMS terms reviewed.
- [ ] Telnyx 10DLC approved before production outbound SMS.
- [ ] End-to-end test request creates Person, Property, ConsentEvent, ServiceRequest, Communication records.
- [ ] Founder can view and update statuses from mobile.
- [ ] Unauthorized SMS/data-sharing workflow tested as SEV1 pause condition.
