// Generated from the Go SDK and verified against its API contracts.
import { APIResource } from '../core/resource.js';
import type { RequestOptions } from '../core/client.js';
import type { APIPromise } from '../core/api-promise.js';
import type { PagePromise } from '../core/pagination.js';
import { pathParam, requestHeaders } from './_utils.js';
import type { Session, SessionArchiveParams, SessionCancelParams, SessionCreateParams, SessionListParams, SessionUpdateParams } from './types.js';
import { SessionEvents } from './session-event.js';
import { SessionResources } from './session-resource.js';
import { SessionThreads } from './session-thread.js';

export class Sessions extends APIResource {
  readonly events: SessionEvents = new SessionEvents(this._client);
  readonly resources: SessionResources = new SessionResources(this._client);
  readonly threads: SessionThreads = new SessionThreads(this._client);

  /**
   * 列出 Sessions.
   *
   * @see Go SessionService.List
   * @operation listSessions
   */
  list(params: SessionListParams = {}, options?: RequestOptions): PagePromise<Session> {
    const path = "sessions";
    return this._client.getAPIList<Session>(path, params, options, "cursor");
  }

  /**
   * 创建 Session.
   *
   * @see Go SessionService.New
   * @operation createSession
   */
  create(params: SessionCreateParams, options?: RequestOptions): APIPromise<Session> {
    const path = "sessions";
    const { idempotency_key, ...payload } = params;
    return this._client.request<Session>({
      method: "POST",
      path,
      body: payload,
      ...options,
      headers: requestHeaders({ "Idempotency-Key": idempotency_key }, options?.headers),
    });
  }

  /**
   * 获取 Session.
   *
   * @see Go SessionService.Get
   * @operation getSession
   */
  retrieve(sessionID: string, options?: RequestOptions): APIPromise<Session> {
    const path = `sessions/${pathParam(sessionID, "session_id")}`;
    return this._client.request<Session>({
      method: "GET",
      path,
      ...options,
    });
  }

  /**
   * 更新 Session.
   *
   * @see Go SessionService.Update
   * @operation updateSession
   */
  update(sessionID: string, params: SessionUpdateParams = {}, options?: RequestOptions): APIPromise<Session> {
    const path = `sessions/${pathParam(sessionID, "session_id")}`;
    const { idempotency_key, ...payload } = params;
    return this._client.request<Session>({
      method: "POST",
      path,
      body: payload,
      ...options,
      headers: requestHeaders({ "Idempotency-Key": idempotency_key }, options?.headers),
    });
  }

  /**
   * 归档 Session.
   *
   * @see Go SessionService.Archive
   * @operation archiveSession
   */
  archive(
    sessionID: string,
    params: SessionArchiveParams = {},
    options?: RequestOptions,
  ): APIPromise<Session> {
    const path = `sessions/${pathParam(sessionID, "session_id")}/archive`;
    const { idempotency_key, ...payload } = params;
    return this._client.request<Session>({
      method: "POST",
      path,
      ...options,
      headers: requestHeaders({ "Idempotency-Key": idempotency_key }, options?.headers),
    });
  }

  /**
   * 取消当前 Turn.
   *
   * @see Go SessionService.Cancel
   * @operation cancelSession
   */
  cancel(sessionID: string, params: SessionCancelParams = {}, options?: RequestOptions): APIPromise<Session> {
    const path = `sessions/${pathParam(sessionID, "session_id")}/cancel`;
    const { idempotency_key, ...payload } = params;
    return this._client.request<Session>({
      method: "POST",
      path,
      ...options,
      headers: requestHeaders({ "Idempotency-Key": idempotency_key }, options?.headers),
    });
  }

}

export type { Session, SessionArchiveParams, SessionCancelParams, SessionCreateParams, SessionListParams, SessionUpdateParams } from './types.js';
