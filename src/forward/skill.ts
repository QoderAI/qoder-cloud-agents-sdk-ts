// Generated code, verified against the API contracts.
import { APIResource } from '../core/resource.js';
import type { RequestOptions } from '../core/client.js';
import type { SkillSearchParams } from './types.js';
import type { IdentityScopeOptions } from './types.js';
import type { APIPromise } from '../core/api-promise.js';
import type { PagePromise } from '../core/pagination.js';
import { toMultipartForm } from '../core/uploads.js';
import { pathParam, requestHeaders, identityScopeOptions } from './_utils.js';
import type { Skill, SkillCreateParams, SkillListParams, SkillRetrieveParams, SkillUpdateParams } from './types.js';
import { SkillVersions } from './skill-version.js';

export class Skills extends APIResource {
  readonly versions: SkillVersions = new SkillVersions(this._client);

  /** Search by metadata and resource filters; automatically enables the Search beta. */
  search(params: SkillSearchParams = {}, options?: RequestOptions): PagePromise<Skill> {
    const { identity_id, ...body } = params;
    return this._client.postAPIList<Skill>('skills/search', body, { ...options, query: { identity_id, ...options?.query } }, 'page', 'search-2026-08-31');
  }

  /**
   * 列出 Skill.
   *
   * @operation listSkill
   */
  list(params: SkillListParams = {}, options?: RequestOptions): PagePromise<Skill> {
    const path = "skills";
    return this._client.getAPIList<Skill>(path, params, options, "page");
  }

  /**
   * 创建 Skill.
   *
   * @operation createSkill
   */
  create(params: SkillCreateParams = {}, options?: RequestOptions): APIPromise<Skill> {
    const path = "skills";
    const { identity_id, idempotency_key, ...payload } = params;
    return this._client.request<Skill>({
      method: "POST",
      path,
      body: toMultipartForm(payload),
      ...options,
      query: { identity_id, ...options?.query },
      headers: requestHeaders({ "Idempotency-Key": idempotency_key }, options?.headers),
    });
  }

  /**
   * 查询 Skill.
   *
   * @operation getSkill
   */
  retrieve(id: string, params: SkillRetrieveParams = {}, options?: RequestOptions): APIPromise<Skill> {
    const path = `skills/${pathParam(id, "id")}`;
    return this._client.request<Skill>({
      method: "GET",
      path,
      ...options,
      query: { ...params, ...options?.query },
    });
  }

  /**
   * 修改 Skill.
   *
   * @operation updateSkill
   */
  update(id: string, params: SkillUpdateParams = {}, options?: RequestOptions): APIPromise<Skill> {
    const path = `skills/${pathParam(id, "id")}`;
    const { identity_id, ...payload } = params;
    return this._client.request<Skill>({
      method: "PUT",
      path,
      body: payload,
      ...options,
      query: { identity_id, ...options?.query },
    });
  }

  /**
   * 删除 Skill.
   *
   * @operation deleteSkill
   */
  delete(id: string, options?: IdentityScopeOptions): APIPromise<void> {
    const path = `skills/${pathParam(id, "id")}`;
    return this._client.request<void>({
      method: "DELETE",
      path,
      responseType: "void",
      ...identityScopeOptions(options),
    });
  }

}

export type { Skill, SkillCreateParams, SkillListParams, SkillRetrieveParams, SkillUpdateParams } from './types.js';

export type { SkillSearchParams } from './types.js';
