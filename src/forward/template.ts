// Generated code, verified against the API contracts.
import { APIResource } from '../core/resource.js';
import type { RequestOptions } from '../core/client.js';
import type { APIPromise } from '../core/api-promise.js';
import type { PagePromise } from '../core/pagination.js';
import { pathParam, requestHeaders } from './_utils.js';
import type { Template, TemplateArchiveParams, TemplateCloneParams, TemplateCreateParams, TemplateListParams, TemplateUpdateParams } from './types.js';

export class Templates extends APIResource {
  /**
   * 列出 Templates.
   *
   * @operation listTemplates
   */
  list(params: TemplateListParams = {}, options?: RequestOptions): PagePromise<Template> {
    const path = "templates";
    return this._client.getAPIList<Template>(path, params, options, "cursor");
  }

  /**
   * 创建 Template.
   *
   * @operation createTemplate
   */
  create(params: TemplateCreateParams, options?: RequestOptions): APIPromise<Template> {
    const path = "templates";
    const { idempotency_key, x_qoder_beta, ...payload } = params;
    return this._client.request<Template>({
      method: "POST",
      path,
      body: payload,
      ...options,
      headers: requestHeaders({ "Idempotency-Key": idempotency_key, "X-Qoder-Beta": x_qoder_beta }, options?.headers),
    });
  }

  /**
   * 获取 Template.
   *
   * @operation getTemplate
   */
  retrieve(templateID: string, options?: RequestOptions): APIPromise<Template> {
    const path = `templates/${pathParam(templateID, "template_id")}`;
    return this._client.request<Template>({
      method: "GET",
      path,
      ...options,
    });
  }

  /**
   * 更新 Template.
   *
   * @operation updateTemplate
   */
  update(
    templateID: string,
    params: TemplateUpdateParams = {},
    options?: RequestOptions,
  ): APIPromise<Template> {
    const path = `templates/${pathParam(templateID, "template_id")}`;
    const { idempotency_key, x_qoder_beta, ...payload } = params;
    return this._client.request<Template>({
      method: "POST",
      path,
      body: payload,
      ...options,
      headers: requestHeaders({ "Idempotency-Key": idempotency_key, "X-Qoder-Beta": x_qoder_beta }, options?.headers),
    });
  }

  /**
   * 归档 Template.
   *
   * @operation archiveTemplate
   */
  archive(
    templateID: string,
    params: TemplateArchiveParams = {},
    options?: RequestOptions,
  ): APIPromise<Template> {
    const path = `templates/${pathParam(templateID, "template_id")}/archive`;
    const { idempotency_key, ...payload } = params;
    return this._client.request<Template>({
      method: "POST",
      path,
      ...options,
      headers: requestHeaders({ "Idempotency-Key": idempotency_key }, options?.headers),
    });
  }

  /**
   * 克隆 Template.
   *
   * @operation cloneTemplate
   */
  clone(
    templateID: string,
    params: TemplateCloneParams = {},
    options?: RequestOptions,
  ): APIPromise<Template> {
    const path = `templates/${pathParam(templateID, "template_id")}/clone`;
    const { idempotency_key, ...payload } = params;
    return this._client.request<Template>({
      method: "POST",
      path,
      body: payload,
      ...options,
      headers: requestHeaders({ "Idempotency-Key": idempotency_key }, options?.headers),
    });
  }

}

export type { Template, TemplateArchiveParams, TemplateCloneParams, TemplateCreateParams, TemplateListParams, TemplateUpdateParams } from './types.js';
