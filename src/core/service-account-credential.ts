import type { Credential } from './credentials.js';
import { readEnv } from './credentials.js';
import { APIConnectionError, APIConnectionTimeoutError, APIError, QoderError } from './error.js';

export interface ServiceAccountCredentialOptions {
  saKey: string;
  region: 'cn' | 'global';
  scopes: readonly string[];
  ttlSeconds?: number;
  /** Exchange timeout in milliseconds, including response body reading. */
  timeout?: number;
  fetch?: typeof globalThis.fetch;
}

/** Lazy, instance-owned SAT cache. Share an instance between clients in the same region. */
export class ServiceAccountCredential implements Credential {
  readonly region: 'cn' | 'global';
  #key: string;
  #scope: string;
  #ttl: number;
  #timeout: number;
  #fetch: typeof globalThis.fetch;
  #token?: string;
  #refreshAt = 0;
  #safeUntil = 0;
  #inflight?: Promise<string>;
  #failure?: unknown;
  #retryAt = 0;
  #transient = false;

  constructor(options: ServiceAccountCredentialOptions) {
    if (!options.saKey?.trim()) throw new QoderError('saKey must not be empty');
    if (options.region !== 'cn' && options.region !== 'global') throw new QoderError('region must be cn or global');
    if (!Array.isArray(options.scopes) || !options.scopes.length
      || options.scopes.some(scope => typeof scope !== 'string' || !scope || /\s/.test(scope))) {
      throw new QoderError('scopes must be a nonempty array of scope names');
    }
    this.region = options.region;
    this.#key = options.saKey;
    this.#scope = [...new Set(options.scopes)].join(' ');
    this.#ttl = options.ttlSeconds ?? 3600;
    if (!Number.isInteger(this.#ttl) || this.#ttl < 1 || this.#ttl > 43200) throw new QoderError('ttlSeconds must be an integer from 1 to 43200');
    this.#timeout = options.timeout ?? 30_000;
    if (!Number.isFinite(this.#timeout) || this.#timeout <= 0 || this.#timeout > 2 ** 31 - 1) throw new QoderError('Invalid exchange timeout');
    this.#fetch = options.fetch ?? globalThis.fetch;
    if (!this.#fetch) throw new QoderError('A fetch implementation is required');
  }

  static fromEnv(options: Omit<ServiceAccountCredentialOptions, 'saKey'>): ServiceAccountCredential {
    return new ServiceAccountCredential({ ...options, saKey: readEnv('QODER_SA_KEY') ?? '' });
  }

  validateRegion(host: string): void {
    const expected = host === 'api.qoder.com.cn' ? 'cn' : host === 'api.qoder.com' ? 'global' : undefined;
    if (expected && expected !== this.region) throw new QoderError('SA credential region does not match baseURL');
  }

  getToken(): Promise<string> {
    const now = performance.now();
    if (now < this.#retryAt) return this.#fallback();
    if (this.#token && now < this.#refreshAt) return Promise.resolve(this.#token);
    if (!this.#inflight) {
      const task = this.#exchange();
      this.#inflight = task;
      // Clear only this generation; rejection is shared and cached during cooldown.
      void task.then(() => { this.#inflight = undefined; }, () => { this.#inflight = undefined; });
    }
    return this.#inflight;
  }

  #fallback(): Promise<string> {
    if (this.#transient && this.#token && performance.now() < this.#safeUntil) return Promise.resolve(this.#token);
    return Promise.reject(this.#failure);
  }

  async #exchange(): Promise<string> {
    const started = performance.now();
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), this.#timeout);
    let response: Response | undefined;
    let bodyRead = false;
    try {
      const host = this.region === 'cn' ? 'https://openapi.qoder.com.cn' : 'https://openapi.qoder.sh';
      response = await this.#fetch(`${host}/api/v1/serviceToken/exchange`, {
        method: 'POST', redirect: 'error', credentials: 'omit', signal: controller.signal,
        headers: { Authorization: `Bearer ${this.#key}`, 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ grant_type: 'client_credentials', audience: 'qoder', scope: this.#scope, ttl_seconds: this.#ttl }),
      });
      const text = await response.text();
      bodyRead = true;
      let body: Record<string, unknown> = {};
      try { body = JSON.parse(text); } catch { /* Handled as an invalid response below. */ }
      if (!response.ok) {
        const detail = body?.error && typeof body.error === 'object' ? body.error as Record<string, unknown> : body;
        const safe = (value: unknown) => typeof value === 'string' ? value.split(this.#key).join('[redacted]').split(this.#token ?? '\0').join('[redacted]').slice(0,256) : undefined;
        throw APIError.generate(response.status, { code: safe(detail?.code), request_id: safe(body?.request_id) },
          'Service account token exchange failed', new Headers({ 'x-request-id': safe(response.headers.get('x-request-id') ?? response.headers.get('request-id')) ?? '' }));
      }
      const ttl = typeof body?.expires_in === 'string' && /^\d+$/.test(body.expires_in) ? Number(body.expires_in) : body?.expires_in;
      if (typeof body?.access_token !== 'string' || !body.access_token.trim()
        || typeof body.token_type !== 'string' || body.token_type.toLowerCase() !== 'bearer'
        || typeof ttl !== 'number' || !Number.isSafeInteger(ttl) || ttl <= 0 || ttl > 43200
        || (body.expires_at !== undefined && (typeof body.expires_at !== 'string'
          || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})$/.test(body.expires_at)
          || !Number.isFinite(Date.parse(body.expires_at))))) {
        throw new QoderError('Invalid service account token exchange response');
      }
      const safeUntil = started + (ttl - Math.min(5, ttl * 0.05)) * 1000;
      if (performance.now() >= safeUntil) throw new QoderError('Exchanged token has insufficient remaining lifetime');
      this.#token = body.access_token;
      this.#safeUntil = safeUntil;
      this.#refreshAt = started + (ttl - Math.min(60, ttl * 0.1)) * 1000;
      this.#retryAt = 0;
      this.#failure = undefined;
      return this.#token;
    } catch (error) {
      const failure = controller.signal.aborted ? new APIConnectionTimeoutError('Service account token exchange timed out')
        : bodyRead && error instanceof QoderError ? error : new APIConnectionError('Service account token exchange connection failed');
      this.#failure = failure;
      this.#transient = failure instanceof APIConnectionError
        || (failure instanceof APIError && (failure.status === 429 || (failure.status !== undefined && failure.status >= 500)));
      let cooldown = 5000;
      if (response?.status === 429) {
        const value = response.headers.get('retry-after');
        if (value) {
          const seconds = Number(value);
          const delay = Number.isFinite(seconds) ? seconds * 1000 : Date.parse(value) - Date.now();
          if (Number.isFinite(delay) && delay > 0 && delay <= 2 ** 31 - 1) cooldown = Math.max(cooldown, delay);
        }
      }
      this.#retryAt = performance.now() + cooldown;
      return this.#fallback();
    } finally {
      clearTimeout(timer);
    }
  }
}
