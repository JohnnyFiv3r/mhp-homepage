# Founder Twenty Handoff

While Telnyx/10DLC is being handled, the Twenty side needs these founder/admin actions.

## Recommended hosting choice

Use **Twenty Cloud Pro** for launch unless self-hosting is already operationally routine. The business plan also recommends Cloud for speed.

## Create in Twenty

1. Production workspace.
2. Optional sandbox workspace for native MCP experiments.
3. API key for the MHP adapter, scoped to the minimum role needed for:
   - Person
   - Company
   - Property
   - ConsentEvent
   - ServiceRequest
   - RoutingAttempt
   - Appointment
   - Communication
   - JobOutcome
   - PartnerTerritory
   - ComplianceDocument
   - Incident
4. Webhook pointing to the deployed adapter later:
   - `https://<adapter-host>/twenty/webhook`
5. Webhook secret copied into deployment secret store as `TWENTY_WEBHOOK_SECRET`.

## Values the adapter will need

Do not paste these into chat unless you explicitly want me to use them in a secure configuration step.

- `TWENTY_BASE_URL`
- `TWENTY_API_KEY`
- `TWENTY_WEBHOOK_SECRET`
- adapter deployment URL

## Native Twenty MCP stance

Native Twenty MCP can be enabled in sandbox for exploration, but production write access should remain through the scoped adapter until native MCP passes the same regression, authorization, replay, and audit controls.

## Done means

The Twenty side is production-ready when:

- custom objects/fields/enums exist;
- the adapter can create a dry-run then sandbox `ServiceRequest` bundle;
- a Twenty webhook event reaches the adapter and verifies signature;
- repeat requests do not create duplicates;
- STOP/opt-out events update `Person.do_not_contact` and consent state;
- the founder can inspect request status from mobile.
