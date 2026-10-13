import { APIResource } from '../core/resource.js';
import type { RequestOptions } from '../core/client.js';
import type { APIPromise } from '../core/api-promise.js';
import { pathParam } from './_utils.js';
import { saKeyRequestOptions } from './service-account-token.js';
import type { ServiceAccountToken, ServiceAccountTokenCreateParams } from './types.js';

/** Issues SATs bound to a Forward Identity. */
export class IdentityServiceAccountTokens extends APIResource {
  /** Issue an Identity SAT using the explicit SA Key. Automatic retries are disabled. */
  create(identityID: string, params: ServiceAccountTokenCreateParams, options?: RequestOptions): APIPromise<ServiceAccountToken> {
    const path = `identities/${pathParam(identityID, 'identity_id')}/service_account_tokens`;
    const { saKey, ...payload } = params;
    return this._client.request<ServiceAccountToken>({
      method: 'POST',
      path,
      body: payload,
      ...saKeyRequestOptions(saKey, options),
    });
  }
}

export type { ServiceAccountToken, ServiceAccountTokenCreateParams } from './types.js';
