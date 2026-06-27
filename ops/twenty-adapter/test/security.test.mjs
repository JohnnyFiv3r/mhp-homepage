import test from 'node:test';
import assert from 'node:assert/strict';
import { hmacHex, verifyFormSignature, verifyTwentyWebhookSignature } from '../src/security.mjs';

test('verifies form signatures', () => {
  const rawBody = JSON.stringify({ hello: 'world' });
  const signature = hmacHex('secret', rawBody);
  assert.equal(verifyFormSignature({ rawBody, signature, secret: 'secret' }), true);
  assert.equal(verifyFormSignature({ rawBody, signature: '00', secret: 'secret' }), false);
});

test('verifies Twenty webhook signatures', () => {
  const rawBody = JSON.stringify({ event: 'person.created' });
  const timestamp = new Date().toISOString();
  const signature = hmacHex('twenty-secret', `${timestamp}:${rawBody}`);
  assert.equal(verifyTwentyWebhookSignature({ rawBody, timestamp, signature, secret: 'twenty-secret' }), true);
});
