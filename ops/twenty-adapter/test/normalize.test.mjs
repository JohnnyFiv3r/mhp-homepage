import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizeUrgency, normalizeStage, normalizeIntakePayload, validateNormalizedIntake } from '../src/normalize.mjs';

test('normalizes urgency from site timing labels', () => {
  assert.equal(normalizeUrgency('Urgent / active issue'), 'urgent_24h');
  assert.equal(normalizeUrgency('Planning / comparing options'), 'planned_90d');
  assert.equal(normalizeUrgency('fire or structural collapse'), 'emergency_safety');
});

test('normalizes stage labels', () => {
  assert.equal(normalizeStage('Ready for estimate'), 'Ready for estimate');
  assert.equal(normalizeStage('Documenting for insurance or resale'), 'Documenting');
});

test('builds packet-aligned intake payload', () => {
  const payload = normalizeIntakePayload({
    source_path: '/projects/roofing/',
    project_category: 'roofing',
    timing: 'Urgent / active issue',
    problem: 'Active leak',
    project_stage: 'Ready for estimate',
    location_text: '37128',
    homeowner_name: 'Jane Doe',
    mobile_phone: '+16155550123',
    sms_consent: 'true',
    sms_consent_text: 'consent text'
  }, new Date('2026-06-27T19:00:00Z'));
  assert.equal(payload.source.source_type, 'project');
  assert.equal(payload.source.service, 'roofing');
  assert.equal(payload.service_request.urgency, 'urgent_24h');
  assert.equal(payload.consent_event.status, 'granted');
  assert.deepEqual(validateNormalizedIntake(payload), []);
});
