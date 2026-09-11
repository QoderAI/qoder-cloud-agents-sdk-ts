// Generated code, verified against the API contracts.
import { APIResource } from '../../core/resource.js';
import type { RequestOptions } from '../../core/client.js';
import type { APIPromise } from '../../core/api-promise.js';
import type { PagePromise } from '../../core/pagination.js';
import type { Stream } from '../../core/streaming.js';
import type * as Types from '../types.js';
import { splitParams, pathParam, managedMultipart } from '../internal.js';

export class Models extends APIResource {

  /**
   * List available models.
   *
   * The Models API response can be used to determine which models are available for
   * use in the API. More recently released models are listed first.
   */
  list(params: Types.ModelListParams | null | undefined = {}, options?: RequestOptions): PagePromise<Types.ModelInfo> {
    const request = splitParams(params, options, {"workspace_id": "qoder-workspace-id", "betas": "x-qoder-beta"}, []);
    return this._client.getAPIList<Types.ModelInfo>("/models", request.values, request.options, 'cursor');
  }
}

export default Models;
export type { CapabilitySupport, ContextManagementCapability, EffortCapability, ModelCapabilities, ModelInfo, ThinkingCapability, ThinkingTypes, ModelListParams } from '../types.js';
