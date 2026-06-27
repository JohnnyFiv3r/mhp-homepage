export function loadConfig(env = process.env) {
  const config = {
    twentyBaseUrl: env.TWENTY_BASE_URL || 'https://api.twenty.com',
    twentyApiKey: env.TWENTY_API_KEY || '',
    twentyWebhookSecret: env.TWENTY_WEBHOOK_SECRET || '',
    formSharedSecret: env.MHP_FORM_SHARED_SECRET || '',
    port: Number(env.MHP_ADAPTER_PORT || 8787),
    dryRun: String(env.MHP_DRY_RUN || 'true').toLowerCase() !== 'false'
  };
  return config;
}

export function validateConfig(config, { production = false } = {}) {
  const errors = [];
  if (!config.twentyBaseUrl) errors.push('TWENTY_BASE_URL is required');
  if (production && !config.twentyApiKey) errors.push('TWENTY_API_KEY is required in production');
  if (production && !config.twentyWebhookSecret) errors.push('TWENTY_WEBHOOK_SECRET is required in production');
  if (production && !config.formSharedSecret) errors.push('MHP_FORM_SHARED_SECRET is required in production');
  if (!Number.isInteger(config.port) || config.port <= 0) errors.push('MHP_ADAPTER_PORT must be a positive integer');
  return errors;
}
