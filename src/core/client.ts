import { APIPromise } from './api-promise.js';
import { type Credential, readEnv } from './credentials.js';
import { APIConnectionError, APIConnectionTimeoutError, APIError, APIUserAbortError, QoderError } from './error.js';
import { Page, PagePromise, type PageResponse, type PaginationMode } from './pagination.js';
import { Stream } from './streaming.js';

export type HeadersLike = HeadersInit | Record<string, string | null | undefined>;
export type Middleware = (request: Request, next: (request: Request) => Promise<Response>) => Promise<Response>;
export interface ClientOptions {
  accessToken?: string | (() => string | Promise<string>);
  credential?: Credential;
  baseURL?: string;
  fetch?: typeof globalThis.fetch;
  maxRetries?: number;
  timeout?: number;
  defaultHeaders?: HeadersLike;
  defaultQuery?: Record<string, unknown>;
  middleware?: Middleware[];
}
export interface RequestOptions {
  headers?: HeadersLike;
  query?: object;
  body?: unknown;
  signal?: AbortSignal | null;
  timeout?: number;
  maxRetries?: number;
  idempotencyKey?: string;
}
export interface APIRequestOptions extends RequestOptions {
  method: string;
  path: string;
  responseType?: 'json' | 'stream' | 'binary' | 'response' | 'void';
}

export function mergeHeaders(...sources: (HeadersLike | undefined)[]): Headers {
  const headers = new Headers();
  for (const source of sources) {
    if (!source) continue;
    if (source instanceof Headers || Array.isArray(source)) {
      new Headers(source as HeadersInit).forEach((value, key) => headers.set(key, value));
    } else {
      for (const [key, value] of Object.entries(source)) {
        if (value === null) headers.delete(key);
        else if (value !== undefined) headers.set(key, value);
      }
    }
  }
  return headers;
}

export function stringifyQuery(query: object, arrayFormat: 'repeat' | 'brackets' = 'repeat'): string {
  const params = new URLSearchParams();
  const append = (key: string, value: unknown) => {
    if (value === undefined || value === null) return;
    if (Array.isArray(value)) { for (const item of value) append(arrayFormat === 'brackets' && !key.endsWith('[]') ? `${key}[]` : key, item); }
    else if (value instanceof Date) params.append(key, value.toISOString());
    else if (typeof value === 'object') {
      for (const [name, child] of Object.entries(value)) append(`${key}[${name}]`, child);
    } else params.append(key, String(value));
  };
  for (const [key, value] of Object.entries(query)) append(key, value);
  return params.toString();
}

function abortError(signal: AbortSignal, timedOut: boolean): Error {
  return timedOut ? new APIConnectionTimeoutError('Request timed out', { cause: signal.reason })
    : new APIUserAbortError('Request was aborted', { cause: signal.reason });
}

async function withSignal<T>(promise: PromiseLike<T>, signal: AbortSignal, timedOut: () => boolean): Promise<T> {
  if (signal.aborted) {
    void Promise.resolve(promise).catch(() => {});
    throw abortError(signal, timedOut());
  }
  return new Promise<T>((resolve, reject) => {
    const abort = () => reject(abortError(signal, timedOut()));
    signal.addEventListener('abort', abort, { once: true });
    Promise.resolve(promise).then(resolve, reject).finally(() => signal.removeEventListener('abort', abort));
  });
}

async function wait(ms: number, signal: AbortSignal, timedOut: () => boolean): Promise<void> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  try { await withSignal(new Promise<void>((resolve) => { timer = setTimeout(resolve, ms); }), signal, timedOut); }
  finally { clearTimeout(timer); }
}

export class APIClient {
  readonly baseURL: string;
  readonly maxRetries: number;
  readonly timeout: number;
  protected readonly options: ClientOptions;
  private readonly fetchImpl: typeof globalThis.fetch;
  private readonly controllers = new WeakMap<Response, AbortController>();

  constructor(options: ClientOptions = {}, readonly mode: 'forward' | 'managed' = 'managed') {
    this.options = { ...options };
    this.baseURL = (options.baseURL ?? readEnv(mode === 'forward' ? 'QODER_FORWARD_BASE_URL' : 'QODER_BASE_URL')
      ?? `https://api.qoder.com/api/v1/${mode === 'forward' ? 'forward' : 'cloud'}`).replace(/\/+$/, '');
    const url = new URL(this.baseURL);
    if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password) throw new QoderError('Invalid baseURL');
    this.maxRetries = options.maxRetries ?? 2;
    this.timeout = options.timeout ?? 600_000;
    this.validateOptions(this.maxRetries, this.timeout);
    this.fetchImpl = options.fetch ?? globalThis.fetch;
    if (!this.fetchImpl) throw new QoderError('A fetch implementation is required');
  }

  private validateOptions(retries: number, timeout: number): void {
    if (!Number.isInteger(retries) || retries < 0) throw new QoderError('maxRetries must be a non-negative integer');
    if (!Number.isFinite(timeout) || timeout < 0) throw new QoderError('timeout must be a non-negative number');
  }

  request<T>(options: APIRequestOptions): APIPromise<T> {
    return new APIPromise(this.execute(options), async (response) => {
      if (options.responseType === 'response' || options.responseType === 'binary') return response as T;
      if (options.responseType === 'stream') return new Stream(response, this.controllers.get(response)) as T;
      if (options.responseType === 'void' || response.status === 204 || response.status === 205) {
        await response.body?.cancel();
        return undefined as T;
      }
      return await response.json() as T;
    });
  }

  getAPIList<T>(path: string, query: object = {}, options: RequestOptions = {}, pagination: PaginationMode = this.mode === 'forward' ? 'cursor' : 'page'): PagePromise<T> {
    const merged = { ...this.options.defaultQuery, ...query, ...options.query };
    return new PagePromise(this.execute({ ...options, method: 'GET', path, query: merged }), async (response) =>
      new Page<T>(this, response, await response.json() as PageResponse<T>, path, merged, { ...options, query: undefined }, pagination));
  }

  /** Resolve the API grant, then send a separate request without API credentials or headers. */
  downloadFile(path: string, options: RequestOptions = {}): APIPromise<Response> {
    const response = (async () => {
      const link = await this.request<{ url: string }>({ ...options, method: 'GET', path, responseType: 'json' });
      const url = new URL(link.url);
      if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password) throw new QoderError('Invalid file content link');
      return this.execute({ method: 'GET', path: url.href, timeout: options.timeout, maxRetries: options.maxRetries, signal: options.signal, responseType: 'response' }, true);
    })();
    return new APIPromise(response, (value) => value);
  }

  private retryable(method: string, headers: Headers, replayable: boolean, response?: Response): boolean {
    if (!replayable) return false;
    const safe = ['GET', 'HEAD'].includes(method) || !!headers.get('idempotency-key');
    if (!response) return safe;
    if (response.status === 409 || (!safe && response.status !== 429)) return false;
    if (response.headers.get('x-should-retry') === 'false') return false;
    if (response.headers.get('x-should-retry') === 'true') return true;
    return response.status === 429 || response.status === 408 || response.status >= 500;
  }

  private retryDelay(response: Response | undefined, attempt: number): number {
    if (response) {
      const ms = response.headers.get('retry-after-ms');
      if (ms !== null && Number.isFinite(Number(ms)) && Number(ms) >= 0) return Number(ms);
      const after = response.headers.get('retry-after');
      if (after) {
        const seconds = Number(after);
        const delay = Number.isFinite(seconds) ? seconds * 1000 : Date.parse(after) - Date.now();
        if (Number.isFinite(delay) && delay >= 0) return delay;
      }
    }
    return Math.min(500 * 2 ** attempt, 8000) * (1 - Math.random() * 0.25);
  }

  private async execute(options: APIRequestOptions, storage = false): Promise<Response> {
    const retries = options.maxRetries ?? this.maxRetries;
    const timeout = options.timeout ?? this.timeout;
    this.validateOptions(retries, timeout);
    const callerSignal = options.signal ?? new AbortController().signal;
    if (callerSignal.aborted) throw abortError(callerSignal, false);
    const url = storage ? new URL(options.path) : new URL(`${this.baseURL}/${options.path.replace(/^\/+/, '')}`);
    if (!storage) {
      const query = stringifyQuery({ ...this.options.defaultQuery, ...options.query }, this.mode === 'managed' ? 'brackets' : 'repeat');
      if (query) url.search += `${url.search ? '&' : ''}${query}`;
    }
    const method = options.method.toUpperCase();
    const value = await withSignal(Promise.resolve(options.body), callerSignal, () => false);
    const headers = storage ? new Headers() : mergeHeaders({ Accept: options.responseType === 'stream' ? 'text/event-stream' : 'application/json' }, this.options.defaultHeaders, options.headers);
    if (options.idempotencyKey !== undefined) headers.set('Idempotency-Key', options.idempotencyKey);
    let body: BodyInit | undefined;
    if (value !== undefined) {
      if (value instanceof FormData) { body = value; headers.delete('content-type'); }
      else if (typeof value === 'string' || value instanceof Blob || value instanceof ArrayBuffer || value instanceof Uint8Array || value instanceof URLSearchParams || value instanceof ReadableStream) body = value as BodyInit;
      else { body = JSON.stringify(value); if (!headers.has('content-type')) headers.set('Content-Type', 'application/json'); }
    }
    const replayable = !(body instanceof ReadableStream);
    for (let attempt = 0; ; attempt++) {
      const controller = new AbortController();
      let timedOut = false;
      const onAbort = () => controller.abort(callerSignal.reason);
      if (callerSignal.aborted) onAbort();
      else callerSignal.addEventListener('abort', onAbort, { once: true });
      const timer = timeout ? setTimeout(() => { timedOut = true; controller.abort(); }, timeout) : undefined;
      const cleanup = () => { clearTimeout(timer); callerSignal.removeEventListener('abort', onAbort); };
      const signal = controller.signal;
      let handedOff = false;
      let retryDelay: number | undefined;
      try {
        if (signal.aborted) throw abortError(signal, timedOut);
        const attemptHeaders = new Headers(headers);
        if (!storage) {
          attemptHeaders.set('X-Qoder-Retry-Count', String(attempt));
          if (!attemptHeaders.has('authorization')) {
            const credential = this.options.credential;
            const configured = this.options.accessToken;
            const token = await withSignal(Promise.resolve(credential ? credential.getToken() : typeof configured === 'function' ? configured() : configured ?? readEnv('QODER_ACCESS_TOKEN')), signal, () => timedOut);
            if (token) attemptHeaders.set('Authorization', `Bearer ${token}`);
          }
        }
        let response: Response;
        try {
          const init: RequestInit & { duplex?: string } = { method, headers: attemptHeaders, body, signal, redirect: storage ? 'follow' : 'error' };
          if (body instanceof ReadableStream) init.duplex = 'half';
          const middleware = storage ? [] : this.options.middleware ?? [];
          let fetchPromise: Promise<Response>;
          if (middleware.length) {
            const next = middleware.reduceRight<(request: Request) => Promise<Response>>(
              (next, handler) => request => handler(request, next),
              request => this.fetchImpl.call(undefined, request));
            fetchPromise = next(new Request(url, init));
          } else fetchPromise = this.fetchImpl.call(undefined, url.toString(), init);
          response = await withSignal(fetchPromise, signal, () => timedOut);
          if (!(response instanceof Response)) throw new Error('fetch returned no Response');
        } catch (error) {
          if (callerSignal.aborted) throw abortError(callerSignal, false);
          if (attempt < retries && this.retryable(method, attemptHeaders, replayable)) {
            retryDelay = this.retryDelay(undefined, attempt);
            continue;
          }
          if (timedOut) throw abortError(signal, true);
          throw new APIConnectionError('Connection error', { cause: error });
        }
        if (!response.ok) {
          if (attempt < retries && this.retryable(method, attemptHeaders, replayable, response)) {
            retryDelay = this.retryDelay(response, attempt);
            await response.body?.cancel();
            continue;
          }
          const raw = await withSignal(response.text(), signal, () => timedOut);
          let error: unknown = raw;
          try { error = JSON.parse(raw); } catch { /* Preserve gateway text. */ }
          const retained = new Response(raw, { status: response.status, statusText: response.statusText, headers: response.headers });
          const failure = APIError.generate(response.status, error, undefined, response.headers, retained);
          failure.request = new Request(url, { method, headers: attemptHeaders });
          throw failure;
        }
        const wrapped = this.wrapResponse(response, controller, cleanup, () => timedOut);
        this.controllers.set(wrapped, controller);
        handedOff = true;
        return wrapped;
      } finally {
        if (!handedOff) cleanup();
        if (retryDelay !== undefined) await wait(retryDelay, callerSignal, () => false);
      }
    }
  }

  private wrapResponse(response: Response, controller: AbortController, cleanup: () => void, timedOut: () => boolean): Response {
    if (!response.body) { cleanup(); return response; }
    const reader = response.body.getReader();
    const body = new ReadableStream<Uint8Array>({
      async pull(target) {
        try {
          const result = await withSignal(reader.read(), controller.signal, timedOut);
          if (result.done) { cleanup(); reader.releaseLock(); target.close(); }
          else target.enqueue(result.value);
        } catch (error) { cleanup(); await reader.cancel().catch(() => {}); target.error(error); }
      },
      async cancel(reason) { cleanup(); await reader.cancel(reason); },
    }, { highWaterMark: 0 });
    const result = new Response(body, { status: response.status, statusText: response.statusText, headers: response.headers });
    Object.defineProperty(result, 'url', { value: response.url });
    return result;
  }
}
