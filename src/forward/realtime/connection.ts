import type WebSocket from 'ws';
import type { ClientOptions as WSOptions, RawData } from 'ws';
import type { APIClient, HeadersLike } from '../../core/client.js';
import { APIConnectionError, APIConnectionTimeoutError, APIError, APIUserAbortError, QoderError } from '../../core/error.js';
import { REALTIME_VERSION, type RealtimeClientEvent, type RealtimeClosed, type RealtimePlaybackReceipt, type RealtimeReady, type RealtimeServerEvent } from './types.js';

export interface RealtimeConnectOptions {
  conversationId: string;
  headers?: HeadersLike;
  /** Cancelling this signal releases the entire connection, including ready waits. */
  signal?: AbortSignal | null;
  handshakeTimeout?: number;
  readyTimeout?: number;
  sendTimeout?: number;
  closeTimeout?: number;
  maxQueuedEvents?: number;
  maxQueueBytes?: number;
  maxReceiveBytes?: number;
  /** Node agent (including proxy agents) and TLS settings; fetch/middleware do not apply to WS. */
  transport?: { agent?: object; ca?: string | Uint8Array | Array<string | Uint8Array>; cert?: string | Uint8Array; key?: string | Uint8Array; servername?: string; rejectUnauthorized?: boolean };
}
export interface RealtimeWaitOptions { signal?: AbortSignal | null; timeout?: number }
export interface RealtimeCloseOptions extends RealtimeWaitOptions { requestId?: string }
export class RealtimeProtocolError extends APIConnectionError {
  constructor(message: string, readonly conversationId: string, readonly code = 'invalid_event') { super(message); }
}
export class RealtimeConnectionClosedError extends APIConnectionError {
  constructor(readonly conversationId: string, readonly closeCode: number, readonly closeReason: string) { super(`Realtime connection closed (${closeCode})`); }
}
export class RealtimeServerError extends APIConnectionError {
  readonly code: string;
  readonly retryable?: boolean;
  readonly retry_after_ms?: number;
  constructor(readonly event: RealtimeServerEvent) {
    const payload = event.payload as Record<string, unknown>;
    super(typeof payload.message === 'string' ? payload.message : 'Realtime server error');
    this.code = String(payload.code);
    this.retryable = typeof payload.retryable === 'boolean' ? payload.retryable : undefined;
    this.retry_after_ms = typeof payload.retry_after_ms === 'number' ? payload.retry_after_ms : undefined;
  }
}
const importWS = () => import('ws');
const CLIENT_MESSAGE_BYTES = 256 * 1024;
const terminalErrors = new Set(['provider_initialization_failed', 'context_restore_failed', 'provider_unavailable', 'service_restarting', 'event_persistence_failed']);
const base64 = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/;
function validTimestamp(value: unknown): value is string {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,9})?(?:Z|[+-]\d{2}:\d{2})$/.test(value) || !Number.isFinite(Date.parse(value))) return false;
  const year = Number(value.slice(0, 4)), month = Number(value.slice(5, 7)), day = Number(value.slice(8, 10));
  const leap = year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
  return day > 0 && day <= [31, leap ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month - 1];
}
const isObject = (value: unknown): value is Record<string, unknown> => value !== null && typeof value === 'object' && !Array.isArray(value);
function positive(value: number | undefined, fallback: number, name: string): number {
  const result = value ?? fallback;
  if (!Number.isSafeInteger(result) || result <= 0 || result > 2 ** 31 - 1) throw new QoderError(`${name} must be a positive integer within the timer/size limit`);
  return result;
}
function wait<T>(value: Promise<T>, timeout: number, signal: AbortSignal | null | undefined, label: string): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const abort = () => finish(new APIUserAbortError(`${label} was aborted`));
    const timer = setTimeout(() => finish(new APIConnectionTimeoutError(`${label} timed out`)), timeout);
    let settled = false;
    function finish(error?: Error, result?: T) {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      signal?.removeEventListener('abort', abort);
      if (error) reject(error); else resolve(result as T);
    }
    if (signal?.aborted) abort(); else signal?.addEventListener('abort', abort, { once: true });
    value.then(result => finish(undefined, result), error => finish(error instanceof Error ? error : new APIConnectionError(label)));
  });
}
function validateEvent(value: unknown, conversationId: string): RealtimeServerEvent {
  const invalid = () => new RealtimeProtocolError('Invalid Realtime event envelope or payload', conversationId);
  if (!isObject(value) || value.version !== REALTIME_VERSION || typeof value.type !== 'string' || !value.type
    || !isObject(value.payload) || typeof value.event_id !== 'string' || !value.event_id
    || !Number.isSafeInteger(value.sequence) || (value.sequence as number) < 0 || value.conversation_id !== conversationId
    || !validTimestamp(value.timestamp)
    || (value.work_id !== undefined && typeof value.work_id !== 'string')
    || (value.announcement_id !== undefined && typeof value.announcement_id !== 'string')) throw invalid();
  const p = value.payload;
  const required: Record<string, string[]> = {
    'voice.state': ['state'], 'voice.replaced': ['reason'], 'transcript.delta': ['role', 'text'], 'transcript.final': ['role', 'text'],
    'audio.delta': ['audio'], 'playback.interrupt': ['reason'], 'work.accepted': ['status', 'objective'], 'work.running': ['status'],
    'work.progress': ['kind', 'detail'], 'work.milestone': ['announcement_id', 'milestone_type', 'summary'],
    'work.completed': ['status', 'result'], 'work.failed': ['status'], 'connection.closed': ['request_id', 'outcome'], error: ['code', 'message'],
  };
  if ((required[value.type] ?? []).some(key => typeof p[key] !== 'string')) throw invalid();
  const optionalStrings: Record<string, string[]> = {
    'transcript.delta': ['item_id', 'response_id'], 'transcript.final': ['item_id', 'response_id'],
    'work.progress': ['title', 'event_id'], 'work.completed': ['event_id'], 'work.failed': ['event_id'],
  };
  if ((optionalStrings[value.type] ?? []).some(key => p[key] !== undefined && typeof p[key] !== 'string')) throw invalid();
  if (value.type === 'work.progress' && p.is_error !== undefined && typeof p.is_error !== 'boolean') throw invalid();
  if (value.type === 'error' && ((p.retryable !== undefined && typeof p.retryable !== 'boolean') || (p.retry_after_ms !== undefined && (!Number.isSafeInteger(p.retry_after_ms) || (p.retry_after_ms as number) < 0)))) throw invalid();
  const statuses: Record<string, string> = { 'work.accepted': 'accepted', 'work.running': 'running', 'work.completed': 'completed', 'work.failed': 'failed' };
  if (statuses[value.type] && p.status !== statuses[value.type]) throw invalid();
  if (value.type === 'audio.delta' && (typeof p.audio !== 'string' || !p.audio || !base64.test(p.audio) || globalThis.atob(p.audio).length % 2)) throw invalid();
  if (value.type === 'voice.ready') {
    if (!isObject(p.config) || typeof p.provider !== 'string' || !isObject(p.input_audio) || !isObject(p.output_audio)
      || p.input_audio.format !== 'pcm16' || p.input_audio.sample_rate !== 16000 || p.input_audio.channels !== 1
      || p.output_audio.format !== 'pcm16' || p.output_audio.sample_rate !== 24000 || p.output_audio.channels !== 1
      || !isObject(p.capabilities) || typeof p.capabilities.graceful_close !== 'boolean') throw invalid();
  }
  if (value.type === 'work.failed' && (!isObject(p.error) || typeof p.error.code !== 'string')) throw invalid();
  if (value.type === 'connection.closed' && !['no_active_response', 'no_content', 'saved', 'saved_interrupted'].includes(p.outcome as string)) throw invalid();
  return value as unknown as RealtimeServerEvent;
}
/** Decode an audio.delta payload into raw 24 kHz PCM16 bytes; this does not play it. */
export function decodeRealtimeAudio(event: RealtimeServerEvent): Uint8Array {
  if (event.type !== 'audio.delta' || typeof event.payload.audio !== 'string' || !event.payload.audio || !base64.test(event.payload.audio)) throw new QoderError('Expected a valid audio.delta Base64 payload');
  const binary = globalThis.atob(event.payload.audio);
  if (binary.length % 2) throw new QoderError('PCM16 output must contain complete samples');
  return Uint8Array.from(binary, char => char.charCodeAt(0));
}

/** A Node-only connection with one receiver and bounded input/output queues. No reconnect or replay. */
export class RealtimeConnection implements AsyncIterable<RealtimeServerEvent> {
  readonly conversationId: string;
  ready!: RealtimeReady;
  request_id: string | null = null;
  private readonly queue: Array<{ event: RealtimeServerEvent; bytes: number }> = [];
  private queueBytes = 0;
  private lastSequence = -1;
  private readonly maxQueuedEvents: number;
  private readonly maxQueueBytes: number;
  private readonly sendTimeout: number;
  private readonly closeTimeout: number;
  private readonly readyPromise: Promise<void>;
  private readyResolve!: () => void;
  private readyReject!: (error: Error) => void;
  private receiver?: { resolve: (result: IteratorResult<RealtimeServerEvent>) => void; reject: (error: Error) => void };
  private terminal?: Error;
  private ended = false;
  private closing = false;
  private sendTail: Promise<void> = Promise.resolve();
  private sendCount = 0;
  private sendBytes = 0;
  private graceful?: Promise<RealtimeClosed>;
  private closeAck?: { requestId: string; resolve: (value: RealtimeClosed) => void; reject: (error: Error) => void };
  private handshakeTimer?: ReturnType<typeof setTimeout>;
  private readyTimer?: ReturnType<typeof setTimeout>;
  private readonly abort: () => void;

  private constructor(private readonly socket: WebSocket, private readonly options: RealtimeConnectOptions) {
    this.conversationId = options.conversationId;
    this.maxQueuedEvents = positive(options.maxQueuedEvents, 256, 'maxQueuedEvents');
    this.maxQueueBytes = positive(options.maxQueueBytes, 4 * 1024 * 1024, 'maxQueueBytes');
    this.sendTimeout = positive(options.sendTimeout, 30000, 'sendTimeout');
    this.closeTimeout = positive(options.closeTimeout, 10000, 'closeTimeout');
    this.readyPromise = new Promise((resolve, reject) => { this.readyResolve = resolve; this.readyReject = reject; });
    void this.readyPromise.catch(() => {});
    this.abort = () => this.fail(new APIUserAbortError('Realtime connection was aborted'));
    options.signal?.addEventListener('abort', this.abort, { once: true });
    socket.on('upgrade', response => { this.request_id = String(response.headers['x-request-id'] ?? response.headers['request-id'] ?? '') || null; });
    socket.on('open', () => {
      clearTimeout(this.handshakeTimer);
      this.readyTimer = setTimeout(() => this.fail(new APIConnectionTimeoutError('Realtime ready timed out')), positive(options.readyTimeout, 60000, 'readyTimeout'));
    });
    socket.on('message', (data: RawData, binary: boolean) => this.onMessage(data, binary));
    socket.on('error', error => this.fail(error.message === 'Opening handshake has timed out'
      ? new APIConnectionTimeoutError('Realtime handshake timed out') : new APIConnectionError('Realtime WebSocket transport failed')));
    socket.on('close', (code, reason) => this.finish(code === 1000 || code === 1001 ? undefined : new RealtimeConnectionClosedError(this.conversationId, code, reason.toString())));
    socket.on('unexpected-response', (_request, response) => {
      let raw = '';
      let bytes = 0;
      response.on('data', chunk => {
        bytes += chunk.length;
        if (bytes > 64 * 1024) { response.destroy(); this.fail(new APIConnectionError('Realtime handshake error body exceeded its limit')); }
        else raw += chunk.toString();
      });
      response.on('error', () => this.fail(new APIConnectionError('Realtime handshake response failed')));
      response.on('end', () => {
        let body: unknown = raw;
        try { body = JSON.parse(raw); } catch { /* Retain bounded gateway text. */ }
        const headers = new Headers();
        for (const [key, value] of Object.entries(response.headers)) if (value !== undefined) headers.set(key, Array.isArray(value) ? value.join(', ') : value);
        this.fail(APIError.generate(response.statusCode ?? 502, body, undefined, headers));
      });
    });
    this.handshakeTimer = setTimeout(() => this.fail(new APIConnectionTimeoutError('Realtime handshake timed out')), positive(options.handshakeTimeout, 30000, 'handshakeTimeout'));
    if (options.signal?.aborted) this.abort();
  }

  /** @internal */
  static async connect(client: APIClient, options: RealtimeConnectOptions): Promise<RealtimeConnection> {
    if (typeof process === 'undefined' || !process.versions?.node) throw new QoderError('Forward Realtime requires Node.js; browsers cannot provide Authorization headers');
    if (typeof options.conversationId !== 'string' || !options.conversationId || options.conversationId.trim() !== options.conversationId || /[\x00-\x1f\x7f]/.test(options.conversationId)) throw new QoderError('conversationId must be nonempty without surrounding whitespace or control characters');
    for (const [key, fallback] of Object.entries({ handshakeTimeout: 30000, readyTimeout: 60000, sendTimeout: 30000, closeTimeout: 10000, maxQueuedEvents: 256, maxQueueBytes: 4 * 1024 * 1024, maxReceiveBytes: 1024 * 1024 })) positive(options[key as keyof typeof options] as number | undefined, fallback, key);
    const handshakeDeadline = Date.now() + (options.handshakeTimeout ?? 30000);
    const preparationController = new AbortController();
    const cancelPreparation = () => preparationController.abort();
    options.signal?.addEventListener('abort', cancelPreparation, { once: true });
    let preparation: Awaited<ReturnType<typeof Promise.all<[ReturnType<APIClient['_prepareRealtimeRequest']>, ReturnType<typeof importWS>]>>>;
    try {
      preparation = await wait(Promise.all([client._prepareRealtimeRequest({ ...options, signal: preparationController.signal }), importWS()]), options.handshakeTimeout ?? 30000, options.signal, 'Realtime authentication');
    } finally { options.signal?.removeEventListener('abort', cancelPreparation); preparationController.abort(); }
    if (options.signal?.aborted) throw new APIUserAbortError('Realtime connection was aborted');
    const [{ url, headers }, module] = preparation;
    const handshakeRemaining = handshakeDeadline - Date.now();
    if (handshakeRemaining <= 0) throw new APIConnectionTimeoutError('Realtime handshake timed out');
    const Socket = module.default;
    const transport = options.transport ?? {};
    const socket = new Socket(url, {
      ...transport as WSOptions,
      headers: Object.fromEntries(headers.entries()),
      followRedirects: false,
      perMessageDeflate: false,
      handshakeTimeout: handshakeRemaining,
      maxPayload: options.maxReceiveBytes ?? 1024 * 1024,
    });
    const connection = new RealtimeConnection(socket, { ...options, handshakeTimeout: handshakeRemaining });
    await connection.readyPromise;
    return connection;
  }

  private onMessage(data: RawData, binary: boolean): void {
    if (this.ended) return;
    try {
      if (binary) throw new RealtimeProtocolError('Realtime expects UTF-8 JSON text frames', this.conversationId);
      const buffer = Array.isArray(data) ? Buffer.concat(data) : data instanceof ArrayBuffer ? Buffer.from(data) : data;
      let value: unknown;
      try { value = JSON.parse(buffer.toString()); } catch { throw new RealtimeProtocolError('Invalid Realtime JSON', this.conversationId); }
      const event = validateEvent(value, this.conversationId);
      if (event.sequence <= this.lastSequence) throw new RealtimeProtocolError('Realtime sequence did not increase', this.conversationId);
      this.lastSequence = event.sequence;
      const size = buffer.byteLength;
      if (this.receiver) { const receiver = this.receiver; this.receiver = undefined; receiver.resolve({ done: false, value: event }); }
      else {
        if (this.queue.length >= this.maxQueuedEvents || this.queueBytes + size > this.maxQueueBytes) throw new RealtimeProtocolError('Realtime receive queue capacity exceeded', this.conversationId, 'queue_overflow');
        this.queue.push({ event, bytes: size }); this.queueBytes += size;
      }
      if (event.type === 'voice.ready' && !this.ready) {
        this.ready = event.payload as unknown as RealtimeReady;
        clearTimeout(this.readyTimer); this.readyResolve();
      }
      if (event.type === 'connection.closed' && event.payload.request_id === this.closeAck?.requestId) this.closeAck?.resolve(event.payload as unknown as RealtimeClosed);
      if (event.type === 'voice.replaced') this.fail(new RealtimeProtocolError('Realtime connection was replaced', this.conversationId, 'voice.replaced'));
      if (event.type === 'error' && (!this.ready || terminalErrors.has(String(event.payload.code)))) this.fail(new RealtimeServerError(event));
    } catch (error) { this.fail(error instanceof Error ? error : new APIConnectionError('Realtime receive failed')); }
  }
  private finish(error?: Error): void {
    if (this.ended) return;
    this.ended = true;
    this.terminal = error;
    clearTimeout(this.handshakeTimer); clearTimeout(this.readyTimer);
    this.options.signal?.removeEventListener('abort', this.abort);
    this.readyReject(error ?? new RealtimeConnectionClosedError(this.conversationId, 1000, 'Closed before ready'));
    this.closeAck?.reject(error ?? new RealtimeConnectionClosedError(this.conversationId, 1000, 'Closed without matching acknowledgement'));
    if (this.receiver) { const receiver = this.receiver; this.receiver = undefined; if (error) receiver.reject(error); else receiver.resolve({ done: true, value: undefined }); }
  }
  private fail(error: Error): void { this.finish(error); this.socket.terminate(); }

  /** Read one event. Concurrent consumers are rejected instead of stealing each other's events. */
  async receive(options: RealtimeWaitOptions = {}): Promise<IteratorResult<RealtimeServerEvent>> {
    if (this.receiver) throw new QoderError('Only one Realtime event consumer is allowed');
    if (options.signal?.aborted) throw new APIUserAbortError('Realtime receive was aborted');
    const queued = this.queue.shift();
    if (queued) { this.queueBytes -= queued.bytes; return { done: false, value: queued.event }; }
    if (this.ended) { if (this.terminal) throw this.terminal; return { done: true, value: undefined }; }
    let receiver!: NonNullable<RealtimeConnection['receiver']>;
    const pending = new Promise<IteratorResult<RealtimeServerEvent>>((resolve, reject) => { this.receiver = receiver = { resolve, reject }; });
    try { return await wait(pending, positive(options.timeout, 2 ** 31 - 1, 'receive timeout'), options.signal, 'Realtime receive'); }
    finally { if (this.receiver === receiver) this.receiver = undefined; }
  }
  async *[Symbol.asyncIterator](): AsyncGenerator<RealtimeServerEvent> {
    for (;;) { const next = await this.receive(); if (next.done) return; yield next.value; }
  }
  /** Serialize sends in call order; no input is automatically replayed. */
  sendEvent(event: RealtimeClientEvent, options: RealtimeWaitOptions = {}): Promise<void> {
    const timeout = positive(options.timeout, this.sendTimeout, 'send timeout');
    if (options.signal?.aborted) return Promise.reject(new APIUserAbortError('Realtime send was aborted'));
    if (!event || event.version !== REALTIME_VERSION || typeof event.type !== 'string' || !event.type || !isObject(event.payload)) throw new QoderError('Client events require version, type and object payload');
    if (this.ended || this.socket.readyState !== 1) throw this.terminal ?? new QoderError('Realtime connection is closed');
    if (this.closing && !['connection.close', 'ping'].includes(event.type)) throw new QoderError('Realtime connection is closing');
    if (event.type === 'text.message' && (typeof event.payload.text !== 'string' || !event.payload.text.trim() || new TextEncoder().encode(event.payload.text.trim()).length > 16 * 1024)) throw new QoderError('Realtime text must be nonempty and at most 16 KiB UTF-8');
    if (event.type === 'audio.append' && (typeof event.payload.audio !== 'string' || !event.payload.audio || !base64.test(event.payload.audio) || globalThis.atob(event.payload.audio).length % 2)) throw new QoderError('Audio append requires nonempty Base64 PCM16');
    if (event.type === 'connection.close') {
      const id = event.payload.request_id;
      if (typeof id !== 'string' || !id || id.trim() !== id || Buffer.byteLength(id) > 128 || /[\x00-\x1f\x7f]/.test(id)) throw new QoderError('Invalid connection.close request_id');
    }
    const json = JSON.stringify(event);
    const bytes = Buffer.byteLength(json);
    if (bytes > CLIENT_MESSAGE_BYTES) throw new QoderError('Realtime client JSON message exceeds 256 KiB');
    if (this.sendCount >= this.maxQueuedEvents || this.sendBytes + bytes > this.maxQueueBytes) throw new QoderError('Realtime send queue capacity exceeded');
    this.sendCount++; this.sendBytes += bytes;
    const result = this.sendTail.then(async () => {
      if (this.ended) throw this.terminal ?? new QoderError('Realtime connection is closed');
      if (options.signal?.aborted) throw new APIUserAbortError('Realtime send was aborted');
      const written = new Promise<void>((resolve, reject) => this.socket.send(json, { binary: false }, error => error ? reject(new APIConnectionError('Realtime send failed')) : resolve()));
      try { await wait(written, timeout, options.signal, 'Realtime send'); }
      catch (error) { this.fail(error as Error); throw error; }
    }).finally(() => { this.sendCount--; this.sendBytes -= bytes; });
    this.sendTail = result.catch(() => {});
    const deadline = wait(result, timeout, options.signal, 'Realtime send');
    return deadline.catch(error => { this.fail(error); throw error; });
  }
  sendText(text: string, options?: RealtimeWaitOptions): Promise<void> {
    if (typeof text !== 'string' || !text.trim() || new TextEncoder().encode(text.trim()).length > 16 * 1024) throw new QoderError('Realtime text must be nonempty and at most 16 KiB UTF-8');
    return this.sendEvent({ version: REALTIME_VERSION, type: 'text.message', payload: { text: text.trim() } }, options);
  }
  appendAudio(pcm: Uint8Array, options?: RealtimeWaitOptions): Promise<void> {
    if (!(pcm instanceof Uint8Array) || !pcm.byteLength || pcm.byteLength % 2) throw new QoderError('Audio must contain nonempty, complete PCM16 samples');
    if (pcm.byteLength > CLIENT_MESSAGE_BYTES * 3 / 4) throw new QoderError('Realtime client JSON message exceeds 256 KiB');
    return this.sendEvent({ version: REALTIME_VERSION, type: 'audio.append', payload: { audio: Buffer.from(pcm.buffer, pcm.byteOffset, pcm.byteLength).toString('base64') } }, options);
  }
  interrupt(options?: RealtimeWaitOptions): Promise<void> { return this.sendEvent({ version: REALTIME_VERSION, type: 'interrupt', payload: {} }, options); }
  ping(options?: RealtimeWaitOptions): Promise<void> { return this.sendEvent({ version: REALTIME_VERSION, type: 'ping', payload: {} }, options); }
  playbackStarted(receipt: RealtimePlaybackReceipt = {}, options?: RealtimeWaitOptions): Promise<void> { return this.playback('playback.started', receipt, options); }
  playbackEnded(receipt: RealtimePlaybackReceipt = {}, options?: RealtimeWaitOptions): Promise<void> { return this.playback('playback.ended', receipt, options); }
  playbackCancelled(receipt: RealtimePlaybackReceipt = {}, options?: RealtimeWaitOptions): Promise<void> { return this.playback('playback.cancelled', receipt, options); }
  private playback(type: string, receipt: RealtimePlaybackReceipt, options?: RealtimeWaitOptions): Promise<void> {
    for (const value of Object.values(receipt)) if (typeof value !== 'string' || !value) throw new QoderError('Playback identifiers must be nonempty strings');
    return this.sendEvent({ version: REALTIME_VERSION, type, payload: { ...receipt } }, options);
  }
  /** Send connection.close, require its matching persistence acknowledgement, then release transport. */
  closeGracefully(options: RealtimeCloseOptions = {}): Promise<RealtimeClosed> {
    if (this.graceful) return this.graceful;
    if (this.ended) return Promise.reject(this.terminal ?? new QoderError('Realtime connection is closed'));
    if (!this.ready.capabilities.graceful_close) return Promise.reject(new QoderError('Server does not support graceful close'));
    const requestId = options.requestId ?? globalThis.crypto.randomUUID();
    if (!requestId || requestId.trim() !== requestId || Buffer.byteLength(requestId) > 128 || /[\x00-\x1f\x7f]/.test(requestId)) throw new QoderError('Close requestId must be 1–128 UTF-8 bytes without surrounding whitespace or control characters');
    const timeout = positive(options.timeout, this.closeTimeout, 'close timeout');
    if (options.signal?.aborted) return Promise.reject(new APIUserAbortError('Realtime graceful close was aborted'));
    this.closing = true;
    const acknowledgement = new Promise<RealtimeClosed>((resolve, reject) => { this.closeAck = { requestId, resolve, reject }; });
    void acknowledgement.catch(() => {});
    this.graceful = (async () => {
      try {
        const confirmed = wait(acknowledgement, timeout, options.signal, 'Realtime graceful close');
        void confirmed.catch(() => {});
        await this.sendEvent({ version: REALTIME_VERSION, type: 'connection.close', payload: { request_id: requestId } }, options);
        return await confirmed;
      } finally { this.close(); }
    })();
    return this.graceful;
  }
  /** Transport close does not promise history persistence or cancel background Work. */
  close(): void {
    this.finish();
    if (this.socket.readyState === 1) {
      this.socket.close(1000);
      const timer = setTimeout(() => this.socket.terminate(), 1000);
      timer.unref();
      this.socket.once('close', () => clearTimeout(timer));
    } else this.socket.terminate();
  }
}
