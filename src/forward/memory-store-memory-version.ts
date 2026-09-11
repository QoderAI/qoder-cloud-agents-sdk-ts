// Generated code, verified against the API contracts.
import { APIResource } from '../core/resource.js';
import type { RequestOptions } from '../core/client.js';
import type { APIPromise } from '../core/api-promise.js';
import type { PagePromise } from '../core/pagination.js';
import { pathParam, requestHeaders } from './_utils.js';
import type { MemoryStoreMemoryVersionListParams, MemoryVersion } from './types.js';

export class MemoryStoreMemoryVersions extends APIResource {
  /**
   * 列出 Memory 版本.
   *
   * @operation listMemoryStoreMemoryVersion
   */
  list(
    memoryStoreID: string,
    params: MemoryStoreMemoryVersionListParams = {},
    options?: RequestOptions,
  ): PagePromise<MemoryVersion> {
    const path = `memory_stores/${pathParam(memoryStoreID, "memory_store_id")}/memory_versions`;
    return this._client.getAPIList<MemoryVersion>(path, params, options, "cursor");
  }

  /**
   * 查询 Memory 版本.
   *
   * @operation getMemoryStoreMemoryVersion
   */
  retrieve(
    memoryStoreID: string,
    memoryVersionID: string,
    options?: RequestOptions,
  ): APIPromise<MemoryVersion> {
    const path = `memory_stores/${pathParam(memoryStoreID, "memory_store_id")}/memory_versions/${pathParam(memoryVersionID, "memory_version_id")}`;
    return this._client.request<MemoryVersion>({
      method: "GET",
      path,
      ...options,
    });
  }

  /**
   * Redact Memory 版本.
   *
   * @operation redactMemoryStoreMemoryVersion
   */
  redact(
    memoryStoreID: string,
    memoryVersionID: string,
    options?: RequestOptions,
  ): APIPromise<MemoryVersion> {
    const path = `memory_stores/${pathParam(memoryStoreID, "memory_store_id")}/memory_versions/${pathParam(memoryVersionID, "memory_version_id")}/redact`;
    return this._client.request<MemoryVersion>({
      method: "POST",
      path,
      ...options,
    });
  }

}

export type { MemoryStoreMemoryVersionListParams, MemoryVersion } from './types.js';
