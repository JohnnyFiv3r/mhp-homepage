const URGENCY_RULES = [
  [/emergency|danger|safety|fire|structural collapse|electrical hazard/i, 'emergency_safety'],
  [/urgent|active|leak|damage|this week|24/i, 'urgent_24h'],
  [/soon|repair|7|week|30/i, 'normal_7d'],
  [/planning|comparing|maintenance|prevention|upgrade|resale|90/i, 'planned_90d']
];

export function normalizeUrgency(value = '') {
  const text = String(value || '').trim();
  for (const [pattern, urgency] of URGENCY_RULES) {
    if (pattern.test(text)) return urgency;
  }
  return 'normal_7d';
}

export function normalizeStage(value = '') {
  const text = String(value || '').trim();
  if (/ready/i.test(text)) return 'Ready for estimate';
  if (/compar/i.test(text)) return 'Comparing';
  if (/document|insurance|resale/i.test(text)) return 'Documenting';
  return 'Deciding';
}

export function deriveSourceType(sourcePath = '', fallback = 'home') {
  const path = String(sourcePath || '');
  if (path.includes('/projects/')) return 'project';
  if (/\/neighborhoods\/\d{5}\//.test(path)) return 'zip';
  if (path.includes('/neighborhoods/')) return 'neighborhood';
  if (path.includes('/resources/')) return 'resources';
  return fallback || 'home';
}

export function normalizeIntakePayload(input = {}, now = new Date()) {
  const sourcePath = input.source_path || input.source?.source_path || '/';
  const service = input.project_category || input.service || input.source?.service || 'general';
  const mobilePhone = input.mobile_phone || input.person?.mobile_phone || '';
  const consent = input.sms_consent === true || input.sms_consent === 'true' || input.consent_event?.status === 'granted';
  return {
    event: 'lead_intake_submitted',
    version: '1.1',
    idempotency_key: input.idempotency_key || `${sourcePath}:${mobilePhone}:${now.toISOString().slice(0, 16)}`,
    source_event_id: input.source_event_id || `form:${Date.now()}`,
    timestamp_utc: input.timestamp_utc || now.toISOString(),
    actor: input.actor || 'website_form',
    source: {
      site: 'mhp-homepage',
      source_path: sourcePath,
      source_type: input.source_type || deriveSourceType(sourcePath),
      service
    },
    person: {
      homeowner_name: input.homeowner_name || input.person?.homeowner_name || '',
      mobile_phone: mobilePhone,
      email: input.email || input.person?.email || '',
      do_not_contact: false
    },
    property: {
      location_text: input.location_text || input.property?.location_text || '',
      zip: input.zip || input.property?.zip || null,
      address: null,
      occupancy_authority: input.occupancy_authority || 'unknown'
    },
    service_request: {
      problem: input.problem || input.service_request?.problem || '',
      urgency: input.urgency || normalizeUrgency(input.timing),
      project_stage: input.project_stage ? normalizeStage(input.project_stage) : normalizeStage(input.service_request?.project_stage),
      qualification_tier: null,
      status: consent ? 'new' : 'qualifying'
    },
    consent_event: {
      channel: 'sms',
      status: consent ? 'granted' : 'unknown',
      language_version: 'sms_consent_web_v1',
      language_text: input.sms_consent_text || input.consent_event?.language_text || '',
      source_url_or_call_id: input.source_url_or_call_id || sourcePath,
      scope: 'transactional service-request coordination; one selected local service partner at a time',
      revocation: null
    }
  };
}

export function validateNormalizedIntake(payload) {
  const errors = [];
  if (!payload.idempotency_key) errors.push('idempotency_key required');
  if (!payload.source?.source_path) errors.push('source.source_path required');
  if (!payload.source?.service) errors.push('source.service required');
  if (!payload.person?.homeowner_name) errors.push('person.homeowner_name required');
  if (!payload.person?.mobile_phone) errors.push('person.mobile_phone required');
  if (!payload.property?.location_text) errors.push('property.location_text required');
  if (!payload.service_request?.problem) errors.push('service_request.problem required');
  if (!payload.service_request?.urgency) errors.push('service_request.urgency required');
  if (payload.consent_event?.status === 'granted' && !payload.consent_event?.language_version) errors.push('consent language_version required');
  return errors;
}
