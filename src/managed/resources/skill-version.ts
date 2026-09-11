// Generated code, verified against the API contracts.
import { APIResource } from '../../core/resource.js';
import type { RequestOptions } from '../../core/client.js';
import type { APIPromise } from '../../core/api-promise.js';
import type { PagePromise } from '../../core/pagination.js';
import type { Stream } from '../../core/streaming.js';
import type * as Types from '../types.js';
import { splitParams, pathParam, managedMultipart } from '../internal.js';

export class SkillsVersions extends APIResource {

  /**
   * Create Skill Version
   */
  create(skillID: string, params: Types.SkillVersionCreateParams, options?: RequestOptions): APIPromise<Types.SkillVersion> {
    const request = splitParams(params, options, {"workspace_id": "qoder-workspace-id", "betas": "x-qoder-beta"}, []);
    return this._client.request<Types.SkillVersion>({ ...request.options, method: "POST", path: `/skills/${pathParam(skillID, "skill_id")}/versions`, body: managedMultipart(request.values) });
  }

  /**
   * Get Skill Version
   */
  retrieve(version: string, params: Types.SkillVersionRetrieveParams, options?: RequestOptions): APIPromise<Types.SkillVersion> {
    const request = splitParams(params, options, {"workspace_id": "qoder-workspace-id", "betas": "x-qoder-beta"}, ["skill_id"]);
    return this._client.request<Types.SkillVersion>({ ...request.options, method: "GET", path: `/skills/${pathParam(params?.skill_id, "skill_id")}/versions/${pathParam(version, "version")}` });
  }

  /**
   * List Skill Versions
   */
  list(skillID: string, params: Types.SkillVersionListParams | null | undefined = {}, options?: RequestOptions): PagePromise<Types.SkillVersion> {
    const request = splitParams(params, options, {"workspace_id": "qoder-workspace-id", "betas": "x-qoder-beta"}, []);
    return this._client.getAPIList<Types.SkillVersion>(`/skills/${pathParam(skillID, "skill_id")}/versions`, request.values, request.options, 'page');
  }

  /**
   * Delete Skill Version
   */
  delete(version: string, params: Types.SkillVersionDeleteParams, options?: RequestOptions): APIPromise<Types.DeletedSkillVersion> {
    const request = splitParams(params, options, {"workspace_id": "qoder-workspace-id", "betas": "x-qoder-beta"}, ["skill_id"]);
    return this._client.request<Types.DeletedSkillVersion>({ ...request.options, method: "DELETE", path: `/skills/${pathParam(params?.skill_id, "skill_id")}/versions/${pathParam(version, "version")}` });
  }

  /**
   * Download a skill version's content as a zip archive.
   */
  download(version: string, params: Types.SkillVersionDownloadParams, options?: RequestOptions): APIPromise<Response> {
    const request = splitParams(params, options, {"workspace_id": "qoder-workspace-id", "betas": "x-qoder-beta"}, ["skill_id"]);
    if (!request.headers.has('Accept')) request.headers.set('Accept', "application/binary");
    return this._client.request<Response>({ ...request.options, method: "GET", path: `/skills/${pathParam(params?.skill_id, "skill_id")}/versions/${pathParam(version, "version")}/content`, responseType: 'response' });
  }
}

export default SkillsVersions;
export type { DeletedSkillVersion, SkillVersion, SkillVersionNewParams, SkillVersionGetParams, SkillVersionListParams, SkillVersionDeleteParams, SkillVersionDownloadParams } from '../types.js';
