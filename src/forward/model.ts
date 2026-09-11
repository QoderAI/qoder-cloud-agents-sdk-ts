// Generated code, verified against the API contracts.
import { APIResource } from '../core/resource.js';
import type { RequestOptions } from '../core/client.js';
import type { APIPromise } from '../core/api-promise.js';
import { pathParam, requestHeaders } from './_utils.js';
import type { ModelListResponse } from './types.js';

export class Models extends APIResource {
  /**
   * 列出模型.
   *
   * @operation listModels
   */
  list(options?: RequestOptions): APIPromise<ModelListResponse> {
    const path = "models";
    return this._client.request<ModelListResponse>({
      method: "GET",
      path,
      ...options,
    });
  }

}

export type { ModelListResponse } from './types.js';
