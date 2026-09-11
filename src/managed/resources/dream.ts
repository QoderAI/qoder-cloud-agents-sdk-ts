// Generated from qoder-cloud-agents-sdk-go/managed.
import { APIResource } from '../../core/resource.js';
import type { RequestOptions } from '../../core/client.js';
import type { APIPromise } from '../../core/api-promise.js';
import type { PagePromise } from '../../core/pagination.js';
import type { Stream } from '../../core/streaming.js';
import type * as Types from '../types.js';
import { splitParams, pathParam, managedMultipart } from '../internal.js';

export class Dreams extends APIResource {

  /**
   * Create a Dream
   */
  create(params: Types.DreamCreateParams, options?: RequestOptions): APIPromise<Types.Dream> {
    const request = splitParams(params, options, {"workspace_id": "qoder-workspace-id", "betas": "x-qoder-beta"}, []);
    return this._client.request<Types.Dream>({ ...request.options, method: "POST", path: "/dreams", body: request.values });
  }

  /**
   * Get a Dream
   */
  retrieve(dreamID: string, params: Types.DreamRetrieveParams | null | undefined = {}, options?: RequestOptions): APIPromise<Types.Dream> {
    const request = splitParams(params, options, {"workspace_id": "qoder-workspace-id", "betas": "x-qoder-beta"}, []);
    return this._client.request<Types.Dream>({ ...request.options, method: "GET", path: `/dreams/${pathParam(dreamID, "dream_id")}` });
  }

  /**
   * List Dreams
   */
  list(params: Types.DreamListParams | null | undefined = {}, options?: RequestOptions): PagePromise<Types.Dream> {
    const request = splitParams(params, options, {"workspace_id": "qoder-workspace-id", "betas": "x-qoder-beta"}, []);
    return this._client.getAPIList<Types.Dream>("/dreams", request.values, request.options, 'page');
  }

  /**
   * Archive a Dream
   */
  archive(dreamID: string, params: Types.DreamArchiveParams | null | undefined = {}, options?: RequestOptions): APIPromise<Types.Dream> {
    const request = splitParams(params, options, {"workspace_id": "qoder-workspace-id", "betas": "x-qoder-beta"}, []);
    return this._client.request<Types.Dream>({ ...request.options, method: "POST", path: `/dreams/${pathParam(dreamID, "dream_id")}/archive` });
  }

  /**
   * Cancel a Dream
   */
  cancel(dreamID: string, params: Types.DreamCancelParams | null | undefined = {}, options?: RequestOptions): APIPromise<Types.Dream> {
    const request = splitParams(params, options, {"workspace_id": "qoder-workspace-id", "betas": "x-qoder-beta"}, []);
    return this._client.request<Types.Dream>({ ...request.options, method: "POST", path: `/dreams/${pathParam(dreamID, "dream_id")}/cancel` });
  }
}

export default Dreams;
export type { Dream, DreamType, DreamError, DreamInputUnion, DreamInputUnionParam, DreamMemoryStoreInput, DreamMemoryStoreInputType, DreamMemoryStoreInputParam, DreamModelConfig, DreamModelConfigSpeed, DreamModelConfigParam, DreamModelConfigParamSpeed, DreamOutput, DreamOutputType, DreamSessionsInput, DreamSessionsInputType, DreamSessionsInputParam, DreamStatus, DreamUsage, OutputBehaviorUnion, OutputBehaviorUnionParam, OutputBehaviorCreateNew, OutputBehaviorCreateNewType, OutputBehaviorCreateNewParam, OutputBehaviorUpdateExisting, OutputBehaviorUpdateExistingType, OutputBehaviorUpdateExistingParam, DreamNewParams, DreamNewParamsModelUnion, DreamGetParams, DreamListParams, DreamArchiveParams, DreamCancelParams } from '../types.js';
