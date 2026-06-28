# Inbound SMS Inbox / Triage

MHP needs an inbox/triage layer for inbound SMS and future call events. Twenty remains the system of record, but inbound communications should not be handled as a flat message log.

## Purpose

Every inbound Telnyx message should become or update an actionable triage item:

```text
Telnyx inbound SMS
  -> /telnyx/webhook
  -> normalize + opt-out check
  -> link Person / ServiceRequest / Provider if possible
  -> create/update InboxItem
  -> classify intent + priority
  -> choose: auto reply, assistant reply, owner escalation, or close
  -> write Communication + status changes to Twenty
```

## Why this is needed

- Customers will reply with incomplete details, photos, timing changes, complaints, STOP/HELP, and “did anyone call me?” messages.
- Providers will reply ACCEPT/REJECT, ask questions, or miss SLA windows.
- The assistant needs a work queue, not just raw transcripts.
- Owner escalation should be explicit and auditable.

## Initial triage statuses

| Status | Meaning |
|---|---|
| `new` | New inbound item, not reviewed/classified |
| `classified` | Intent/category identified |
| `needs_assistant_reply` | Assistant should draft/send response if allowed |
| `needs_owner_review` | Owner approval or intervention required |
| `waiting_on_customer` | We asked customer for information |
| `waiting_on_provider` | Provider response/action pending |
| `auto_resolved` | Template/system action handled it |
| `closed` | No further action needed |
| `suppressed` | STOP/do-not-contact or invalid item |

## Intent categories

- `stop_opt_out`
- `help_request`
- `new_intake_detail`
- `missing_info_response`
- `status_question`
- `timing_change`
- `provider_accept`
- `provider_reject`
- `provider_question`
- `complaint`
- `safety_or_emergency`
- `billing_or_money`
- `insurance_or_legal`
- `unknown`

## Priority levels

| Priority | Examples |
|---|---|
| `p0_suppress_now` | STOP, opt-out, wrong number requesting no contact |
| `p1_owner_now` | complaint, safety/emergency, legal/insurance, reputation risk |
| `p2_assistant_now` | active customer waiting, provider needs routing answer |
| `p3_normal` | routine details/follow-up |
| `p4_low` | FYI/no action |

## Assistant handling rules

The assistant may autonomously handle:

- HELP response;
- routine missing-info clarification;
- status check responses using known CRM facts;
- provider ACCEPT/REJECT classification and next-step updates;
- polite follow-ups within approved templates.

Escalate to owner before sending when the item involves:

- safety/emergency guidance beyond basic routing;
- legal/insurance/code advice;
- provider complaint or dispute;
- pricing/refund/billing commitment;
- negative review/reputation issue;
- promise of provider quality, timing, warranty, or outcome.

## Minimum InboxItem fields

See `data/crm/inbox-fields.csv`.
