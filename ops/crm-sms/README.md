# CRM + SMS Machinery Pass

This folder defines the operational schema before providers are loaded or Provider Grades are published.

## Current architecture decision

GitHub Pages remains static. The live site must **not** call CRM or SMS APIs directly from browser JavaScript. Production submission should flow through one secure middle layer:

`Static form → secure form/webhook endpoint → CRM lead record → SMS automation → CRM activity/status updates`

The actual CRM/SMS vendor credentials and endpoint are intentionally not stored in this repo.

## Step 1 scope: CRM setup baseline

Create these CRM objects/tables/pipelines before loading providers:

1. **Homeowner / Contact**
   - name
   - mobile phone
   - email
   - SMS consent status
   - SMS consent timestamp/source
   - STOP/HELP opt-out state

2. **Lead / Intake Request**
   - source path
   - source type: home, project, neighborhood, zip, resources
   - project category
   - problem
   - timing / urgency
   - project stage
   - ZIP / neighborhood / location text
   - lead status
   - matched provider id(s)
   - referral status
   - follow-up due date

3. **Provider**
   - provider name
   - company/contact fields
   - category coverage
   - ZIP/neighborhood/service-area coverage
   - license/insurance notes
   - capacity status
   - preferred/graded flags
   - SMS dispatch phone
   - opt-in/relationship notes

4. **Provider Grade Evidence**
   - provider id
   - category
   - evidence source
   - evidence type
   - score fields
   - last verified date
   - public/private flag

5. **SMS Activity**
   - linked contact/lead/provider
   - direction: outbound/inbound
   - message type
   - body/template id
   - delivery status
   - timestamp
   - opt-out event flag

## Lead pipeline statuses

Use the statuses in `pipeline-statuses.csv` as the initial CRM pipeline. The key principle is that Provider Grades can remain unpublished while the CRM quietly starts capturing evidence, matching outcomes, and follow-up quality.

## SMS integration points

Use `sms-templates.md` as the first automation set:

- Homeowner intake confirmation
- Provider dispatch / claim request
- Provider decline/accept acknowledgement
- Homeowner provider accepted update
- Follow-up after estimated contact
- Feedback request
- STOP/HELP compliance handling

## Secure endpoint contract

`webhook-contract.json` defines the payload the static forms are being prepared to send once the CRM/webhook endpoint is chosen.
