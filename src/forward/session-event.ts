// Generated code, verified against the API contracts.
import { APIResource } from '../core/resource.js';
import type { RequestOptions } from '../core/client.js';
import type { APIPromise } from '../core/api-promise.js';
import type { PagePromise } from '../core/pagination.js';
import type { Stream } from '../core/streaming.js';
import { pathParam, requestHeaders } from './_utils.js';
import type { SessionEvent, SessionEventListParams, SessionEventSendParams, SessionEventSendResponse, SessionEventStreamParams } from './types.js';

export class SessionEvents extends APIResource {
  /**
   * 列出 Session Events.
   *
   * @operation listSessionEvents
   */
  list(
    sessionID: string,
    params: SessionEventListParams = {},
    options?: RequestOptions,
  ): PagePromise<SessionEvent> {
    const path = `sessions/${pathParam(sessionID, "session_id")}/events`;
    return this._client.getAPIList<SessionEvent>(path, params, options, "cursor");
  }

  /**
   * 发送 Session Events.
   *
   * @operation sendSessionEvents
   */
  send(
    sessionID: string,
    params: SessionEventSendParams,
    options?: RequestOptions,
  ): APIPromise<SessionEventSendResponse> {
    const path = `sessions/${pathParam(sessionID, "session_id")}/events`;
    const { idempotency_key, ...payload } = params;
    return this._client.request<SessionEventSendResponse>({
      method: "POST",
      path,
      body: payload,
      ...options,
      headers: requestHeaders({ "Idempotency-Key": idempotency_key }, options?.headers),
    });
  }

  /**
   * 订阅 Session Event Stream.
   *
   * @operation streamSessionEvents
   */
  streamEvents(
    sessionID: string,
    params: SessionEventStreamParams = {},
    options?: RequestOptions,
  ): APIPromise<Stream<SessionEvent>> {
    const path = `sessions/${pathParam(sessionID, "session_id")}/events/stream`;
    const { last_event_id, ...payload } = params;
    return this._client.request<Stream<SessionEvent>>({
      method: "GET",
      path,
      query: payload,
      responseType: "stream",
      ...options,
      headers: requestHeaders({ 'Accept': 'text/event-stream', "Last-Event-ID": last_event_id }, options?.headers),
    });
  }

}

export type { SessionEvent, SessionEventListParams, SessionEventSendParams, SessionEventSendResponse, SessionEventStreamParams } from './types.js';
