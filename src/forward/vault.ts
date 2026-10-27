// Generated code, verified against the API contracts.
import { APIResource } from '../core/resource.js';
import type { RequestOptions } from '../core/client.js';
import type { VaultSearchParams } from './types.js';
import type { IdentityScopeOptions } from './types.js';
import type { APIPromise } from '../core/api-promise.js';
import type { PagePromise } from '../core/pagination.js';
import { pathParam, requestHeaders, identityScopeOptions } from './_utils.js';
import type { Vault, VaultCreateParams, VaultListParams } from './types.js';
import { VaultCredentials } from './vault-credential.js';

export class Vaults extends APIResource {
  readonly credentials: VaultCredentials = new VaultCredentials(this._client);

  /** Search by metadata and resource filters; automatically enables the Search beta. */
  search(params: VaultSearchParams = {}, options?: RequestOptions): PagePromise<Vault> {
    const { identity_id, ...body } = params;
    return this._client.postAPIList<Vault>('vaults/search', body, { ...options, query: { identity_id, ...options?.query } }, 'page', 'search-2026-08-31');
  }

  /**
   * 列出 Vault.
   *
   * @operation listVault
   */
  list(params: VaultListParams = {}, options?: RequestOptions): PagePromise<Vault> {
    const path = "vaults";
    return this._client.getAPIList<Vault>(path, params, options, "page");
  }

  /**
   * 创建 Vault.
   *
   * @operation createVault
   */
  create(params: VaultCreateParams, options?: RequestOptions): APIPromise<Vault> {
    const path = "vaults";
    const { identity_id, idempotency_key, ...payload } = params;
    return this._client.request<Vault>({
      method: "POST",
      path,
      body: payload,
      ...options,
      query: { identity_id, ...options?.query },
      headers: requestHeaders({ "Idempotency-Key": idempotency_key }, options?.headers),
    });
  }

  /**
   * 查询 Vault.
   *
   * @operation getVault
   */
  retrieve(id: string, options?: IdentityScopeOptions): APIPromise<Vault> {
    const path = `vaults/${pathParam(id, "id")}`;
    return this._client.request<Vault>({
      method: "GET",
      path,
      ...identityScopeOptions(options),
    });
  }

  /**
   * 删除 Vault.
   *
   * @operation deleteVault
   */
  delete(id: string, options?: IdentityScopeOptions): APIPromise<void> {
    const path = `vaults/${pathParam(id, "id")}`;
    return this._client.request<void>({
      method: "DELETE",
      path,
      responseType: "void",
      ...identityScopeOptions(options),
    });
  }

}

export type { Vault, VaultCreateParams, VaultListParams } from './types.js';

export type { VaultSearchParams } from './types.js';
