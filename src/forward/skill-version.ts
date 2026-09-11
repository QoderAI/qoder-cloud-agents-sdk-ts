// Generated code, verified against the API contracts.
import { APIResource } from '../core/resource.js';
import type { RequestOptions } from '../core/client.js';
import type { APIPromise } from '../core/api-promise.js';
import type { PagePromise } from '../core/pagination.js';
import { toMultipartForm } from '../core/uploads.js';
import { pathParam, requestHeaders } from './_utils.js';
import type { DeletedSkillVersion, SkillVersion, SkillVersionCreateParams, SkillVersionListParams } from './types.js';

export class SkillVersions extends APIResource {
  /**
   * 列出 Skill 版本.
   *
   * @operation listSkillVersion
   */
  list(id: string, params: SkillVersionListParams = {}, options?: RequestOptions): PagePromise<SkillVersion> {
    const path = `skills/${pathParam(id, "id")}/versions`;
    return this._client.getAPIList<SkillVersion>(path, params, options, "page");
  }

  /**
   * 创建 Skill 版本.
   *
   * @operation createSkillVersion
   */
  create(id: string, params: SkillVersionCreateParams, options?: RequestOptions): APIPromise<SkillVersion> {
    const path = `skills/${pathParam(id, "id")}/versions`;
    return this._client.request<SkillVersion>({
      method: "POST",
      path,
      body: toMultipartForm(params),
      ...options,
    });
  }

  /**
   * 查询 Skill 版本.
   *
   * @operation getSkillVersion
   */
  retrieve(id: string, version: string, options?: RequestOptions): APIPromise<SkillVersion> {
    const path = `skills/${pathParam(id, "id")}/versions/${pathParam(version, "version")}`;
    return this._client.request<SkillVersion>({
      method: "GET",
      path,
      ...options,
    });
  }

  /**
   * 删除 Skill 版本.
   *
   * @operation deleteSkillVersion
   */
  delete(id: string, version: string, options?: RequestOptions): APIPromise<DeletedSkillVersion> {
    const path = `skills/${pathParam(id, "id")}/versions/${pathParam(version, "version")}`;
    return this._client.request<DeletedSkillVersion>({
      method: "DELETE",
      path,
      ...options,
    });
  }

  /**
   * 下载 Skill 版本内容.
   *
   * @operation downloadSkillVersion
   */
  download(id: string, version: string, options?: RequestOptions): APIPromise<Response> {
    const path = `skills/${pathParam(id, "id")}/versions/${pathParam(version, "version")}/content`;
    return this._client.request<Response>({
      method: "GET",
      path,
      responseType: "response",
      ...options,
    });
  }

}

export type { DeletedSkillVersion, SkillVersion, SkillVersionCreateParams, SkillVersionListParams } from './types.js';
