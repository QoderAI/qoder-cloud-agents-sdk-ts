// Generated code, verified against the API contracts.
import { APIResource } from '../core/resource.js';
import type { RequestOptions } from '../core/client.js';
import type { IdentityScopeOptions } from './types.js';
import type { APIPromise } from '../core/api-promise.js';
import type { PagePromise } from '../core/pagination.js';
import { pathParam, requestHeaders, identityScopeOptions } from './_utils.js';
import type { VaultCredential, VaultCredentialCreateParams, VaultCredentialListParams, VaultCredentialUpdateParams } from './types.js';

export class VaultCredentials extends APIResource {
  /** Rotate write-only secrets or merge metadata. This operation is never automatically retried. */
  update(id: string, credID: string, params: VaultCredentialUpdateParams, options?: RequestOptions): APIPromise<VaultCredential> {
    const { identity_id, ...body } = params;
    return this._client.request<VaultCredential>({
      ...options, method: 'POST', path: `vaults/${pathParam(id, 'id')}/credentials/${pathParam(credID, 'cred_id')}`,
      body: options?.body ?? body, query: { identity_id, ...options?.query }, maxRetries: 0,
    });
  }

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
    const { identity_id, idempotency_key, ...payload } = params;
    return this._client.request<VaultCredential>({
      method: "POST",
      path,
      body: payload,
      ...options,
      query: { identity_id, ...options?.query },
      headers: requestHeaders({ "Idempotency-Key": idempotency_key }, options?.headers),
    });
  }

  /**
   * 查询 Credential.
   *
   * @operation getVaultCredential
   */
  retrieve(id: string, credID: string, options?: IdentityScopeOptions): APIPromise<VaultCredential> {
    const path = `vaults/${pathParam(id, "id")}/credentials/${pathParam(credID, "cred_id")}`;
    return this._client.request<VaultCredential>({
      method: "GET",
      path,
      ...identityScopeOptions(options),
    });
  }

  /**
   * 删除 Credential.
   *
   * @operation deleteVaultCredential
   */
  delete(id: string, credID: string, options?: IdentityScopeOptions): APIPromise<void> {
    const path = `vaults/${pathParam(id, "id")}/credentials/${pathParam(credID, "cred_id")}`;
    return this._client.request<void>({
      method: "DELETE",
      path,
      responseType: "void",
      ...identityScopeOptions(options),
    });
  }

}

export type { VaultCredential, VaultCredentialCreateParams, VaultCredentialListParams, VaultCredentialUpdateParams } from './types.js';
