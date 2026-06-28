# Telnyx Connector Interface

This is the application boundary for assistant-callable SMS/voice actions. The assistant should call intent-level connector functions, not raw Telnyx APIs.

## Endpoint shape, future

All endpoints should require service auth, idempotency, actor, and audit metadata.

### POST `/sms/customer/send`

Send or queue a customer SMS tied to a Twenty Person and ServiceRequest.

```json
{
  "idempotency_key": "uuid-or-stable-key",
  "actor": "assistant|owner|system",
  "service_request_id": "...",
  "person_id": "...",
  "template_id": "homeowner_need_more_info_v1",
  "body": "Quick question...",
  "requires_owner_approval": false,
  "reason": "missing location detail"
}
```

### POST `/sms/provider/send`

Send or queue a provider SMS tied to a Company/RoutingAttempt.

### POST `/telnyx/webhook`

Receive inbound SMS, delivery receipts, opt-outs, and future voice events from Telnyx.

### POST `/sms/thread/summarize`

Summarize a thread for the owner or CRM note without sending a customer-visible message.

## Required checks before sending

1. Consent status permits transactional SMS.
2. Person is not `do_not_contact`.
3. Message is linked to a known ServiceRequest or provider workflow.
4. Body avoids guarantees, contractor claims, and prohibited advice.
5. Owner approval is present when category requires approval.
6. Idempotency key has not already been used.
7. Communication record is created or queued in Twenty.

## Inbound handling

Inbound SMS should be classified into:

- STOP/opt-out
- HELP
- intake detail
- status question
- complaint/escalation
- provider response ACCEPT/REJECT
- unknown

STOP and reasonable opt-out language must update Twenty immediately before any assistant response is considered.

## Assistant behavior

The assistant can chat with customers directly through this connector once production approval gates are enabled. It should prefer concise, useful messages and should escalate rather than improvise when a message affects safety, money, legal/insurance, warranties, provider disputes, or MHP reputation.

## Inbox integration

Inbound Telnyx messages should create/update a Twenty `Communication` record and an actionable `InboxItem`. The assistant works from InboxItems, not raw transcripts. See `../../crm-sms/inbound-triage.md` and `../../../data/crm/inbox-fields.csv`.
