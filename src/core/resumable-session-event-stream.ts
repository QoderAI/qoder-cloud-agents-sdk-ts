import { mergeHeaders, type HeadersLike } from './client.js';
import { APIConnectionError, APIError, APIUserAbortError, QoderError } from './error.js';
import type { Stream } from './streaming.js';

const INITIAL_RETRY_DELAY = 500;
const MAX_RETRY_DELAY = 10_000;

type StreamFactory<T> = (lastEventID: string | undefined, signal: AbortSignal) => Promise<Stream<T>>;

/** @internal Resolve the cursor with the same precedence as a direct stream request. */
export function initialLastEventID(
  value: string | null | undefined,
  defaultHeaders?: HeadersLike,
  headers?: HeadersLike,
): string | undefined {
  const typedHeader = value == null ? undefined : { 'Last-Event-ID': value };
  return mergeHeaders(defaultHeaders, typedHeader, headers).get('last-event-id') ?? undefined;
}

/** @internal Replace only the cursor while retaining all other header overrides and deletions. */
export function resumableRequestHeaders(headers: HeadersLike | undefined, lastEventID: string | undefined): HeadersLike {
  const values: Record<string, string | null | undefined> = {};
  if (headers instanceof Headers || Array.isArray(headers)) {
    new Headers(headers as HeadersInit).forEach((value, key) => { values[key] = value; });
  } else if (headers) {
    Object.assign(values, headers);
  }
  for (const key of Object.keys(values)) {
    if (key.toLowerCase() === 'last-event-id') delete values[key];
  }
  values['Last-Event-ID'] = lastEventID ?? null;
  return values;
}

/** @internal Exported for deterministic retry-policy tests. */
export function isResumableStreamRetryable(error: unknown): boolean {
  if (error instanceof APIUserAbortError) return false;
  if (error instanceof APIConnectionError) return true;
  if (error instanceof APIError) {
    if (error.status === 409) return false;
    if (error.headers?.get('x-should-retry') === 'false') return false;
    if (error.headers?.get('x-should-retry') === 'true') return true;
    return error.status === 408 || error.status === 429 || (error.status !== undefined && error.status >= 500);
  }
  // Response-body transport failures are surfaced by ReadableStream as their original error.
  return !(error instanceof QoderError) && !(error instanceof SyntaxError);
}

/** @internal Exported for deterministic backoff tests. */
export function resumableStreamRetryDelay(attempt: number, random = Math.random): number {
  const backoff = Math.min(INITIAL_RETRY_DELAY * 2 ** attempt, MAX_RETRY_DELAY);
  return backoff * (0.5 + random() * 0.5);
}

function aborted(signal: AbortSignal): APIUserAbortError {
  return new APIUserAbortError('Request was aborted', { cause: signal.reason });
}

function isTerminalSessionEvent(value: unknown): boolean {
  if (!value || typeof value !== 'object') return false;
  const type = (value as { type?: unknown }).type;
  return type === 'session.status_terminated' || type === 'session.deleted';
}

async function waitForRetry(ms: number, signal: AbortSignal): Promise<void> {
  if (signal.aborted) throw aborted(signal);
  let timer: ReturnType<typeof setTimeout> | undefined;
  await new Promise<void>((resolve, reject) => {
    const onAbort = () => {
      clearTimeout(timer);
      reject(aborted(signal));
    };
    signal.addEventListener('abort', onAbort, { once: true });
    timer = setTimeout(() => {
      signal.removeEventListener('abort', onAbort);
      resolve();
    }, ms);
  });
}

/**
 * A stateful, single-consumer Session Events stream that reconnects after retryable
 * failures and resumes from the last fully decoded SSE frame.
 */
export class ResumableSessionEventStream<T> implements AsyncIterable<T> {
  readonly controller = new AbortController();
  lastEventID: string | undefined;

  private activeStream?: Stream<T>;
  private activeIterator?: AsyncIterator<T>;
  private consumed = false;
  private closed = false;
  private abortCleanup?: Promise<void>;
  private readonly callerSignal?: AbortSignal;
  private readonly onCallerAbort: () => void;
  private readonly onAbort: () => void;

  constructor(
    private readonly openStream: StreamFactory<T>,
    initialLastEventID?: string | null,
    signal?: AbortSignal | null,
  ) {
    this.lastEventID = initialLastEventID ?? undefined;
    this.callerSignal = signal ?? undefined;
    this.onCallerAbort = () => this.controller.abort(this.callerSignal?.reason);
    this.onAbort = () => { this.abortCleanup ??= this.releaseActiveStream(); };
    this.controller.signal.addEventListener('abort', this.onAbort, { once: true });
    if (this.callerSignal?.aborted) this.onCallerAbort();
    else this.callerSignal?.addEventListener('abort', this.onCallerAbort, { once: true });
  }

  private async releaseActiveStream(): Promise<void> {
    const iterator = this.activeIterator;
    const stream = this.activeStream;
    this.activeIterator = undefined;
    this.activeStream = undefined;
    await iterator?.return?.().catch(() => {});
    await stream?.close();
  }

  async close(): Promise<void> {
    if (this.closed) {
      await this.abortCleanup;
      return;
    }
    this.closed = true;
    this.callerSignal?.removeEventListener('abort', this.onCallerAbort);
    this.controller.abort();
    await (this.abortCleanup ?? this.releaseActiveStream());
  }

  async *[Symbol.asyncIterator](): AsyncGenerator<T> {
    if (this.consumed) throw new QoderError('Cannot iterate over a consumed stream');
    this.consumed = true;
    let attempt = 0;

    try {
      while (!this.closed) {
        let stream: Stream<T> | undefined;
        try {
          stream = await this.openStream(this.lastEventID, this.controller.signal);
          if (this.closed) {
            await stream.close();
            return;
          }
          this.activeStream = stream;
          const iterator = stream[Symbol.asyncIterator]();
          this.activeIterator = iterator;
          for (;;) {
            const result = await iterator.next();
            if (stream.hasLastEventID) this.lastEventID = stream.lastEventID;
            if (result.done) {
              if (stream.completed) return;
              break;
            }
            if (this.closed) return;
            attempt = 0;
            const terminal = isTerminalSessionEvent(result.value);
            yield result.value;
            if (terminal) return;
          }
        } catch (error) {
          if (stream?.hasLastEventID) this.lastEventID = stream.lastEventID;
          if (this.closed) return;
          if (this.controller.signal.aborted) throw error instanceof APIUserAbortError ? error : aborted(this.controller.signal);
          if (!isResumableStreamRetryable(error)) throw error;
        } finally {
          const iterator = this.activeIterator;
          if (this.activeStream === stream) {
            this.activeIterator = undefined;
            this.activeStream = undefined;
          }
          await iterator?.return?.().catch(() => {});
          await stream?.close();
        }

        if (this.closed) return;
        try {
          await waitForRetry(resumableStreamRetryDelay(attempt++), this.controller.signal);
        } catch (error) {
          if (this.closed) return;
          throw error;
        }
      }
    } finally {
      await this.close();
    }
  }
}
