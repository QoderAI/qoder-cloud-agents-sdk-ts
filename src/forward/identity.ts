// Generated from the Go SDK and verified against its API contracts.
import { APIResource } from '../core/resource.js';
import type { RequestOptions } from '../core/client.js';
import type { APIPromise } from '../core/api-promise.js';
import type { PagePromise } from '../core/pagination.js';
import { pathParam, requestHeaders } from './_utils.js';
import type { DeletedIdentity, Identity, IdentityClearParams, IdentityClearResponse, IdentityCreateParams, IdentityListParams, IdentityListTemplatesResponse, IdentityStats, IdentityUpdateParams } from './types.js';
import { IdentityConfigs } from './identity-config.js';
import { IdentityMemoryStores } from './identity-memory-store.js';

export class Identities extends APIResource {
  readonly configs: IdentityConfigs = new IdentityConfigs(this._client);
  readonly memoryStores: IdentityMemoryStores = new IdentityMemoryStores(this._client);

  /**
   * 列出 Identities.
   *
   * @see Go IdentityService.List
   * @operation listIdentities
   */
  list(params: IdentityListParams = {}, options?: RequestOptions): PagePromise<Identity> {
    const path = "identities";
    return this._client.getAPIList<Identity>(path, params, options, "cursor");
  }

  /**
   * 创建 Identity.
   *
   * @see Go IdentityService.New
   * @operation createIdentity
   */
  create(params: IdentityCreateParams, options?: RequestOptions): APIPromise<Identity> {
    const path = "identities";
    const { idempotency_key, ...payload } = params;
    return this._client.request<Identity>({
      method: "POST",
      path,
      body: payload,
      ...options,
      headers: requestHeaders({ "Idempotency-Key": idempotency_key }, options?.headers),
    });
  }

  /**
   * 确保管理员 Identity.
   *
   * @see Go IdentityService.EnsureAdmin
   * @operation ensureAdminIdentity
   */
  ensureAdmin(options?: RequestOptions): APIPromise<Identity> {
    const path = "identities/admin/ensure";
    return this._client.request<Identity>({
      method: "POST",
      path,
      ...options,
    });
  }

  /**
   * 获取 Identity 统计.
   *
   * @see Go IdentityService.Stats
   * @operation getIdentityStats
   */
  stats(options?: RequestOptions): APIPromise<IdentityStats> {
    const path = "identities/stats";
    return this._client.request<IdentityStats>({
      method: "GET",
      path,
      ...options,
    });
  }

  /**
   * 获取 Identity.
   *
   * @see Go IdentityService.Get
   * @operation getIdentity
   */
  retrieve(identityID: string, options?: RequestOptions): APIPromise<Identity> {
    const path = `identities/${pathParam(identityID, "identity_id")}`;
    return this._client.request<Identity>({
      method: "GET",
      path,
      ...options,
    });
  }

  /**
   * 更新 Identity.
   *
   * @see Go IdentityService.Update
   * @operation updateIdentity
   */
  update(
    identityID: string,
    params: IdentityUpdateParams = {},
    options?: RequestOptions,
  ): APIPromise<Identity> {
    const path = `identities/${pathParam(identityID, "identity_id")}`;
    const { idempotency_key, ...payload } = params;
    return this._client.request<Identity>({
      method: "POST",
      path,
      body: payload,
      ...options,
      headers: requestHeaders({ "Idempotency-Key": idempotency_key }, options?.headers),
    });
  }

  /**
   * 删除 Identity.
   *
   * @see Go IdentityService.Delete
   * @operation deleteIdentity
   */
  delete(identityID: string, options?: RequestOptions): APIPromise<DeletedIdentity> {
    const path = `identities/${pathParam(identityID, "identity_id")}`;
    return this._client.request<DeletedIdentity>({
      method: "DELETE",
      path,
      ...options,
    });
  }

  /**
   * 列出 Identity 使用的 Template.
   *
   * @see Go IdentityService.ListTemplates
   * @operation listIdentityAgents
   */
  listTemplates(identityID: string, options?: RequestOptions): APIPromise<IdentityListTemplatesResponse> {
    const path = `identities/${pathParam(identityID, "identity_id")}/agents`;
    return this._client.request<IdentityListTemplatesResponse>({
      method: "GET",
      path,
      ...options,
    });
  }

  /**
   * 清理 Identity.
   *
   * @see Go IdentityService.Clear
   * @operation clearIdentity
   */
  clear(
    identityID: string,
    params: IdentityClearParams = {},
    options?: RequestOptions,
  ): APIPromise<IdentityClearResponse> {
    const path = `identities/${pathParam(identityID, "identity_id")}/clear`;
    return this._client.request<IdentityClearResponse>({
      method: "POST",
      path,
      body: params,
      ...options,
    });
  }

  /**
   * 停用 Identity.
   *
   * @see Go IdentityService.Disable
   * @operation disableIdentity
   */
  disable(identityID: string, options?: RequestOptions): APIPromise<Identity> {
    const path = `identities/${pathParam(identityID, "identity_id")}/disable`;
    return this._client.request<Identity>({
      method: "POST",
      path,
      ...options,
    });
  }

  /**
   * 启用 Identity.
   *
   * @see Go IdentityService.Enable
   * @operation enableIdentity
   */
  enable(identityID: string, options?: RequestOptions): APIPromise<Identity> {
    const path = `identities/${pathParam(identityID, "identity_id")}/enable`;
    return this._client.request<Identity>({
      method: "POST",
      path,
      ...options,
    });
  }

}

export type { DeletedIdentity, Identity, IdentityClearParams, IdentityClearResponse, IdentityCreateParams, IdentityListParams, IdentityListTemplatesResponse, IdentityStats, IdentityUpdateParams } from './types.js';
