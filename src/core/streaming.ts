import { APIError, APIUserAbortError, APIConnectionTimeoutError, QoderError } from './error.js';

export interface ServerSentEvent {
  event: string;
  data: string;
  id: string;
  retry?: number;
}

/** Incremental SSE decoding: IDs identify events, not individual delta frames. */
export async function* decodeSSE(body: ReadableStream<Uint8Array>): AsyncGenerator<ServerSentEvent> {
  const reader = body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';
  let lastID = '';
  let type = 'message';
  let data: string[] = [];
  let retry: number | undefined;
  let done = false;
  const line = (text: string): ServerSentEvent | undefined => {
    if (new TextEncoder().encode(text).byteLength > 32 * 1024 * 1024) throw new QoderError('SSE line exceeds 32 MiB');
    if (!text) {
      const event = data.length ? { event: type, data: data.join('\n'), id: lastID, retry } : undefined;
      type = 'message'; data = []; retry = undefined;
      return event;
    }
    if (text.startsWith(':')) return;
    const colon = text.indexOf(':');
    const key = colon === -1 ? text : text.slice(0, colon);
    let value = colon === -1 ? '' : text.slice(colon + 1);
    if (value.startsWith(' ')) value = value.slice(1);
    if (key === 'event') type = value;
    if (key === 'data') data.push(value);
    if (key === 'id' && !value.includes('\0')) lastID = value;
    if (key === 'retry' && /^\d+$/.test(value)) retry = Number(value);
  };
  try {
    while (!done) {
      const chunk = await reader.read();
      done = chunk.done;
      buffer += chunk.done ? decoder.decode() : decoder.decode(chunk.value, { stream: true });
      let start = 0;
      for (let i = 0; i < buffer.length; i++) {
        const char = buffer[i];
        if (char !== '\r' && char !== '\n') continue;
        if (char === '\r' && i === buffer.length - 1 && !done) break;
        const event = line(buffer.slice(start, i));
        if (char === '\r' && buffer[i + 1] === '\n') i++;
        start = i + 1;
        if (event) yield event;
      }
      buffer = buffer.slice(start);
      if (buffer.length > 32 * 1024 * 1024) throw new QoderError('SSE line exceeds 32 MiB');
    }
    if (buffer) { const event = line(buffer); if (event) yield event; }
    const event = line('');
    if (event) yield event;
  } finally {
    if (!done) await reader.cancel().catch(() => {});
    reader.releaseLock();
  }
}

export class Stream<T> implements AsyncIterable<T> {
  readonly controller: AbortController;
  lastEventID = '';
  private consumed = false;
  private closed = false;

  constructor(readonly response: Response, controller = new AbortController()) {
    this.controller = controller;
  }

  static fromSSEResponse<T>(response: Response, controller = new AbortController()): Stream<T> {
    return new Stream<T>(response, controller);
  }

  async close(): Promise<void> {
    if (this.closed) return;
    this.closed = true;
    this.controller.abort();
    if (this.response.body && !this.response.body.locked) await this.response.body.cancel().catch(() => {});
  }

  async *[Symbol.asyncIterator](): AsyncGenerator<T> {
    if (this.consumed) throw new QoderError('Cannot iterate over a consumed stream');
    this.consumed = true;
    if (this.closed) return;
    if (!this.response.body) throw new QoderError('Missing SSE response body');
    try {
      for await (const frame of decodeSSE(this.response.body)) {
        this.lastEventID = frame.id;
        if (this.closed) return;
        if (frame.event === 'ping' || !frame.data) continue;
        if (frame.data === '[DONE]') return;
        const data: unknown = JSON.parse(frame.data);
        if (frame.event === 'error') {
          throw APIError.generate(this.response.status, data, undefined, this.response.headers, this.response);
        }
        yield data as T;
      }
    } catch (error) {
      if (this.closed) return;
      if (error instanceof APIConnectionTimeoutError) throw error;
      if (this.controller.signal.aborted) throw new APIUserAbortError('Request was aborted', { cause: error });
      throw error;
    } finally { await this.close(); }
  }
}
