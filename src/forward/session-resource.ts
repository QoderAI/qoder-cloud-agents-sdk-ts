// Generated from the Go SDK and verified against its API contracts.
import { APIResource } from '../core/resource.js';
import type { RequestOptions } from '../core/client.js';
import type { APIPromise } from '../core/api-promise.js';
import { pathParam, requestHeaders } from './_utils.js';
import type { SessionResource, SessionResourceAddParams } from './types.js';

export class SessionResources extends APIResource {
  /**
   * 添加 Session 资源.
   *
   * @see Go SessionResourceService.Add
   * @operation addSessionResource
   */
  add(
    sessionID: string,
    params: SessionResourceAddParams,
    options?: RequestOptions,
  ): APIPromise<SessionResource> {
    const path = `sessions/${pathParam(sessionID, "session_id")}/resources`;
    return this._client.request<SessionResource>({
      method: "POST",
      path,
      body: params,
      ...options,
    });
  }

}

export type { SessionResource, SessionResourceAddParams } from './types.js';
