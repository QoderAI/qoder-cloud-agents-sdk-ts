// Generated code, verified against the API contracts.
import { APIResource } from '../core/resource.js';
import type { RequestOptions } from '../core/client.js';
import type { APIPromise } from '../core/api-promise.js';
import type { PagePromise } from '../core/pagination.js';
import { pathParam, requestHeaders } from './_utils.js';
import type { VaultCredential, VaultCredentialCreateParams, VaultCredentialListParams } from './types.js';

export class VaultCredentials extends APIResource {
  /**
   * 列出 Credential.
   *
   * @operation listVaultCredential
   */
  list(
    id: string,
    params: VaultCredentialListParams = {},
    options?: RequestOptions,
  ): PagePromise<VaultCredential> {
    const path = `vaults/${pathParam(id, "id")}/credentials`;
    return this._client.getAPIList<VaultCredential>(path, params, options, "page");
  }

  /**
   * 创建 Credential.
   *
   * @operation createVaultCredential
   */
  create(
    id: string,
    params: VaultCredentialCreateParams,
    options?: RequestOptions,
  ): APIPromise<VaultCredential> {
    const path = `vaults/${pathParam(id, "id")}/credentials`;
    const { idempotency_key, ...payload } = params;
    return this._client.request<VaultCredential>({
      method: "POST",
      path,
      body: payload,
      ...options,
      headers: requestHeaders({ "Idempotency-Key": idempotency_key }, options?.headers),
    });
  }

  /**
   * 查询 Credential.
   *
   * @operation getVaultCredential
   */
  retrieve(id: string, credID: string, options?: RequestOptions): APIPromise<VaultCredential> {
    const path = `vaults/${pathParam(id, "id")}/credentials/${pathParam(credID, "cred_id")}`;
    return this._client.request<VaultCredential>({
      method: "GET",
      path,
      ...options,
    });
  }

  /**
   * 删除 Credential.
   *
   * @operation deleteVaultCredential
   */
  delete(id: string, credID: string, options?: RequestOptions): APIPromise<void> {
    const path = `vaults/${pathParam(id, "id")}/credentials/${pathParam(credID, "cred_id")}`;
    return this._client.request<void>({
      method: "DELETE",
      path,
      responseType: "void",
      ...options,
    });
  }

}

export type { VaultCredential, VaultCredentialCreateParams, VaultCredentialListParams } from './types.js';
