// Generated from qoder-cloud-agents-sdk-go/managed.
import { APIResource } from '../../core/resource.js';
import type { RequestOptions } from '../../core/client.js';
import type { APIPromise } from '../../core/api-promise.js';
import type { PagePromise } from '../../core/pagination.js';
import type { Stream } from '../../core/streaming.js';
import type * as Types from '../types.js';
import { splitParams, pathParam, managedMultipart } from '../internal.js';

export class MemoryStoresMemoryVersions extends APIResource {

  /**
   * Retrieve a memory version
   */
  retrieve(memoryVersionID: string, params: Types.MemoryStoreMemoryVersionRetrieveParams, options?: RequestOptions): APIPromise<Types.ManagedAgentsMemoryVersion> {
    const request = splitParams(params, options, {"workspace_id": "qoder-workspace-id", "betas": "x-qoder-beta"}, ["memory_store_id"]);
    return this._client.request<Types.ManagedAgentsMemoryVersion>({ ...request.options, method: "GET", path: `/memory_stores/${pathParam(params?.memory_store_id, "memory_store_id")}/memory_versions/${pathParam(memoryVersionID, "memory_version_id")}`, query: request.values });
  }

  /**
   * List memory versions
   */
  list(memoryStoreID: string, params: Types.MemoryStoreMemoryVersionListParams | null | undefined = {}, options?: RequestOptions): PagePromise<Types.ManagedAgentsMemoryVersion> {
    const request = splitParams(params, options, {"workspace_id": "qoder-workspace-id", "betas": "x-qoder-beta"}, []);
    return this._client.getAPIList<Types.ManagedAgentsMemoryVersion>(`/memory_stores/${pathParam(memoryStoreID, "memory_store_id")}/memory_versions`, request.values, request.options, 'page');
  }

  /**
   * Redact a memory version
   */
  redact(memoryVersionID: string, params: Types.MemoryStoreMemoryVersionRedactParams, options?: RequestOptions): APIPromise<Types.ManagedAgentsMemoryVersion> {
    const request = splitParams(params, options, {"workspace_id": "qoder-workspace-id", "betas": "x-qoder-beta"}, ["memory_store_id"]);
    return this._client.request<Types.ManagedAgentsMemoryVersion>({ ...request.options, method: "POST", path: `/memory_stores/${pathParam(params?.memory_store_id, "memory_store_id")}/memory_versions/${pathParam(memoryVersionID, "memory_version_id")}/redact` });
  }
}

export default MemoryStoresMemoryVersions;
export type { ManagedAgentsActorUnion, ManagedAgentsAPIActor, ManagedAgentsAPIActorType, ManagedAgentsMemoryVersion, ManagedAgentsMemoryVersionType, ManagedAgentsMemoryVersionOperation, ManagedAgentsServiceAccountActor, ManagedAgentsSessionActor, ManagedAgentsSessionActorType, ManagedAgentsUserActor, ManagedAgentsUserActorType, MemoryStoreMemoryVersionGetParams, MemoryStoreMemoryVersionListParams, MemoryStoreMemoryVersionRedactParams } from '../types.js';
