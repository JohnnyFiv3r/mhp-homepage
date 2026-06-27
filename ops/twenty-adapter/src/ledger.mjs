import fs from 'node:fs';
import path from 'node:path';

export class JsonlLedger {
  constructor(filePath) {
    this.filePath = filePath;
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
  }
  append(event) {
    fs.appendFileSync(this.filePath, JSON.stringify({ ...event, ledgered_at: new Date().toISOString() }) + '\n');
  }
  hasIdempotencyKey(key) {
    if (!fs.existsSync(this.filePath)) return false;
    const lines = fs.readFileSync(this.filePath, 'utf8').split('\n').filter(Boolean);
    return lines.some(line => {
      try { return JSON.parse(line).idempotency_key === key; } catch { return false; }
    });
  }
}
