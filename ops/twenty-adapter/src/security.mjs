import crypto from 'node:crypto';

export function hmacHex(secret, value) {
  return crypto.createHmac('sha256', secret).update(value).digest('hex');
}

export function timingSafeEqualHex(a, b) {
  const aa = Buffer.from(String(a || ''), 'hex');
  const bb = Buffer.from(String(b || ''), 'hex');
  if (aa.length !== bb.length) return false;
  return crypto.timingSafeEqual(aa, bb);
}

export function verifyTwentyWebhookSignature({ rawBody, timestamp, signature, secret, toleranceSeconds = 300 }) {
  if (!rawBody || !timestamp || !signature || !secret) return false;
  const tsMs = Date.parse(timestamp);
  if (!Number.isFinite(tsMs)) return false;
  if (Math.abs(Date.now() - tsMs) > toleranceSeconds * 1000) return false;
  const expected = hmacHex(secret, `${timestamp}:${rawBody}`);
  return timingSafeEqualHex(expected, signature);
}

export function verifyFormSignature({ rawBody, signature, secret }) {
  if (!rawBody || !signature || !secret) return false;
  const expected = hmacHex(secret, rawBody);
  return timingSafeEqualHex(expected, signature);
}
