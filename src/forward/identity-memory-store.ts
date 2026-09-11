// Generated code, verified against the API contracts.
import { APIResource } from '../core/resource.js';
import type { RequestOptions } from '../core/client.js';
import type { APIPromise } from '../core/api-promise.js';
import { pathParam, requestHeaders } from './_utils.js';
import type { DeletedMemoryStoreMount, IdentityMemoryStoreListResponse, IdentityMemoryStoreMountParams, MemoryStoreMount } from './types.js';

export class IdentityMemoryStores extends APIResource {
  /**
   * 列出 Identity 上的 Memory Store 挂载.
   *
   * @operation listMemoryStoreMounts
   */
  list(
    identityID: string,
    templateID: string,
    options?: RequestOptions,
  ): APIPromise<IdentityMemoryStoreListResponse> {
    const path = `identities/${pathParam(identityID, "identity_id")}/templates/${pathParam(templateID, "template_id")}/memory_stores`;
    return this._client.request<IdentityMemoryStoreListResponse>({
      method: "GET",
      path,
      ...options,
    });
  }

  /**
   * 挂载 Memory Store 到 Identity.
   *
   * @operation mountMemoryStore
   */
  mount(
    identityID: string,
    templateID: string,
    params: IdentityMemoryStoreMountParams,
    options?: RequestOptions,
  ): APIPromise<MemoryStoreMount> {
    const path = `identities/${pathParam(identityID, "identity_id")}/templates/${pathParam(templateID, "template_id")}/memory_stores`;
    return this._client.request<MemoryStoreMount>({
      method: "POST",
      path,
      body: params,
      ...options,
    });
  }

  /**
   * 解绑 Identity 上的 Memory Store.
   *
   * @operation detachMemoryStore
   */
  detach(
    identityID: string,
    templateID: string,
    memoryStoreID: string,
    options?: RequestOptions,
  ): APIPromise<DeletedMemoryStoreMount> {
    const path = `identities/${pathParam(identityID, "identity_id")}/templates/${pathParam(templateID, "template_id")}/memory_stores/${pathParam(memoryStoreID, "memory_store_id")}`;
    return this._client.request<DeletedMemoryStoreMount>({
      method: "DELETE",
      path,
      ...options,
    });
  }

}

export type { DeletedMemoryStoreMount, IdentityMemoryStoreListResponse, IdentityMemoryStoreMountParams, MemoryStoreMount } from './types.js';
