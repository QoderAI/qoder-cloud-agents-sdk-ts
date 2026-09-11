// Generated from the Go SDK and verified against its API contracts.
import { APIResource } from '../core/resource.js';
import type { RequestOptions } from '../core/client.js';
import type { APIPromise } from '../core/api-promise.js';
import type { PagePromise } from '../core/pagination.js';
import { pathParam, requestHeaders } from './_utils.js';
import type { EffectiveConfig, IdentityConfig, IdentityConfigListParams, IdentityConfigUpsertParams } from './types.js';

export class IdentityConfigs extends APIResource {
  /**
   * 列出 Identity Configs.
   *
   * @see Go IdentityConfigService.List
   * @operation listIdentityConfigs
   */
  list(
    identityID: string,
    params: IdentityConfigListParams = {},
    options?: RequestOptions,
  ): PagePromise<IdentityConfig> {
    const path = `identities/${pathParam(identityID, "identity_id")}/templates`;
    return this._client.getAPIList<IdentityConfig>(path, params, options, "cursor");
  }

  /**
   * 获取 Identity Config.
   *
   * @see Go IdentityConfigService.Get
   * @operation getIdentityConfig
   */
  retrieve(identityID: string, templateID: string, options?: RequestOptions): APIPromise<IdentityConfig> {
    const path = `identities/${pathParam(identityID, "identity_id")}/templates/${pathParam(templateID, "template_id")}/config`;
    return this._client.request<IdentityConfig>({
      method: "GET",
      path,
      ...options,
    });
  }

  /**
   * 创建或更新 Identity Config.
   *
   * @see Go IdentityConfigService.Upsert
   * @operation upsertIdentityConfig
   */
  upsert(
    identityID: string,
    templateID: string,
    params: IdentityConfigUpsertParams,
    options?: RequestOptions,
  ): APIPromise<IdentityConfig> {
    const path = `identities/${pathParam(identityID, "identity_id")}/templates/${pathParam(templateID, "template_id")}/config`;
    const { idempotency_key, ...payload } = params;
    return this._client.request<IdentityConfig>({
      method: "POST",
      path,
      body: payload,
      ...options,
      headers: requestHeaders({ "Idempotency-Key": idempotency_key }, options?.headers),
    });
  }

  /**
   * 获取 Effective Config.
   *
   * @see Go IdentityConfigService.GetEffective
   * @operation getEffectiveConfig
   */
  getEffective(
    identityID: string,
    templateID: string,
    options?: RequestOptions,
  ): APIPromise<EffectiveConfig> {
    const path = `identities/${pathParam(identityID, "identity_id")}/templates/${pathParam(templateID, "template_id")}/effective`;
    return this._client.request<EffectiveConfig>({
      method: "GET",
      path,
      ...options,
    });
  }

}

export type { EffectiveConfig, IdentityConfig, IdentityConfigListParams, IdentityConfigUpsertParams } from './types.js';
