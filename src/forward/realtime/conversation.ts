import { APIResource } from '../../core/resource.js';
import { APIPromise } from '../../core/api-promise.js';
import type { APIClient, RequestOptions } from '../../core/client.js';
import { QoderError } from '../../core/error.js';
import { pathParam, requestHeaders } from '../_utils.js';
import type { RealtimeConversation, RealtimeConversationCreateParams, RealtimeHistoryEvent, RealtimeHistoryParams, RealtimeHistoryResponse } from './types.js';

/** History uses before cursors and events, independently of ordinary list pages. */
export class RealtimeHistoryPage implements RealtimeHistoryResponse, AsyncIterable<RealtimeHistoryEvent> {
  readonly conversation: RealtimeHistoryResponse['conversation'];
  readonly events: RealtimeHistoryEvent[];
  readonly page: RealtimeHistoryResponse['page'];
  readonly _request_id: string | null;
  [key: string]: unknown;
  constructor(private readonly client: APIClient, private readonly conversationID: string,
    private readonly params: RealtimeHistoryParams, private readonly options: RequestOptions,
    private readonly data: RealtimeHistoryResponse, readonly response: Response) {
    for (const [key, value] of Object.entries(data)) if (!(key in this)) Object.defineProperty(this, key, { value, enumerable: true });
    this.conversation = data.conversation;
    this.events = data.events;
    this.page = data.page;
    this._request_id = response.headers.get('x-request-id') ?? response.headers.get('request-id');
  }
  hasNextPage(): boolean { return this.page.has_more && !!this.page.next_before; }
  getNextPage(): APIPromise<RealtimeHistoryPage> {
    if (!this.hasNextPage()) throw new QoderError('No next history page; check hasNextPage() first');
    if (this.page.next_before === this.params.before) throw new QoderError('History cursor did not advance');
    return new RealtimeConversations(this.client).history(this.conversationID, { ...this.params, before: this.page.next_before! }, this.options);
  }
  async *iterPages(): AsyncGenerator<RealtimeHistoryPage> {
    let current: RealtimeHistoryPage = this;
    const seen = new Set<string>();
    if (this.params.before) seen.add(this.params.before);
    for (;;) {
      yield current;
      if (!current.hasNextPage()) return;
      const cursor = current.page.next_before!;
      if (seen.has(cursor)) throw new QoderError('History cursor did not advance');
      seen.add(cursor);
      current = await current.getNextPage();
    }
  }
  async *[Symbol.asyncIterator](): AsyncGenerator<RealtimeHistoryEvent> {
    for await (const page of this.iterPages()) yield* page.events;
  }
  toJSON(): RealtimeHistoryResponse { return this.data; }
}

export class RealtimeConversations extends APIResource {
  /** Create a Beta Realtime Conversation; use a stable key for this operation. */
  create(params: RealtimeConversationCreateParams, options: RequestOptions = {}): APIPromise<RealtimeConversation> {
    const { idempotency_key, ...body } = params;
    const headers = requestHeaders({ 'Idempotency-Key': idempotency_key }, options.headers);
    const key = options.idempotencyKey ?? headers['idempotency-key'];
    if (typeof key !== 'string' || !key || key.trim() !== key || new TextEncoder().encode(key).length > 256 || /[\x00-\x1f\x7f]/.test(key)) {
      throw new QoderError('Idempotency-Key must be 1–256 UTF-8 bytes without surrounding whitespace or control characters');
    }
    return this._client.request<RealtimeConversation>({ method: 'POST', path: 'realtime/conversations', body, ...options, headers });
  }
  /** Query persisted history, newest first; next_before retrieves older records. */
  history(conversationID: string, params: RealtimeHistoryParams = {}, options: RequestOptions = {}): APIPromise<RealtimeHistoryPage> {
    const query = { ...params, ...options.query };
    if (query.limit !== undefined && (!Number.isInteger(query.limit) || query.limit < 1 || query.limit > 100)) throw new QoderError('History limit must be an integer from 1 to 100');
    if (query.before !== undefined && (typeof query.before !== 'string' || !query.before)) throw new QoderError('History before must be nonempty');
    if (query.types !== undefined && !['message', 'work', 'message,work'].includes(query.types)) throw new QoderError('History types must be message, work, or message,work');
    const request = this._client.request<RealtimeHistoryResponse>({ method: 'GET', path: `realtime/conversations/${pathParam(conversationID, 'conversation_id')}/history`, ...options, query });
    return new APIPromise(request.asResponse(), async response => {
      const data = (await request.withResponse()).data;
      if (!data || !Array.isArray(data.events) || !data.conversation || !data.page || typeof data.page.has_more !== 'boolean'
        || !(data.page.next_before === null || typeof data.page.next_before === 'string') || (data.page.has_more && !data.page.next_before)) throw new QoderError('Invalid Realtime history response');
      return new RealtimeHistoryPage(this._client, conversationID, query, { ...options, query: undefined }, data, response);
    });
  }
}
