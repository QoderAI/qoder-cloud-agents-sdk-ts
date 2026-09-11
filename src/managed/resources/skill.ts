// Generated from qoder-cloud-agents-sdk-go/managed.
import { APIResource } from '../../core/resource.js';
import type { RequestOptions } from '../../core/client.js';
import type { APIPromise } from '../../core/api-promise.js';
import type { PagePromise } from '../../core/pagination.js';
import type { Stream } from '../../core/streaming.js';
import type * as Types from '../types.js';
import { splitParams, pathParam, managedMultipart } from '../internal.js';
import { SkillsVersions } from "./skill-version.js";

export class Skills extends APIResource {
  readonly versions = new SkillsVersions(this._client);

  /**
   * Create Skill
   */
  create(params: Types.SkillCreateParams, options?: RequestOptions): APIPromise<Types.Skill> {
    const request = splitParams(params, options, {"workspace_id": "qoder-workspace-id", "betas": "x-qoder-beta"}, []);
    return this._client.request<Types.Skill>({ ...request.options, method: "POST", path: "/skills", body: managedMultipart(request.values) });
  }

  /**
   * Get Skill
   */
  retrieve(skillID: string, params: Types.SkillRetrieveParams | null | undefined = {}, options?: RequestOptions): APIPromise<Types.Skill> {
    const request = splitParams(params, options, {"workspace_id": "qoder-workspace-id", "betas": "x-qoder-beta"}, []);
    return this._client.request<Types.Skill>({ ...request.options, method: "GET", path: `/skills/${pathParam(skillID, "skill_id")}` });
  }

  /**
   * List Skills
   */
  list(params: Types.SkillListParams | null | undefined = {}, options?: RequestOptions): PagePromise<Types.Skill> {
    const request = splitParams(params, options, {"workspace_id": "qoder-workspace-id", "betas": "x-qoder-beta"}, []);
    return this._client.getAPIList<Types.Skill>("/skills", request.values, request.options, 'page');
  }

  /**
   * Delete Skill
   */
  delete(skillID: string, params: Types.SkillDeleteParams | null | undefined = {}, options?: RequestOptions): APIPromise<Types.DeletedSkill> {
    const request = splitParams(params, options, {"workspace_id": "qoder-workspace-id", "betas": "x-qoder-beta"}, []);
    return this._client.request<Types.DeletedSkill>({ ...request.options, method: "DELETE", path: `/skills/${pathParam(skillID, "skill_id")}` });
  }
}

export default Skills;
export type { DeletedSkill, Skill, SkillSource, SkillSourceType, SkillNewParams, SkillGetParams, SkillListParams, SkillDeleteParams } from '../types.js';
