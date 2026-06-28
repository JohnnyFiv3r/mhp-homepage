import fs from 'node:fs';
import path from 'node:path';

const root = new URL('../../../', import.meta.url).pathname;
const required = [
  'data/crm/twenty-objects.csv',
  'data/crm/lead-fields.csv',
  'data/crm/provider-fields.csv',
  'data/crm/pipeline-statuses.csv',
  'ops/crm-sms/webhook-contract.json',
  'ops/crm-sms/sms-templates.md',
  'ops/twenty-adapter/src/server.mjs',
  'ops/twenty-adapter/docs/production-readiness-checklist.md',
  'ops/twenty-selfhost/README.md',
  'ops/twenty-selfhost/docs/install-runbook.md',
  'ops/twenty-selfhost/scripts/backup-postgres.sh'
];
let failed = false;
for (const file of required) {
  const exists = fs.existsSync(path.join(root, file));
  console.log(exists ? 'OK' : 'MISSING', file);
  if (!exists) failed = true;
}
const objects = fs.readFileSync(path.join(root, 'data/crm/twenty-objects.csv'), 'utf8');
for (const name of ['ServiceRequest','ConsentEvent','RoutingAttempt','Communication','Incident']) {
  const ok = objects.includes(name);
  console.log(ok ? 'OK' : 'MISSING', `Twenty object ${name}`);
  if (!ok) failed = true;
}
process.exit(failed ? 1 : 0);
