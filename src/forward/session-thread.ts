// Generated from the Go SDK and verified against its API contracts.
import { APIResource } from '../core/resource.js';
import type { RequestOptions } from '../core/client.js';
import type { APIPromise } from '../core/api-promise.js';
import type { PagePromise } from '../core/pagination.js';
import { pathParam, requestHeaders } from './_utils.js';
import type { SessionThread, SessionThreadArchiveParams, SessionThreadListParams } from './types.js';
import { SessionThreadEvents } from './session-thread-event.js';

export class SessionThreads extends APIResource {
  readonly events: SessionThreadEvents = new SessionThreadEvents(this._client);

  /**
   * 列出 Session Threads.
   *
   * @see Go SessionThreadService.List
   * @operation listSessionThreads
   */
  list(
    sessionID: string,
    params: SessionThreadListParams = {},
    options?: RequestOptions,
  ): PagePromise<SessionThread> {
    const path = `sessions/${pathParam(sessionID, "session_id")}/threads`;
    return this._client.getAPIList<SessionThread>(path, params, options, "cursor");
  }

  /**
   * 获取 Session Thread.
   *
   * @see Go SessionThreadService.Get
   * @operation getSessionThread
   */
  retrieve(sessionID: string, threadID: string, options?: RequestOptions): APIPromise<SessionThread> {
    const path = `sessions/${pathParam(sessionID, "session_id")}/threads/${pathParam(threadID, "thread_id")}`;
    return this._client.request<SessionThread>({
      method: "GET",
      path,
      ...options,
    });
  }

  /**
   * 归档 Session Thread.
   *
   * @see Go SessionThreadService.Archive
   * @operation archiveSessionThread
   */
  archive(
    sessionID: string,
    threadID: string,
    params: SessionThreadArchiveParams = {},
    options?: RequestOptions,
  ): APIPromise<SessionThread> {
    const path = `sessions/${pathParam(sessionID, "session_id")}/threads/${pathParam(threadID, "thread_id")}/archive`;
    const { idempotency_key, ...payload } = params;
    return this._client.request<SessionThread>({
      method: "POST",
      path,
      ...options,
      headers: requestHeaders({ "Idempotency-Key": idempotency_key }, options?.headers),
    });
  }

}

export type { SessionThread, SessionThreadArchiveParams, SessionThreadListParams } from './types.js';
