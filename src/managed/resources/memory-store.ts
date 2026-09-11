// Generated code, verified against the API contracts.
import { APIResource } from '../../core/resource.js';
import type { RequestOptions } from '../../core/client.js';
import type { APIPromise } from '../../core/api-promise.js';
import type { PagePromise } from '../../core/pagination.js';
import type { Stream } from '../../core/streaming.js';
import type * as Types from '../types.js';
import { splitParams, pathParam, managedMultipart } from '../internal.js';
import { MemoryStoresMemories } from "./memory-store-memory.js";
import { MemoryStoresMemoryVersions } from "./memory-store-memory-version.js";

export class MemoryStores extends APIResource {
  readonly memories = new MemoryStoresMemories(this._client);
  readonly memoryVersions = new MemoryStoresMemoryVersions(this._client);

  /**
   * Create a memory store
   */
  create(params: Types.MemoryStoreCreateParams, options?: RequestOptions): APIPromise<Types.ManagedAgentsMemoryStore> {
    const request = splitParams(params, options, {"workspace_id": "qoder-workspace-id", "betas": "x-qoder-beta"}, []);
    return this._client.request<Types.ManagedAgentsMemoryStore>({ ...request.options, method: "POST", path: "/memory_stores", body: request.values });
  }

  /**
   * Retrieve a memory store
   */
  retrieve(memoryStoreID: string, params: Types.MemoryStoreRetrieveParams | null | undefined = {}, options?: RequestOptions): APIPromise<Types.ManagedAgentsMemoryStore> {
    const request = splitParams(params, options, {"workspace_id": "qoder-workspace-id", "betas": "x-qoder-beta"}, []);
    return this._client.request<Types.ManagedAgentsMemoryStore>({ ...request.options, method: "GET", path: `/memory_stores/${pathParam(memoryStoreID, "memory_store_id")}` });
  }

  /**
   * Update a memory store
   */
  update(memoryStoreID: string, params: Types.MemoryStoreUpdateParams | null | undefined = {}, options?: RequestOptions): APIPromise<Types.ManagedAgentsMemoryStore> {
    const request = splitParams(params, options, {"workspace_id": "qoder-workspace-id", "betas": "x-qoder-beta"}, []);
    return this._client.request<Types.ManagedAgentsMemoryStore>({ ...request.options, method: "POST", path: `/memory_stores/${pathParam(memoryStoreID, "memory_store_id")}`, body: request.values });
  }

  /**
   * List memory stores
   */
  list(params: Types.MemoryStoreListParams | null | undefined = {}, options?: RequestOptions): PagePromise<Types.ManagedAgentsMemoryStore> {
    const request = splitParams(params, options, {"workspace_id": "qoder-workspace-id", "betas": "x-qoder-beta"}, []);
    return this._client.getAPIList<Types.ManagedAgentsMemoryStore>("/memory_stores", request.values, request.options, 'page');
  }

  /**
   * Delete a memory store
   */
  delete(memoryStoreID: string, params: Types.MemoryStoreDeleteParams | null | undefined = {}, options?: RequestOptions): APIPromise<Types.ManagedAgentsDeletedMemoryStore> {
    const request = splitParams(params, options, {"workspace_id": "qoder-workspace-id", "betas": "x-qoder-beta"}, []);
    return this._client.request<Types.ManagedAgentsDeletedMemoryStore>({ ...request.options, method: "DELETE", path: `/memory_stores/${pathParam(memoryStoreID, "memory_store_id")}` });
  }

  /**
   * Archive a memory store
   */
  archive(memoryStoreID: string, params: Types.MemoryStoreArchiveParams | null | undefined = {}, options?: RequestOptions): APIPromise<Types.ManagedAgentsMemoryStore> {
    const request = splitParams(params, options, {"workspace_id": "qoder-workspace-id", "betas": "x-qoder-beta"}, []);
    return this._client.request<Types.ManagedAgentsMemoryStore>({ ...request.options, method: "POST", path: `/memory_stores/${pathParam(memoryStoreID, "memory_store_id")}/archive` });
  }
}

export default MemoryStores;
export type { ManagedAgentsDeletedMemoryStore, ManagedAgentsDeletedMemoryStoreType, ManagedAgentsMemoryStore, ManagedAgentsMemoryStoreType, MemoryStoreNewParams, MemoryStoreGetParams, MemoryStoreUpdateParams, MemoryStoreListParams, MemoryStoreDeleteParams, MemoryStoreArchiveParams } from '../types.js';
