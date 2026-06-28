# Twenty + Telnyx CRM/SMS Machinery

This folder implements the operating-system baseline from the Murfreesboro Home Pros business plan packet.

## Decided stack

- **CRM/system of record:** Twenty
- **Communications:** Telnyx for SMS-first intake, local phone forwarding/hold, and controlled call fallback
- **OpenClaw role:** orchestration layer through a scoped internal adapter
- **Frontend:** GitHub Pages/static site only; no CRM/SMS secrets or direct provider API calls in browser JavaScript

Production flow:

`Static form → secure signed webhook endpoint → internal MHP adapter → Twenty records → Telnyx transactional SMS/call workflow → Twenty Communication/Consent/Status updates`

## Integration rules

1. Twenty native MCP is treated as alpha/sandbox only.
2. Production writes should go through a scoped internal adapter over Twenty REST/GraphQL APIs and webhooks.
3. Telnyx is accessed through a replaceable communications adapter exposing intent-level operations such as:
   - `send_transactional_sms`
   - `notify_partner`
   - `introduce_accepted_partner`
   - `record_opt_out`
   - `forward_call`
4. Every write requires: idempotency key, actor, source event id, UTC timestamp, and audit logging.
5. Webhooks require signature verification, event ledgering, replay protection, and dead-letter handling.
6. Production business SMS requires A2P 10DLC registration/approval before sending.

## Twenty objects

See `../../data/crm/twenty-objects.csv` for the packet-aligned object model:

- Person
- Company
- PartnerDeal
- ServiceRequest
- Property
- ConsentEvent
- RoutingAttempt
- Appointment
- Communication
- JobOutcome
- PartnerTerritory
- ComplianceDocument
- InvoiceCredit
- ContentAsset
- SEOExperiment
- Incident

## Current repo state

The static site forms are prepared with:

- `data-crm-form="lead-intake"`
- source path/type/category hidden fields
- normalized names for timing/problem/project stage/location
- homeowner name/mobile/email
- `sms_consent` checkbox using `sms_consent_web_v1`

The form buttons are still non-submitting prototype buttons until the secure endpoint exists. This is intentional; it avoids collecting private homeowner data into nowhere and avoids exposing credentials client-side.

## Next implementation step

Build the secure endpoint/adapter skeleton:

1. Accept static form payload.
2. Validate required fields and bot score.
3. Normalize timing into `Urgency` enum.
4. Create/update Twenty `Person`, `Property`, `ConsentEvent`, and `ServiceRequest` using an idempotency key.
5. If consent is granted and 10DLC is approved, send `homeowner_request_received_v1` through Telnyx.
6. Ledger all events and failures.

## Telnyx callable communications app

Telnyx is the assistant-callable SMS/voice application layer, not just a template notification pipe. See `telnyx-callable-app.md` and `../twenty-adapter/docs/telnyx-connector-interface.md`.
