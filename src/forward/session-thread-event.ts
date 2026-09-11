// Generated from the Go SDK and verified against its API contracts.
import { APIResource } from '../core/resource.js';
import type { RequestOptions } from '../core/client.js';
import type { APIPromise } from '../core/api-promise.js';
import type { PagePromise } from '../core/pagination.js';
import type { Stream } from '../core/streaming.js';
import { pathParam, requestHeaders } from './_utils.js';
import type { SessionEvent, SessionThreadEventListParams, SessionThreadEventStreamParams } from './types.js';

export class SessionThreadEvents extends APIResource {
  /**
   * 列出 Session Thread Events.
   *
   * @see Go SessionThreadEventService.List
   * @operation listSessionThreadEvents
   */
  list(
    sessionID: string,
    threadID: string,
    params: SessionThreadEventListParams = {},
    options?: RequestOptions,
  ): PagePromise<SessionEvent> {
    const path = `sessions/${pathParam(sessionID, "session_id")}/threads/${pathParam(threadID, "thread_id")}/events`;
    return this._client.getAPIList<SessionEvent>(path, params, options, "cursor");
  }

  /**
   * 订阅 Session Thread Event Stream.
   *
   * @see Go SessionThreadEventService.StreamEvents
   * @operation streamSessionThreadEvents
   */
  streamEvents(
    sessionID: string,
    threadID: string,
    params: SessionThreadEventStreamParams = {},
    options?: RequestOptions,
  ): APIPromise<Stream<SessionEvent>> {
    const path = `sessions/${pathParam(sessionID, "session_id")}/threads/${pathParam(threadID, "thread_id")}/stream`;
    const { last_event_id, ...payload } = params;
    return this._client.request<Stream<SessionEvent>>({
      method: "GET",
      path,
      responseType: "stream",
      ...options,
      headers: requestHeaders({ 'Accept': 'text/event-stream', "Last-Event-ID": last_event_id }, options?.headers),
    });
  }

}

export type { SessionEvent, SessionThreadEventListParams, SessionThreadEventStreamParams } from './types.js';
