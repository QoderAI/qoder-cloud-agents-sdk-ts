// Generated from qoder-cloud-agents-sdk-go/managed.
import { APIResource } from '../../core/resource.js';
import type { RequestOptions } from '../../core/client.js';
import type { APIPromise } from '../../core/api-promise.js';
import type { PagePromise } from '../../core/pagination.js';
import type { Stream } from '../../core/streaming.js';
import type * as Types from '../types.js';
import { splitParams, pathParam, managedMultipart } from '../internal.js';
import { SessionsThreadsEvents } from "./session-thread-event.js";

export class SessionsThreads extends APIResource {
  readonly events = new SessionsThreadsEvents(this._client);

  /**
   * Get Session Thread
   */
  retrieve(threadID: string, params: Types.SessionThreadRetrieveParams, options?: RequestOptions): APIPromise<Types.ManagedAgentsSessionThread> {
    const request = splitParams(params, options, {"workspace_id": "qoder-workspace-id", "betas": "x-qoder-beta"}, ["session_id"]);
    return this._client.request<Types.ManagedAgentsSessionThread>({ ...request.options, method: "GET", path: `/sessions/${pathParam(params?.session_id, "session_id")}/threads/${pathParam(threadID, "thread_id")}` });
  }

  /**
   * List Session Threads
   */
  list(sessionID: string, params: Types.SessionThreadListParams | null | undefined = {}, options?: RequestOptions): PagePromise<Types.ManagedAgentsSessionThread> {
    const request = splitParams(params, options, {"workspace_id": "qoder-workspace-id", "betas": "x-qoder-beta"}, []);
    return this._client.getAPIList<Types.ManagedAgentsSessionThread>(`/sessions/${pathParam(sessionID, "session_id")}/threads`, request.values, request.options, 'page');
  }

  /**
   * Archive Session Thread
   */
  archive(threadID: string, params: Types.SessionThreadArchiveParams, options?: RequestOptions): APIPromise<Types.ManagedAgentsSessionThread> {
    const request = splitParams(params, options, {"workspace_id": "qoder-workspace-id", "betas": "x-qoder-beta"}, ["session_id"]);
    return this._client.request<Types.ManagedAgentsSessionThread>({ ...request.options, method: "POST", path: `/sessions/${pathParam(params?.session_id, "session_id")}/threads/${pathParam(threadID, "thread_id")}/archive` });
  }
}

export default SessionsThreads;
export type { ManagedAgentsSessionThread, ManagedAgentsSessionThreadAgentUnion, ManagedAgentsSessionThreadAgentUnionModel, ManagedAgentsSessionThreadType, ManagedAgentsSessionThreadStats, ManagedAgentsSessionThreadStatus, ManagedAgentsSessionThreadUsage, ManagedAgentsStreamSessionThreadEventsUnion, ManagedAgentsStreamSessionThreadEventsUnionContent, ManagedAgentsStreamSessionThreadEventsUnionStopReason, ManagedAgentsStreamSessionThreadEventsUnionUsage, SessionThreadGetParams, SessionThreadListParams, SessionThreadArchiveParams } from '../types.js';
