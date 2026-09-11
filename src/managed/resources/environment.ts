// Generated from qoder-cloud-agents-sdk-go/managed.
import { APIResource } from '../../core/resource.js';
import type { RequestOptions } from '../../core/client.js';
import type { APIPromise } from '../../core/api-promise.js';
import type { PagePromise } from '../../core/pagination.js';
import type { Stream } from '../../core/streaming.js';
import type * as Types from '../types.js';
import { splitParams, pathParam, managedMultipart } from '../internal.js';
import { EnvironmentsWork } from "./environment-work.js";

export class Environments extends APIResource {
  readonly work = new EnvironmentsWork(this._client);

  /**
   * Create a new environment with the specified configuration.
   */
  create(params: Types.EnvironmentCreateParams, options?: RequestOptions): APIPromise<Types.Environment> {
    const request = splitParams(params, options, {"workspace_id": "qoder-workspace-id", "betas": "x-qoder-beta"}, []);
    return this._client.request<Types.Environment>({ ...request.options, method: "POST", path: "/environments", body: request.values });
  }

  /**
   * Retrieve a specific environment by ID.
   */
  retrieve(environmentID: string, params: Types.EnvironmentRetrieveParams | null | undefined = {}, options?: RequestOptions): APIPromise<Types.Environment> {
    const request = splitParams(params, options, {"workspace_id": "qoder-workspace-id", "betas": "x-qoder-beta"}, []);
    return this._client.request<Types.Environment>({ ...request.options, method: "GET", path: `/environments/${pathParam(environmentID, "environment_id")}` });
  }

  /**
   * Update an existing environment's configuration.
   */
  update(environmentID: string, params: Types.EnvironmentUpdateParams | null | undefined = {}, options?: RequestOptions): APIPromise<Types.Environment> {
    const request = splitParams(params, options, {"workspace_id": "qoder-workspace-id", "betas": "x-qoder-beta"}, []);
    return this._client.request<Types.Environment>({ ...request.options, method: "POST", path: `/environments/${pathParam(environmentID, "environment_id")}`, body: request.values });
  }

  /**
   * List environments with pagination support.
   */
  list(params: Types.EnvironmentListParams | null | undefined = {}, options?: RequestOptions): PagePromise<Types.Environment> {
    const request = splitParams(params, options, {"workspace_id": "qoder-workspace-id", "betas": "x-qoder-beta"}, []);
    return this._client.getAPIList<Types.Environment>("/environments", request.values, request.options, 'page');
  }

  /**
   * Delete an environment by ID. Returns a confirmation of the deletion.
   */
  delete(environmentID: string, params: Types.EnvironmentDeleteParams | null | undefined = {}, options?: RequestOptions): APIPromise<Types.EnvironmentDeleteResponse> {
    const request = splitParams(params, options, {"workspace_id": "qoder-workspace-id", "betas": "x-qoder-beta"}, []);
    return this._client.request<Types.EnvironmentDeleteResponse>({ ...request.options, method: "DELETE", path: `/environments/${pathParam(environmentID, "environment_id")}` });
  }

  /**
   * Archive an environment by ID. Archived environments cannot be used to create new
   * sessions.
   */
  archive(environmentID: string, params: Types.EnvironmentArchiveParams | null | undefined = {}, options?: RequestOptions): APIPromise<Types.Environment> {
    const request = splitParams(params, options, {"workspace_id": "qoder-workspace-id", "betas": "x-qoder-beta"}, []);
    return this._client.request<Types.Environment>({ ...request.options, method: "POST", path: `/environments/${pathParam(environmentID, "environment_id")}/archive` });
  }
}

export default Environments;
export type { CloudConfig, CloudConfigNetworkingUnion, CloudConfigParams, CloudConfigParamsNetworkingUnion, Environment, EnvironmentConfigUnion, EnvironmentScope, EnvironmentDeleteResponse, EnvironmentDeleteResponseType, LimitedNetwork, LimitedNetworkParams, Packages, PackagesType, PackagesParams, PackagesParamsType, SelfHostedConfig, SelfHostedConfigParams, UnrestrictedNetwork, UnrestrictedNetworkParam, EnvironmentNewParams, EnvironmentNewParamsConfigUnion, EnvironmentNewParamsScope, EnvironmentGetParams, EnvironmentUpdateParams, EnvironmentUpdateParamsConfigUnion, EnvironmentUpdateParamsScope, EnvironmentListParams, EnvironmentDeleteParams, EnvironmentArchiveParams } from '../types.js';
