# Telnyx SMS Templates

Initial provider: **Telnyx**. Messages should be sent through a replaceable communications adapter, not by calling Telnyx directly from static frontend code.

Only versioned, approved transactional templates may be sent autonomously. Store `template_id`, version, exact body, request id, direction, delivery status, and Telnyx message id on the linked Twenty `Communication` record. STOP/START/HELP and reasonable-language opt-outs must update Twenty `ConsentEvent` / `Person.do_not_contact`.

## sms_consent_web_v1

By checking this box and submitting, you agree to receive transactional text messages from Murfreesboro Home Pros about this service request, including automated messages. You also authorize us to share the details of this request with one selected local service partner at a time for the purpose of coordinating your request. Message frequency varies. Message and data rates may apply. Reply STOP to opt out or HELP for help. Consent is not a condition of purchase. See SMS Terms and Privacy Notice. Separate consent is required for promotional messages.

Counsel and 10DLC registration must approve final wording before production SMS.

## homeowner_request_received_v1

Murfreesboro Home Pros: We received your {{service}} request. We do not sell your request to a vendor list; we are reviewing one appropriate partner at a time. This is not a guarantee of a specific response time. Reply STOP to opt out or HELP for help.

## partner_notification_v1

NEW MHP {{service}} REQUEST {{lead_id}} — {{service_type}}, {{zip_or_neighborhood}}, {{urgency}}, owner/authorized: {{authority_status}}, requested timing: {{window}}. Reply ACCEPT {{lead_id}} within {{acceptance_minutes}} minutes or REJECT {{lead_id}} {{reason}}. Full details follow only after acceptance and within consent scope.

## homeowner_partner_intro_v1

Murfreesboro Home Pros: {{partner_legal_or_brand_name}} accepted your request and plans to contact you at {{time_window}}. They are an independent contractor responsible for inspection, estimate, contract, work, warranty, and results. Reply STOP to opt out or HELP for help.

## homeowner_need_more_info_v1

Murfreesboro Home Pros: Quick question so we route this correctly: {{question}} Reply here when you can. Reply STOP to opt out or HELP for help.

## homeowner_follow_up_v1

Murfreesboro Home Pros: Checking in on request {{lead_id}} — did the provider contact you? Reply YES, NO, or NEED HELP. Reply STOP to opt out or HELP for help.

## help_response_v1

Murfreesboro Home Pros helps homeowners coordinate one-at-a-time referrals to independent local service providers. Reply with your question, or reply STOP to opt out.
