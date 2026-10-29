// Generated code, verified against the API contracts.
import { APIResource } from '../../core/resource.js';
import type { RequestOptions } from '../../core/client.js';
import type { APIPromise } from '../../core/api-promise.js';
import type { PagePromise } from '../../core/pagination.js';
import { initialLastEventID, resumableRequestHeaders, ResumableSessionEventStream, isTerminalThreadEvent } from '../../core/resumable-session-event-stream.js';
import type { Stream } from '../../core/streaming.js';
import type * as Types from '../types.js';
import { splitParams, pathParam, managedMultipart } from '../internal.js';

export class SessionsThreadsEvents extends APIResource {

  /**
   * List Session Thread Events
   */
  list(threadID: string, params: Types.SessionThreadEventListParams, options?: RequestOptions): PagePromise<Types.ManagedAgentsSessionEventUnion> {
    const request = splitParams(params, options, {"workspace_id": "qoder-workspace-id", "betas": "x-qoder-beta"}, ["session_id"]);
    return this._client.getAPIList<Types.ManagedAgentsSessionEventUnion>(`/sessions/${pathParam(params?.session_id, "session_id")}/threads/${pathParam(threadID, "thread_id")}/events`, request.values, request.options, 'page');
  }

  /**
   * Stream Session Thread Events
   */
  streamEvents(threadID: string, params: Types.SessionThreadEventStreamParams, options?: RequestOptions): APIPromise<Stream<Types.ManagedAgentsStreamSessionThreadEventsUnion>> {
    const request = splitParams(params, options, {"workspace_id": "qoder-workspace-id", "betas": "x-qoder-beta", "last_event_id": "Last-Event-ID"}, ["session_id"]);
    if (!request.headers.has('Accept')) request.headers.set('Accept', 'text/event-stream');
    return this._client.request<Stream<Types.ManagedAgentsStreamSessionThreadEventsUnion>>({ ...request.options, method: "GET", path: `/sessions/${pathParam(params?.session_id, "session_id")}/threads/${pathParam(threadID, "thread_id")}/stream`, query: request.values, responseType: 'stream' });
  }

  /** Reconnect the thread stream from the last received SSE cursor. */
  resumableStream(
    threadID: string,
    params: Types.SessionThreadEventStreamParams,
    options?: RequestOptions,
  ): ResumableSessionEventStream<Types.ManagedAgentsStreamSessionThreadEventsUnion> {
    pathParam(params?.session_id, "session_id");
    pathParam(threadID, "thread_id");
    const values = { ...params, betas: params.betas?.slice(), event_deltas: params.event_deltas?.slice() };
    const initialCursor = initialLastEventID(values.last_event_id, this._client.defaultHeaders, options?.headers);
    const requestOptions = { ...options, headers: resumableRequestHeaders(options?.headers, initialCursor) };
    return new ResumableSessionEventStream<Types.ManagedAgentsStreamSessionThreadEventsUnion>(
      (lastEventID, signal) => this.streamEvents(
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

export default SessionsThreadsEvents;
export type { SessionThreadEventListParams, SessionThreadEventStreamParams } from '../types.js';
