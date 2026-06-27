import http from 'node:http';
import { loadConfig, validateConfig } from './config.mjs';
import { normalizeIntakePayload, validateNormalizedIntake } from './normalize.mjs';
import { verifyFormSignature, verifyTwentyWebhookSignature } from './security.mjs';
import { JsonlLedger } from './ledger.mjs';
import { TwentyClient } from './twenty-client.mjs';

const config = loadConfig();
const errors = validateConfig(config, { production: !config.dryRun });
if (errors.length) throw new Error(errors.join('; '));

const ledger = new JsonlLedger(new URL('../var/event-ledger.jsonl', import.meta.url).pathname);
const deadLetter = new JsonlLedger(new URL('../var/dead-letter.jsonl', import.meta.url).pathname);
const twenty = new TwentyClient({ baseUrl: config.twentyBaseUrl, apiKey: config.twentyApiKey, dryRun: config.dryRun });

async function readBody(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  return Buffer.concat(chunks).toString('utf8');
}

function json(res, status, body) {
  res.writeHead(status, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(body));
}

const server = http.createServer(async (req, res) => {
  try {
    if (req.method === 'GET' && req.url === '/health') return json(res, 200, { ok: true, dryRun: config.dryRun });
    if (req.method === 'POST' && req.url === '/intake') {
      const rawBody = await readBody(req);
      const signature = req.headers['x-mhp-signature'];
      if (!config.dryRun && !verifyFormSignature({ rawBody, signature, secret: config.formSharedSecret })) {
        return json(res, 401, { error: 'invalid form signature' });
      }
      const input = JSON.parse(rawBody || '{}');
      const normalized = normalizeIntakePayload(input);
      const validation = validateNormalizedIntake(normalized);
      if (validation.length) return json(res, 422, { error: 'validation_failed', details: validation });
      if (ledger.hasIdempotencyKey(normalized.idempotency_key)) return json(res, 200, { ok: true, duplicate: true, idempotency_key: normalized.idempotency_key });
      const result = await twenty.createServiceRequestBundle(normalized);
      ledger.append({ type: 'lead_intake_submitted', idempotency_key: normalized.idempotency_key, normalized, result });
      return json(res, 202, { ok: true, idempotency_key: normalized.idempotency_key, dryRun: config.dryRun });
    }
    if (req.method === 'POST' && req.url === '/twenty/webhook') {
      const rawBody = await readBody(req);
      const valid = verifyTwentyWebhookSignature({
        rawBody,
        timestamp: req.headers['x-twenty-webhook-timestamp'],
        signature: req.headers['x-twenty-webhook-signature'],
        secret: config.twentyWebhookSecret
      });
      if (!config.dryRun && !valid) return json(res, 401, { error: 'invalid Twenty webhook signature' });
      const payload = JSON.parse(rawBody || '{}');
      ledger.append({ type: 'twenty_webhook', event: payload.event, payload });
      return json(res, 200, { ok: true });
    }
    json(res, 404, { error: 'not_found' });
  } catch (error) {
    deadLetter.append({ type: 'adapter_error', url: req.url, message: error.message, stack: error.stack });
    json(res, 500, { error: 'internal_error' });
  }
});

server.listen(config.port, () => {
  console.log(`mhp-twenty-adapter listening on :${config.port} dryRun=${config.dryRun}`);
});
