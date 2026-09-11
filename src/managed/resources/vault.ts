// Generated code, verified against the API contracts.
import { APIResource } from '../../core/resource.js';
import type { RequestOptions } from '../../core/client.js';
import type { APIPromise } from '../../core/api-promise.js';
import type { PagePromise } from '../../core/pagination.js';
import type { Stream } from '../../core/streaming.js';
import type * as Types from '../types.js';
import { splitParams, pathParam, managedMultipart } from '../internal.js';
import { VaultsCredentials } from "./vault-credential.js";

export class Vaults extends APIResource {
  readonly credentials = new VaultsCredentials(this._client);

  /**
   * Create Vault
   */
  create(params: Types.VaultCreateParams, options?: RequestOptions): APIPromise<Types.ManagedAgentsVault> {
    const request = splitParams(params, options, {"workspace_id": "qoder-workspace-id", "betas": "x-qoder-beta"}, []);
    return this._client.request<Types.ManagedAgentsVault>({ ...request.options, method: "POST", path: "/vaults", body: request.values });
  }

  /**
   * Get Vault
   */
  retrieve(vaultID: string, params: Types.VaultRetrieveParams | null | undefined = {}, options?: RequestOptions): APIPromise<Types.ManagedAgentsVault> {
    const request = splitParams(params, options, {"workspace_id": "qoder-workspace-id", "betas": "x-qoder-beta"}, []);
    return this._client.request<Types.ManagedAgentsVault>({ ...request.options, method: "GET", path: `/vaults/${pathParam(vaultID, "vault_id")}` });
  }

  /**
   * List Vaults
   */
  list(params: Types.VaultListParams | null | undefined = {}, options?: RequestOptions): PagePromise<Types.ManagedAgentsVault> {
    const request = splitParams(params, options, {"workspace_id": "qoder-workspace-id", "betas": "x-qoder-beta"}, []);
    return this._client.getAPIList<Types.ManagedAgentsVault>("/vaults", request.values, request.options, 'page');
  }

  /**
   * Delete Vault
   */
  delete(vaultID: string, params: Types.VaultDeleteParams | null | undefined = {}, options?: RequestOptions): APIPromise<Types.ManagedAgentsDeletedVault> {
    const request = splitParams(params, options, {"workspace_id": "qoder-workspace-id", "betas": "x-qoder-beta"}, []);
    return this._client.request<Types.ManagedAgentsDeletedVault>({ ...request.options, method: "DELETE", path: `/vaults/${pathParam(vaultID, "vault_id")}` });
  }

  /**
   * Archive Vault
   */
  archive(vaultID: string, params: Types.VaultArchiveParams | null | undefined = {}, options?: RequestOptions): APIPromise<Types.ManagedAgentsVault> {
    const request = splitParams(params, options, {"workspace_id": "qoder-workspace-id", "betas": "x-qoder-beta"}, []);
    return this._client.request<Types.ManagedAgentsVault>({ ...request.options, method: "POST", path: `/vaults/${pathParam(vaultID, "vault_id")}/archive` });
  }
}

export default Vaults;
export type { ManagedAgentsDeletedVault, ManagedAgentsDeletedVaultType, ManagedAgentsVault, ManagedAgentsVaultType, VaultNewParams, VaultGetParams, VaultListParams, VaultDeleteParams, VaultArchiveParams } from '../types.js';
