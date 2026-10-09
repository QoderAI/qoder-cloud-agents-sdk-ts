import { APIResource } from '../core/resource.js';
import type { RequestOptions } from '../core/client.js';
import type { PagePromise } from '../core/pagination.js';
import type { IdentityUsage, TemplateUsage, UsageListParams } from './types.js';

/** Identity/Template aggregates over an hourly Asia/Shanghai window. PAT or Admin SAT required. */
export class Usage extends APIResource {
  listIdentities(params: UsageListParams, options?: RequestOptions): PagePromise<IdentityUsage> {
    return this._client.getAPIList<IdentityUsage>('usage/identities', params, options, 'cursor');
  }
  listTemplates(params: UsageListParams, options?: RequestOptions): PagePromise<TemplateUsage> {
    return this._client.getAPIList<TemplateUsage>('usage/templates', params, options, 'cursor');
  }
}
export type { IdentityUsage, TemplateUsage, UsageListParams } from './types.js';
