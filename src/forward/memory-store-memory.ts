// Generated code, verified against the API contracts.
import { APIResource } from '../core/resource.js';
import type { RequestOptions } from '../core/client.js';
import type { APIPromise } from '../core/api-promise.js';
import type { PagePromise } from '../core/pagination.js';
import { pathParam, requestHeaders } from './_utils.js';
import type { DeletedMemory, Memory, MemoryStoreMemoryCreateParams, MemoryStoreMemoryListParams, MemoryStoreMemoryUpdateParams } from './types.js';

export class MemoryStoreMemories extends APIResource {
  /**
   * 列出 Memory.
   *
   * @operation listMemoryStoreMemoryMemories
   */
  list(
    memoryStoreID: string,
    params: MemoryStoreMemoryListParams = {},
    options?: RequestOptions,
  ): PagePromise<Memory> {
    const path = `memory_stores/${pathParam(memoryStoreID, "memory_store_id")}/memories`;
    return this._client.getAPIList<Memory>(path, params, options, "cursor");
  }

  /**
   * 创建 Memory.
   *
   * @operation createMemoryStoreMemory
   */
  create(
    memoryStoreID: string,
    params: MemoryStoreMemoryCreateParams,
    options?: RequestOptions,
  ): APIPromise<Memory> {
    const path = `memory_stores/${pathParam(memoryStoreID, "memory_store_id")}/memories`;
    return this._client.request<Memory>({
      method: "POST",
      path,
      body: params,
      ...options,
    });
  }

  /**
   * 查询 Memory.
   *
   * @operation getMemoryStoreMemory
   */
  retrieve(memoryStoreID: string, memoryID: string, options?: RequestOptions): APIPromise<Memory> {
    const path = `memory_stores/${pathParam(memoryStoreID, "memory_store_id")}/memories/${pathParam(memoryID, "memory_id")}`;
    return this._client.request<Memory>({
      method: "GET",
      path,
      ...options,
    });
  }

  /**
   * 更新 Memory.
   *
   * @operation updateMemoryStoreMemory
   */
  update(
    memoryStoreID: string,
    memoryID: string,
    params: MemoryStoreMemoryUpdateParams,
    options?: RequestOptions,
  ): APIPromise<Memory> {
    const path = `memory_stores/${pathParam(memoryStoreID, "memory_store_id")}/memories/${pathParam(memoryID, "memory_id")}`;
    return this._client.request<Memory>({
      method: "POST",
      path,
      body: params,
      ...options,
    });
  }

  /**
   * 删除 Memory.
   *
   * @operation deleteMemoryStoreMemory
   */
  delete(memoryStoreID: string, memoryID: string, options?: RequestOptions): APIPromise<DeletedMemory> {
    const path = `memory_stores/${pathParam(memoryStoreID, "memory_store_id")}/memories/${pathParam(memoryID, "memory_id")}`;
    return this._client.request<DeletedMemory>({
      method: "DELETE",
      path,
      ...options,
    });
  }

}

export type { DeletedMemory, Memory, MemoryStoreMemoryCreateParams, MemoryStoreMemoryListParams, MemoryStoreMemoryUpdateParams } from './types.js';
