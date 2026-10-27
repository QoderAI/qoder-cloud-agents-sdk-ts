import { APIResource } from '../../core/resource.js';
import type { RequestOptions } from '../../core/client.js';
import type { APIPromise } from '../../core/api-promise.js';
import { splitParams } from '../internal.js';
import type { OAuthStartParams, OAuthStartResponse } from '../types.js';

export class OAuth extends APIResource {
  /** Returns an authorization URL; the user completes authorization in their browser. */
  start(params: OAuthStartParams, options?: RequestOptions): APIPromise<OAuthStartResponse> {
    const request = splitParams(params, options, { workspace_id: 'qoder-workspace-id' }, []);
    return this._client.request<OAuthStartResponse>({
      ...request.options,
      method: 'POST',
      path: '/oauth/start',
      body: request.values,
    });
  }
}
export type { OAuthStartParams, OAuthStartResponse } from '../types.js';
