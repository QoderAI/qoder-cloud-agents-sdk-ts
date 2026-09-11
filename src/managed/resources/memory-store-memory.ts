// Generated from qoder-cloud-agents-sdk-go/managed.
import { APIResource } from '../../core/resource.js';
import type { RequestOptions } from '../../core/client.js';
import type { APIPromise } from '../../core/api-promise.js';
import type { PagePromise } from '../../core/pagination.js';
import type { Stream } from '../../core/streaming.js';
import type * as Types from '../types.js';
import { splitParams, pathParam, managedMultipart } from '../internal.js';

export class MemoryStoresMemories extends APIResource {

  /**
   * Create a memory
   */
  create(memoryStoreID: string, params: Types.MemoryStoreMemoryCreateParams, options?: RequestOptions): APIPromise<Types.ManagedAgentsMemory> {
    const request = splitParams(params, options, {"workspace_id": "qoder-workspace-id", "betas": "x-qoder-beta"}, []);
    return this._client.request<Types.ManagedAgentsMemory>({ ...request.options, method: "POST", path: `/memory_stores/${pathParam(memoryStoreID, "memory_store_id")}/memories`, body: request.values });
  }

  /**
   * Retrieve a memory
   */
  retrieve(memoryID: string, params: Types.MemoryStoreMemoryRetrieveParams, options?: RequestOptions): APIPromise<Types.ManagedAgentsMemory> {
    const request = splitParams(params, options, {"workspace_id": "qoder-workspace-id", "betas": "x-qoder-beta"}, ["memory_store_id"]);
    return this._client.request<Types.ManagedAgentsMemory>({ ...request.options, method: "GET", path: `/memory_stores/${pathParam(params?.memory_store_id, "memory_store_id")}/memories/${pathParam(memoryID, "memory_id")}`, query: request.values });
  }

  /**
   * Update a memory
   */
  update(memoryID: string, params: Types.MemoryStoreMemoryUpdateParams, options?: RequestOptions): APIPromise<Types.ManagedAgentsMemory> {
    const request = splitParams(params, options, {"workspace_id": "qoder-workspace-id", "betas": "x-qoder-beta"}, ["memory_store_id"]);
    return this._client.request<Types.ManagedAgentsMemory>({ ...request.options, method: "POST", path: `/memory_stores/${pathParam(params?.memory_store_id, "memory_store_id")}/memories/${pathParam(memoryID, "memory_id")}`, body: request.values });
  }

  /**
   * List memories
   */
  list(memoryStoreID: string, params: Types.MemoryStoreMemoryListParams | null | undefined = {}, options?: RequestOptions): PagePromise<Types.ManagedAgentsMemoryListItemUnion> {
    const request = splitParams(params, options, {"workspace_id": "qoder-workspace-id", "betas": "x-qoder-beta"}, []);
    return this._client.getAPIList<Types.ManagedAgentsMemoryListItemUnion>(`/memory_stores/${pathParam(memoryStoreID, "memory_store_id")}/memories`, request.values, request.options, 'page');
  }

  /**
   * Delete a memory
   */
  delete(memoryID: string, params: Types.MemoryStoreMemoryDeleteParams, options?: RequestOptions): APIPromise<Types.ManagedAgentsDeletedMemory> {
    const request = splitParams(params, options, {"workspace_id": "qoder-workspace-id", "betas": "x-qoder-beta"}, ["memory_store_id"]);
    return this._client.request<Types.ManagedAgentsDeletedMemory>({ ...request.options, method: "DELETE", path: `/memory_stores/${pathParam(params?.memory_store_id, "memory_store_id")}/memories/${pathParam(memoryID, "memory_id")}`, body: request.values });
  }
}

export default MemoryStoresMemories;
export type { ManagedAgentsDeletedMemory, ManagedAgentsDeletedMemoryType, ManagedAgentsMemory, ManagedAgentsMemoryType, ManagedAgentsMemoryListItemUnion, ManagedAgentsMemoryPrefix, ManagedAgentsMemoryPrefixType, ManagedAgentsMemoryView, ManagedAgentsPreconditionParam, ManagedAgentsPreconditionType, MemoryStoreMemoryNewParams, MemoryStoreMemoryGetParams, MemoryStoreMemoryUpdateParams, MemoryStoreMemoryListParams, MemoryStoreMemoryDeleteParams } from '../types.js';
