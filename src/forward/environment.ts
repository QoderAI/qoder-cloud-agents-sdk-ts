// Generated code, verified against the API contracts.
import { APIResource } from '../core/resource.js';
import type { RequestOptions } from '../core/client.js';
import type { EnvironmentSearchParams } from './types.js';
import type { IdentityScopeOptions } from './types.js';
import type { APIPromise } from '../core/api-promise.js';
import type { PagePromise } from '../core/pagination.js';
import { pathParam, requestHeaders, identityScopeOptions } from './_utils.js';
import type { Environment, EnvironmentCreateParams, EnvironmentListParams, EnvironmentUpdateParams } from './types.js';

export class Environments extends APIResource {
  /** Search by metadata and resource filters; automatically enables the Search beta. */
  search(params: EnvironmentSearchParams = {}, options?: RequestOptions): PagePromise<Environment> {
    const { identity_id, ...body } = params;
    return this._client.postAPIList<Environment>('environments/search', body, { ...options, query: { identity_id, ...options?.query } }, 'page', 'search-2026-08-31');
  }

  /**
   * 列出 Environment.
   *
   * @operation listEnvironment
   */
  list(params: EnvironmentListParams = {}, options?: RequestOptions): PagePromise<Environment> {
    const path = "environments";
    return this._client.getAPIList<Environment>(path, params, options, "page");
  }

  /**
   * 创建 Environment.
   *
   * @operation createEnvironment
   */
  create(params: EnvironmentCreateParams, options?: RequestOptions): APIPromise<Environment> {
    const path = "environments";
    const { identity_id, idempotency_key, ...payload } = params;
    return this._client.request<Environment>({
      method: "POST",
      path,
      body: payload,
      ...options,
      query: { identity_id, ...options?.query },
      headers: requestHeaders({ "Idempotency-Key": idempotency_key }, options?.headers),
    });
  }

  /**
   * 查询 Environment.
   *
   * @operation getEnvironment
   */
  retrieve(id: string, options?: IdentityScopeOptions): APIPromise<Environment> {
    const path = `environments/${pathParam(id, "id")}`;
    return this._client.request<Environment>({
      method: "GET",
      path,
      ...identityScopeOptions(options),
    });
  }

  /**
   * 修改 Environment.
   *
   * @operation updateEnvironment
   */
  update(
    id: string,
    params: EnvironmentUpdateParams = {},
    options?: RequestOptions,
  ): APIPromise<Environment> {
    const path = `environments/${pathParam(id, "id")}`;
    const { identity_id, ...payload } = params;
    return this._client.request<Environment>({
      method: "POST",
      path,
      body: payload,
      ...options,
      query: { identity_id, ...options?.query },
    });
  }

  /**
   * Archive an environment retained by historical sessions or tool calls.
   *
   * @operation archiveEnvironment
   */
  archive(id: string, options?: IdentityScopeOptions): APIPromise<Environment> {
    const path = `environments/${pathParam(id, "id")}/archive`;
    return this._client.request<Environment>({
      method: "POST",
      path,
      ...identityScopeOptions(options),
    });
  }

  /**
   * 删除 Environment.
   *
   * @operation deleteEnvironment
   */
  delete(id: string, options?: IdentityScopeOptions): APIPromise<void> {
    const path = `environments/${pathParam(id, "id")}`;
    return this._client.request<void>({
      method: "DELETE",
      path,
      responseType: "void",
      ...identityScopeOptions(options),
    });
  }

}

export type { Environment, EnvironmentCreateParams, EnvironmentListParams, EnvironmentUpdateParams } from './types.js';

export type { EnvironmentSearchParams } from './types.js';
