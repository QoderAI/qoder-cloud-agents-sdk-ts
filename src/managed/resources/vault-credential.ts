// Generated code, verified against the API contracts.
import { APIResource } from '../../core/resource.js';
import type { RequestOptions } from '../../core/client.js';
import type { APIPromise } from '../../core/api-promise.js';
import type { PagePromise } from '../../core/pagination.js';
import type { Stream } from '../../core/streaming.js';
import type * as Types from '../types.js';
import { splitParams, pathParam, managedMultipart } from '../internal.js';

export class VaultsCredentials extends APIResource {

  /**
   * Create Credential
   */
  create(vaultID: string, params: Types.VaultCredentialCreateParams, options?: RequestOptions): APIPromise<Types.ManagedAgentsCredential> {
    const request = splitParams(params, options, {"workspace_id": "qoder-workspace-id", "betas": "x-qoder-beta"}, []);
    return this._client.request<Types.ManagedAgentsCredential>({ ...request.options, method: "POST", path: `/vaults/${pathParam(vaultID, "vault_id")}/credentials`, body: request.values });
  }

  /**
   * Get Credential
   */
  retrieve(credentialID: string, params: Types.VaultCredentialRetrieveParams, options?: RequestOptions): APIPromise<Types.ManagedAgentsCredential> {
    const request = splitParams(params, options, {"workspace_id": "qoder-workspace-id", "betas": "x-qoder-beta"}, ["vault_id"]);
    return this._client.request<Types.ManagedAgentsCredential>({ ...request.options, method: "GET", path: `/vaults/${pathParam(params?.vault_id, "vault_id")}/credentials/${pathParam(credentialID, "credential_id")}` });
  }

  /**
   * Update Credential
   */
  update(credentialID: string, params: Types.VaultCredentialUpdateParams, options?: RequestOptions): APIPromise<Types.ManagedAgentsCredential> {
    const request = splitParams(params, options, {"workspace_id": "qoder-workspace-id", "betas": "x-qoder-beta"}, ["vault_id"]);
    return this._client.request<Types.ManagedAgentsCredential>({ ...request.options, method: "POST", path: `/vaults/${pathParam(params?.vault_id, "vault_id")}/credentials/${pathParam(credentialID, "credential_id")}`, body: request.values });
  }

  /**
   * List Credentials
   */
  list(vaultID: string, params: Types.VaultCredentialListParams | null | undefined = {}, options?: RequestOptions): PagePromise<Types.ManagedAgentsCredential> {
    const request = splitParams(params, options, {"workspace_id": "qoder-workspace-id", "betas": "x-qoder-beta"}, []);
    return this._client.getAPIList<Types.ManagedAgentsCredential>(`/vaults/${pathParam(vaultID, "vault_id")}/credentials`, request.values, request.options, 'page');
  }

  /**
   * Delete Credential
   */
  delete(credentialID: string, params: Types.VaultCredentialDeleteParams, options?: RequestOptions): APIPromise<Types.ManagedAgentsDeletedCredential> {
    const request = splitParams(params, options, {"workspace_id": "qoder-workspace-id", "betas": "x-qoder-beta"}, ["vault_id"]);
    return this._client.request<Types.ManagedAgentsDeletedCredential>({ ...request.options, method: "DELETE", path: `/vaults/${pathParam(params?.vault_id, "vault_id")}/credentials/${pathParam(credentialID, "credential_id")}` });
  }

  /**
   * Archive Credential
   */
  archive(credentialID: string, params: Types.VaultCredentialArchiveParams, options?: RequestOptions): APIPromise<Types.ManagedAgentsCredential> {
    const request = splitParams(params, options, {"workspace_id": "qoder-workspace-id", "betas": "x-qoder-beta"}, ["vault_id"]);
    return this._client.request<Types.ManagedAgentsCredential>({ ...request.options, method: "POST", path: `/vaults/${pathParam(params?.vault_id, "vault_id")}/credentials/${pathParam(credentialID, "credential_id")}/archive` });
  }

  /**
   * Validate Credential
   */
  mcpOAuthValidate(credentialID: string, params: Types.VaultCredentialMCPOAuthValidateParams, options?: RequestOptions): APIPromise<Types.ManagedAgentsCredentialValidation> {
    const request = splitParams(params, options, {"workspace_id": "qoder-workspace-id", "betas": "x-qoder-beta"}, ["vault_id"]);
    return this._client.request<Types.ManagedAgentsCredentialValidation>({ ...request.options, method: "POST", path: `/vaults/${pathParam(params?.vault_id, "vault_id")}/credentials/${pathParam(credentialID, "credential_id")}/mcp_oauth_validate` });
  }
}

export default VaultsCredentials;
export type { ManagedAgentsCredential, ManagedAgentsCredentialAuthUnion, ManagedAgentsCredentialType, ManagedAgentsCredentialNetworkingParamsUnion, ManagedAgentsCredentialValidation, ManagedAgentsCredentialValidationType, ManagedAgentsCredentialValidationStatus, ManagedAgentsDeletedCredential, ManagedAgentsDeletedCredentialType, ManagedAgentsEnvironmentVariableAuthResponse, ManagedAgentsEnvironmentVariableAuthResponseNetworkingUnion, ManagedAgentsEnvironmentVariableAuthResponseType, ManagedAgentsEnvironmentVariableCreateParams, ManagedAgentsEnvironmentVariableCreateParamsType, ManagedAgentsEnvironmentVariableUpdateParams, ManagedAgentsEnvironmentVariableUpdateParamsType, ManagedAgentsInjectionLocationParams, ManagedAgentsInjectionLocationResponse, ManagedAgentsInjectionLocationUpdateParams, ManagedAgentsLimitedCredentialNetworkingParams, ManagedAgentsLimitedCredentialNetworkingParamsType, ManagedAgentsLimitedCredentialNetworkingResponse, ManagedAgentsLimitedCredentialNetworkingResponseType, ManagedAgentsMCPOAuthAuthResponse, ManagedAgentsMCPOAuthAuthResponseType, ManagedAgentsMCPOAuthCreateParams, ManagedAgentsMCPOAuthCreateParamsType, ManagedAgentsMCPOAuthRefreshParams, ManagedAgentsMCPOAuthRefreshParamsTokenEndpointAuthUnion, ManagedAgentsMCPOAuthRefreshResponse, ManagedAgentsMCPOAuthRefreshResponseTokenEndpointAuthUnion, ManagedAgentsMCPOAuthRefreshUpdateParams, ManagedAgentsMCPOAuthRefreshUpdateParamsTokenEndpointAuthUnion, ManagedAgentsMCPOAuthUpdateParams, ManagedAgentsMCPOAuthUpdateParamsType, ManagedAgentsMCPProbe, ManagedAgentsRefreshHTTPResponse, ManagedAgentsRefreshObject, ManagedAgentsRefreshObjectStatus, ManagedAgentsStaticBearerAuthResponse, ManagedAgentsStaticBearerAuthResponseType, ManagedAgentsStaticBearerCreateParams, ManagedAgentsStaticBearerCreateParamsType, ManagedAgentsStaticBearerUpdateParams, ManagedAgentsStaticBearerUpdateParamsType, ManagedAgentsTokenEndpointAuthBasicParam, ManagedAgentsTokenEndpointAuthBasicParamType, ManagedAgentsTokenEndpointAuthBasicResponse, ManagedAgentsTokenEndpointAuthBasicResponseType, ManagedAgentsTokenEndpointAuthBasicUpdateParam, ManagedAgentsTokenEndpointAuthBasicUpdateParamType, ManagedAgentsTokenEndpointAuthNoneParam, ManagedAgentsTokenEndpointAuthNoneParamType, ManagedAgentsTokenEndpointAuthNoneResponse, ManagedAgentsTokenEndpointAuthNoneResponseType, ManagedAgentsTokenEndpointAuthPostParam, ManagedAgentsTokenEndpointAuthPostParamType, ManagedAgentsTokenEndpointAuthPostResponse, ManagedAgentsTokenEndpointAuthPostResponseType, ManagedAgentsTokenEndpointAuthPostUpdateParam, ManagedAgentsTokenEndpointAuthPostUpdateParamType, ManagedAgentsUnrestrictedCredentialNetworkingParams, ManagedAgentsUnrestrictedCredentialNetworkingParamsType, ManagedAgentsUnrestrictedCredentialNetworkingResponse, ManagedAgentsUnrestrictedCredentialNetworkingResponseType, VaultCredentialNewParams, VaultCredentialNewParamsAuthUnion, VaultCredentialGetParams, VaultCredentialUpdateParams, VaultCredentialUpdateParamsAuthUnion, VaultCredentialListParams, VaultCredentialDeleteParams, VaultCredentialArchiveParams, VaultCredentialMCPOAuthValidateParams } from '../types.js';
