// Generated code, verified against the API contracts.
import { APIResource } from '../core/resource.js';
import type { RequestOptions } from '../core/client.js';
import type { APIPromise } from '../core/api-promise.js';
import type { PagePromise } from '../core/pagination.js';
import { pathParam, requestHeaders } from './_utils.js';
import type { DeletedMemoryStore, MemoryStore, MemoryStoreCreateParams, MemoryStoreListParams, MemoryStoreUpdateParams } from './types.js';
import { MemoryStoreMemories } from './memory-store-memory.js';
import { MemoryStoreMemoryVersions } from './memory-store-memory-version.js';

export class MemoryStores extends APIResource {
  readonly memories: MemoryStoreMemories = new MemoryStoreMemories(this._client);
  readonly memoryVersions: MemoryStoreMemoryVersions = new MemoryStoreMemoryVersions(this._client);

  /**
   * 列出 Memory Store.
   *
   * @operation listMemoryStore
   */
  list(params: MemoryStoreListParams = {}, options?: RequestOptions): PagePromise<MemoryStore> {
    const path = "memory_stores";
    return this._client.getAPIList<MemoryStore>(path, params, options, "cursor");
  }

  /**
   * 创建 Memory Store.
   *
   * @operation createMemoryStore
   */
  create(params: MemoryStoreCreateParams, options?: RequestOptions): APIPromise<MemoryStore> {
    const path = "memory_stores";
    const { idempotency_key, ...payload } = params;
    return this._client.request<MemoryStore>({
      method: "POST",
      path,
      body: payload,
      ...options,
      headers: requestHeaders({ "Idempotency-Key": idempotency_key }, options?.headers),
    });
  }

  /**
   * 查询 Memory Store.
   *
   * @operation getMemoryStore
   */
  retrieve(memoryStoreID: string, options?: RequestOptions): APIPromise<MemoryStore> {
    const path = `memory_stores/${pathParam(memoryStoreID, "memory_store_id")}`;
    return this._client.request<MemoryStore>({
      method: "GET",
      path,
      ...options,
    });
  }

  /**
   * 更新 Memory Store.
   *
   * @operation updateMemoryStore
   */
  update(
    memoryStoreID: string,
    params: MemoryStoreUpdateParams = {},
    options?: RequestOptions,
  ): APIPromise<MemoryStore> {
    const path = `memory_stores/${pathParam(memoryStoreID, "memory_store_id")}`;
    return this._client.request<MemoryStore>({
      method: "POST",
      path,
      body: params,
      ...options,
    });
  }

  /**
   * 删除 Memory Store.
   *
   * @operation deleteMemoryStore
   */
  delete(memoryStoreID: string, options?: RequestOptions): APIPromise<DeletedMemoryStore> {
    const path = `memory_stores/${pathParam(memoryStoreID, "memory_store_id")}`;
    return this._client.request<DeletedMemoryStore>({
      method: "DELETE",
      path,
      ...options,
    });
  }

  /**
   * 归档 Memory Store.
   *
   * @operation archiveMemoryStore
   */
  archive(memoryStoreID: string, options?: RequestOptions): APIPromise<MemoryStore> {
    const path = `memory_stores/${pathParam(memoryStoreID, "memory_store_id")}/archive`;
    return this._client.request<MemoryStore>({
      method: "POST",
      path,
      ...options,
    });
  }

}

export type { DeletedMemoryStore, MemoryStore, MemoryStoreCreateParams, MemoryStoreListParams, MemoryStoreUpdateParams } from './types.js';
