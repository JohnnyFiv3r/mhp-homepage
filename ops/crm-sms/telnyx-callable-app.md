# Telnyx Callable Communications Application

Telnyx is not just a notification provider for Murfreesboro Home Pros. It is the callable communications layer for customer/provider conversations.

## Operating model

OpenClaw/assistant should be able to participate in SMS conversations through a controlled application layer:

```text
Customer SMS / Telnyx webhook
  -> MHP adapter / Telnyx connector
  -> consent + identity + lead lookup in Twenty
  -> assistant/operator decision
  -> approved SMS reply via Telnyx
  -> Communication record + audit log in Twenty
```

The goal is to reduce owner/operator texting burden while preserving consent, auditability, and trust.

## Roles

| Role | Responsibility |
|---|---|
| Owner/operator | Final business authority, provider relationships, escalations, policy changes |
| Assistant/OpenClaw | Routine customer/provider chat, intake clarification, routing support, follow-up, status summaries |
| Telnyx connector | Send/receive SMS, normalize webhooks, enforce opt-out handling, delivery status updates |
| Twenty | System of record for people, consent, service requests, communications, routing attempts, outcomes |

## Message categories

### Safe for autonomous/template handling after consent

- request received confirmation
- missing information question from approved prompt set
- appointment/status follow-up
- provider accepted/declined update
- feedback request
- HELP response
- STOP/START opt-out handling

### Assistant-drafted, may be sent if policy allows

- clarifying project/problem details
- explaining how MHP works
- collecting location/timing/stage
- non-legal, non-technical next-step guidance
- routing-status updates
- polite provider follow-up nudges

### Require owner approval before sending

- anything that could be legal, insurance, medical, financial, or safety-critical advice
- promises about response time, price, provider quality, outcome, warranties, or code compliance
- dispute handling
- complaints about provider conduct
- refunds/credits/billing commitments
- public-review/reputation-sensitive responses
- terminating or suspending a provider relationship

## Hard boundaries

- Do not represent MHP as the contractor performing work.
- Do not guarantee provider availability, pricing, quality, workmanship, permits, warranties, or outcomes.
- Do not send messages without consent or a valid transactional basis.
- STOP and reasonable opt-out language must immediately suppress further non-required texts.
- Emergency/safety issues should be routed to emergency guidance and not handled as normal referral chat.
- Every outbound message must be linked to a Person, ServiceRequest or Provider, and Communication record where possible.

## Connector actions

The adapter should eventually expose intent-level callable actions rather than raw Telnyx API calls:

- `send_customer_sms`
- `send_provider_sms`
- `reply_to_thread`
- `request_missing_info`
- `send_provider_dispatch`
- `record_inbound_sms`
- `record_delivery_status`
- `record_opt_out`
- `summarize_thread_for_owner`
- `escalate_to_owner`

Raw Telnyx credentials should never be exposed to static frontend code or general-purpose chat context.

## Initial automation stance

Until 10DLC and final compliance review are complete:

- connector runs in dry-run or sandbox mode;
- assistant can draft replies and classify/escalate;
- production outbound SMS remains disabled;
- templates and consent language remain versioned.

After approval, start with conservative transactional use and expand autonomous replies only after reviewing transcripts.
