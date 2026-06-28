# Twenty Schema Install Guide

Twenty APIs are generated from workspace schema, so install order matters.

## Object install order

1. Built-ins: Person, Company
2. Core request objects: Property, ConsentEvent, ServiceRequest
3. Routing/communications: RoutingAttempt, Appointment, Communication, JobOutcome
4. Communications/triage: InboxItem
5. Partner/compliance/commercial: PartnerDeal, PartnerTerritory, ComplianceDocument, InvoiceCredit
6. Content/ops: ContentAsset, SEOExperiment, Incident

## Minimum relations

- Person → ServiceRequest: requester/homeowner
- Property → ServiceRequest: service location
- ConsentEvent → Person and ServiceRequest: consent proof
- Company → RoutingAttempt: routed partner
- ServiceRequest → RoutingAttempt: routing history
- ServiceRequest → Communication: communication log
- ServiceRequest → JobOutcome: outcome evidence
- Company → PartnerTerritory: territory/capacity
- Company → ComplianceDocument: license/insurance evidence

## Required first test

Create a ServiceRequest from `fixtures/intake.sample.json` through the adapter. Confirm Twenty shows:

- a Person with phone/email and consent status;
- a Property with ZIP/location text;
- a ConsentEvent with `sms_consent_web_v1` language version;
- a ServiceRequest with status `new` and urgency `urgent_24h`;
- an adapter ledger event with the same idempotency key.

## Inbox / triage relations

- InboxItem → Person: sender/contact
- InboxItem → ServiceRequest: linked customer request
- InboxItem → Company: linked provider when provider-side
- InboxItem → RoutingAttempt: linked provider dispatch when relevant
- InboxItem → Communication: raw message/call record

Create InboxItem after Communication so raw message history and actionable triage can stay separate.
