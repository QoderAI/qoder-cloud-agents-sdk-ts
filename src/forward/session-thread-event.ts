// Generated code, verified against the API contracts.
import { APIResource } from '../core/resource.js';
import type { RequestOptions } from '../core/client.js';
import type { APIPromise } from '../core/api-promise.js';
import type { PagePromise } from '../core/pagination.js';
import { initialLastEventID, resumableRequestHeaders, ResumableSessionEventStream, isTerminalThreadEvent } from '../core/resumable-session-event-stream.js';
import type { Stream } from '../core/streaming.js';
import { pathParam, requestHeaders } from './_utils.js';
import type { SessionEvent, SessionThreadEventListParams, SessionThreadEventStreamParams } from './types.js';

export class SessionThreadEvents extends APIResource {
  /**
   * 列出 Session Thread Events.
   *
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

  /** Reconnect the thread stream from the last received SSE cursor. */
  resumableStream(
    sessionID: string,
    threadID: string,
    params: SessionThreadEventStreamParams = {},
    options?: RequestOptions,
  ): ResumableSessionEventStream<SessionEvent> {
    pathParam(sessionID, "session_id");
    pathParam(threadID, "thread_id");
    const values = { ...params };
    const initialCursor = initialLastEventID(values.last_event_id, this._client.defaultHeaders, options?.headers);
    const requestOptions = { ...options, headers: resumableRequestHeaders(options?.headers, initialCursor) };
    return new ResumableSessionEventStream<SessionEvent>(
      (lastEventID, signal) => this.streamEvents(
        sessionID,
        threadID,
        { ...values, last_event_id: lastEventID },
        { ...requestOptions, signal, headers: resumableRequestHeaders(requestOptions.headers, lastEventID) },
      ),
      initialCursor,
      options?.signal,
      isTerminalThreadEvent,
    );
  }
}

export type { SessionEvent, SessionThreadEventListParams, SessionThreadEventStreamParams } from './types.js';
