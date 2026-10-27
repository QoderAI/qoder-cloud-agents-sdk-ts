import { APIResource } from '../core/resource.js';
import type { RequestOptions } from '../core/client.js';
import type { APIPromise } from '../core/api-promise.js';
import type { PagePromise } from '../core/pagination.js';
import { pathParam } from './_utils.js';
import type { Dream, DreamCreateParams, DreamListParams } from './types.js';

/** Forward memory consolidation; requires PAT or an admin SAT. */
export class Dreams extends APIResource {
  create(params: DreamCreateParams, options?: RequestOptions): APIPromise<Dream> {
    return this._client.request<Dream>({
      ...options,
      method: 'POST',
      path: 'dreams',
      body: params,
    });
  }
  list(params: DreamListParams = {}, options?: RequestOptions): PagePromise<Dream> {
    return this._client.getAPIList<Dream>('dreams', params, options);
  }
  retrieve(dreamID: string, options?: RequestOptions): APIPromise<Dream> {
    return this._client.request<Dream>({
      ...options,
      method: 'GET',
      path: `dreams/${pathParam(dreamID, 'dream_id')}`,
    });
  }
  cancel(dreamID: string, options?: RequestOptions): APIPromise<Dream> {
    return this._client.request<Dream>({
      ...options,
      method: 'POST',
      path: `dreams/${pathParam(dreamID, 'dream_id')}/cancel`,
    });
  }
  archive(dreamID: string, options?: RequestOptions): APIPromise<Dream> {
    return this._client.request<Dream>({
      ...options,
      method: 'POST',
      path: `dreams/${pathParam(dreamID, 'dream_id')}/archive`,
    });
  }
}
export type { Dream, DreamCreateParams, DreamListParams, DreamInputParam, DreamModelConfigParam } from './types.js';
