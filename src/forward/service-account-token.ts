import { APIResource } from '../core/resource.js';
import { mergeHeaders, type RequestOptions } from '../core/client.js';
import type { APIPromise } from '../core/api-promise.js';
import { pathParam } from './_utils.js';
import type { ServiceAccountToken, ServiceAccountTokenCreateParams, ServiceAccountTokenRevokeParams, ServiceAccountTokenRevokeResponse } from './types.js';

/** @internal Per-call Key authentication overrides ordinary PAT/SAT authentication. */
export function saKeyRequestOptions(saKey: string, options?: RequestOptions): RequestOptions {
  if (typeof saKey !== 'string' || saKey.length === 0 || /[\u0000-\u0020\u007f]/.test(saKey)) {
    throw new Error('saKey must be non-empty and contain no whitespace or control characters');
  }
  const headers = mergeHeaders(options?.headers);
  headers.set('Authorization', `Bearer ${saKey}`);
  headers.set('Content-Type', 'application/json');
  return { ...options, headers, maxRetries: 0 };
}

/** Forward SAT issuance and revocation require an explicit SA Key per call. */
export class ServiceAccountTokens extends APIResource {
  /** Issue an admin SAT. Automatic retries are disabled to avoid duplicate issuance. */
  create(params: ServiceAccountTokenCreateParams, options?: RequestOptions): APIPromise<ServiceAccountToken> {
    const { saKey, ...payload } = params;
    return this._client.request<ServiceAccountToken>({
      method: 'POST',
      path: 'service_account_tokens',
      body: payload,
      ...saKeyRequestOptions(saKey, options),
    });
  }

  /** Revoke a Forward SAT binding from the same SA. Creation metadata disambiguates the target. */
  revoke(authTokenID: string, params: ServiceAccountTokenRevokeParams, options?: RequestOptions): APIPromise<ServiceAccountTokenRevokeResponse> {
    const path = `service_account_tokens/${pathParam(authTokenID, 'auth_token_id')}/revoke`;
    const { saKey, ...payload } = params;
    return this._client.request<ServiceAccountTokenRevokeResponse>({
      method: 'POST',
      path,
      body: payload,
      ...saKeyRequestOptions(saKey, options),
    });
  }
}

export type { ServiceAccountToken, ServiceAccountTokenCreateParams, ServiceAccountTokenRevokeParams, ServiceAccountTokenRevokeResponse } from './types.js';
