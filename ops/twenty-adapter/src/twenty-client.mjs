export class TwentyClient {
  constructor({ baseUrl, apiKey, dryRun = true, fetchImpl = fetch }) {
    this.baseUrl = String(baseUrl || '').replace(/\/$/, '');
    this.apiKey = apiKey;
    this.dryRun = dryRun;
    this.fetch = fetchImpl;
  }

  async request(path, { method = 'GET', body } = {}) {
    const url = `${this.baseUrl}${path}`;
    const payload = body ? JSON.stringify(body) : undefined;
    if (this.dryRun) return { dryRun: true, method, url, body };
    const res = await this.fetch(url, {
      method,
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: payload
    });
    const text = await res.text();
    let data;
    try { data = text ? JSON.parse(text) : null; } catch { data = text; }
    if (!res.ok) throw new Error(`Twenty API ${method} ${path} failed ${res.status}: ${text}`);
    return data;
  }

  async createServiceRequestBundle(normalized) {
    // Production implementation should replace these dry-run objects with workspace-specific REST/GraphQL calls.
    // Twenty APIs are schema-generated, so final endpoint names must be confirmed after custom objects are created.
    return this.request('/graphql', {
      method: 'POST',
      body: {
        operationName: 'CreateMhpServiceRequestBundle',
        variables: normalized,
        query: 'mutation CreateMhpServiceRequestBundle($input: JSON!) { __typename }'
      }
    });
  }
}
