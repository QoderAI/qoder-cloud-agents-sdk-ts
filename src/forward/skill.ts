// Generated from the Go SDK and verified against its API contracts.
import { APIResource } from '../core/resource.js';
import type { RequestOptions } from '../core/client.js';
import type { APIPromise } from '../core/api-promise.js';
import type { PagePromise } from '../core/pagination.js';
import { toMultipartForm } from '../core/uploads.js';
import { pathParam, requestHeaders } from './_utils.js';
import type { Skill, SkillCreateParams, SkillListParams, SkillRetrieveParams, SkillUpdateParams } from './types.js';
import { SkillVersions } from './skill-version.js';

export class Skills extends APIResource {
  readonly versions: SkillVersions = new SkillVersions(this._client);

  /**
   * 列出 Skill.
   *
   * @see Go SkillService.List
   * @operation listSkill
   */
  list(params: SkillListParams = {}, options?: RequestOptions): PagePromise<Skill> {
    const path = "skills";
    return this._client.getAPIList<Skill>(path, params, options, "page");
  }

  /**
   * 创建 Skill.
   *
   * @see Go SkillService.New
   * @operation createSkill
   */
  create(params: SkillCreateParams = {}, options?: RequestOptions): APIPromise<Skill> {
    const path = "skills";
    const { idempotency_key, ...payload } = params;
    return this._client.request<Skill>({
      method: "POST",
      path,
      body: toMultipartForm(payload),
      ...options,
      headers: requestHeaders({ "Idempotency-Key": idempotency_key }, options?.headers),
    });
  }

  /**
   * 查询 Skill.
   *
   * @see Go SkillService.Get
   * @operation getSkill
   */
  retrieve(id: string, params: SkillRetrieveParams = {}, options?: RequestOptions): APIPromise<Skill> {
    const path = `skills/${pathParam(id, "id")}`;
    return this._client.request<Skill>({
      method: "GET",
      path,
      query: params,
      ...options,
    });
  }

  /**
   * 修改 Skill.
   *
   * @see Go SkillService.Update
   * @operation updateSkill
   */
  update(id: string, params: SkillUpdateParams = {}, options?: RequestOptions): APIPromise<Skill> {
    const path = `skills/${pathParam(id, "id")}`;
    return this._client.request<Skill>({
      method: "PUT",
      path,
      body: params,
      ...options,
    });
  }

  /**
   * 删除 Skill.
   *
   * @see Go SkillService.Delete
   * @operation deleteSkill
   */
  delete(id: string, options?: RequestOptions): APIPromise<void> {
    const path = `skills/${pathParam(id, "id")}`;
    return this._client.request<void>({
      method: "DELETE",
      path,
      responseType: "void",
      ...options,
    });
  }

}

export type { Skill, SkillCreateParams, SkillListParams, SkillRetrieveParams, SkillUpdateParams } from './types.js';
