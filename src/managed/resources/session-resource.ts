// Generated code, verified against the API contracts.
import { APIResource } from '../../core/resource.js';
import type { RequestOptions } from '../../core/client.js';
import type { APIPromise } from '../../core/api-promise.js';
import type { PagePromise } from '../../core/pagination.js';
import type { Stream } from '../../core/streaming.js';
import type * as Types from '../types.js';
import { splitParams, pathParam, managedMultipart } from '../internal.js';

export class SessionsResources extends APIResource {

  /**
   * Get Session Resource
   */
  retrieve(resourceID: string, params: Types.SessionResourceRetrieveParams, options?: RequestOptions): APIPromise<Types.SessionResourceGetResponseUnion> {
    const request = splitParams(params, options, {"workspace_id": "qoder-workspace-id", "betas": "x-qoder-beta"}, ["session_id"]);
    return this._client.request<Types.SessionResourceGetResponseUnion>({ ...request.options, method: "GET", path: `/sessions/${pathParam(params?.session_id, "session_id")}/resources/${pathParam(resourceID, "resource_id")}` });
  }

  /**
   * Update Session Resource
   */
  update(resourceID: string, params: Types.SessionResourceUpdateParams, options?: RequestOptions): APIPromise<Types.SessionResourceUpdateResponseUnion> {
    const request = splitParams(params, options, {"workspace_id": "qoder-workspace-id", "betas": "x-qoder-beta"}, ["session_id"]);
    return this._client.request<Types.SessionResourceUpdateResponseUnion>({ ...request.options, method: "POST", path: `/sessions/${pathParam(params?.session_id, "session_id")}/resources/${pathParam(resourceID, "resource_id")}`, body: request.values });
  }

  /**
   * List Session Resources
   */
  list(sessionID: string, params: Types.SessionResourceListParams | null | undefined = {}, options?: RequestOptions): PagePromise<Types.ManagedAgentsSessionResourceUnion> {
    const request = splitParams(params, options, {"workspace_id": "qoder-workspace-id", "betas": "x-qoder-beta"}, []);
    return this._client.getAPIList<Types.ManagedAgentsSessionResourceUnion>(`/sessions/${pathParam(sessionID, "session_id")}/resources`, request.values, request.options, 'page');
  }

  /**
   * Delete Session Resource
   */
  delete(resourceID: string, params: Types.SessionResourceDeleteParams, options?: RequestOptions): APIPromise<Types.ManagedAgentsDeleteSessionResource> {
    const request = splitParams(params, options, {"workspace_id": "qoder-workspace-id", "betas": "x-qoder-beta"}, ["session_id"]);
    return this._client.request<Types.ManagedAgentsDeleteSessionResource>({ ...request.options, method: "DELETE", path: `/sessions/${pathParam(params?.session_id, "session_id")}/resources/${pathParam(resourceID, "resource_id")}` });
  }

  /**
   * Add Session Resource
   */
  add(sessionID: string, params: Types.SessionResourceAddParams, options?: RequestOptions): APIPromise<Types.ManagedAgentsFileResource> {
    const request = splitParams(params, options, {"workspace_id": "qoder-workspace-id", "betas": "x-qoder-beta"}, []);
    return this._client.request<Types.ManagedAgentsFileResource>({ ...request.options, method: "POST", path: `/sessions/${pathParam(sessionID, "session_id")}/resources`, body: request.values });
  }
}

export default SessionsResources;
export type { ManagedAgentsDeleteSessionResource, ManagedAgentsDeleteSessionResourceType, ManagedAgentsFileResource, ManagedAgentsFileResourceType, ManagedAgentsGitHubRepositoryResource, ManagedAgentsGitHubRepositoryResourceType, ManagedAgentsGitHubRepositoryResourceCheckoutUnion, ManagedAgentsMemoryStoreResource, ManagedAgentsMemoryStoreResourceType, ManagedAgentsMemoryStoreResourceAccess, ManagedAgentsSessionResourceUnion, SessionResourceGetResponseUnion, SessionResourceUpdateResponseUnion, SessionResourceGetParams, SessionResourceUpdateParams, SessionResourceListParams, SessionResourceDeleteParams, SessionResourceAddParams } from '../types.js';
