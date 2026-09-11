// Generated from the Go SDK and verified against its API contracts.
import { APIResource } from '../core/resource.js';
import type { RequestOptions } from '../core/client.js';
import type { APIPromise } from '../core/api-promise.js';
import type { PagePromise } from '../core/pagination.js';
import { pathParam, requestHeaders } from './_utils.js';
import type { Environment, EnvironmentCreateParams, EnvironmentListParams, EnvironmentUpdateParams } from './types.js';

export class Environments extends APIResource {
  /**
   * 列出 Environment.
   *
   * @see Go EnvironmentService.List
   * @operation listEnvironment
   */
  list(params: EnvironmentListParams = {}, options?: RequestOptions): PagePromise<Environment> {
    const path = "environments";
    return this._client.getAPIList<Environment>(path, params, options, "page");
  }

  /**
   * 创建 Environment.
   *
   * @see Go EnvironmentService.New
   * @operation createEnvironment
   */
  create(params: EnvironmentCreateParams, options?: RequestOptions): APIPromise<Environment> {
    const path = "environments";
    const { idempotency_key, ...payload } = params;
    return this._client.request<Environment>({
      method: "POST",
      path,
      body: payload,
      ...options,
      headers: requestHeaders({ "Idempotency-Key": idempotency_key }, options?.headers),
    });
  }

  /**
   * 查询 Environment.
   *
   * @see Go EnvironmentService.Get
   * @operation getEnvironment
   */
  retrieve(id: string, options?: RequestOptions): APIPromise<Environment> {
    const path = `environments/${pathParam(id, "id")}`;
    return this._client.request<Environment>({
      method: "GET",
      path,
      ...options,
    });
  }

  /**
   * 修改 Environment.
   *
   * @see Go EnvironmentService.Update
   * @operation updateEnvironment
   */
  update(
    id: string,
    params: EnvironmentUpdateParams = {},
    options?: RequestOptions,
  ): APIPromise<Environment> {
    const path = `environments/${pathParam(id, "id")}`;
    return this._client.request<Environment>({
      method: "POST",
      path,
      body: params,
      ...options,
    });
  }

  /**
   * Archive an environment retained by historical sessions or tool calls.
   *
   * @see Go EnvironmentService.Archive
   * @operation archiveEnvironment
   */
  archive(id: string, options?: RequestOptions): APIPromise<Environment> {
    const path = `environments/${pathParam(id, "id")}/archive`;
    return this._client.request<Environment>({
      method: "POST",
      path,
      ...options,
    });
  }

  /**
   * 删除 Environment.
   *
   * @see Go EnvironmentService.Delete
   * @operation deleteEnvironment
   */
  delete(id: string, options?: RequestOptions): APIPromise<void> {
    const path = `environments/${pathParam(id, "id")}`;
    return this._client.request<void>({
      method: "DELETE",
      path,
      responseType: "void",
      ...options,
    });
  }

}

export type { Environment, EnvironmentCreateParams, EnvironmentListParams, EnvironmentUpdateParams } from './types.js';
