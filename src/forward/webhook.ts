import { APIResource } from '../core/resource.js';
import type { RequestOptions } from '../core/client.js';
import type { APIPromise } from '../core/api-promise.js';
import type { PagePromise } from '../core/pagination.js';
import { pathParam, requestHeaders } from './_utils.js';

export interface WebhookEndpoint {
  id: string;
  url: string;
  events: string[];
  description?: string;
  metadata: Record<string, unknown>;
  active: boolean;
  created_at: string;
  updated_at: string;
  last_success_at?: string | null;
  last_failure_at?: string | null;
  disabled_reason?: string;
  consecutive_fail: number;
  [key: string]: unknown;
}
/** signing_secret is returned once. Store securely; do not log this response. */
export interface WebhookEndpointCreateResponse {
  id: string;
  url: string;
  events: string[];
  description?: string;
  metadata: Record<string, unknown>;
  active: boolean;
  created_at: string;
  signing_secret: string;
  [key: string]: unknown;
}
export interface WebhookEndpointCreateParams {
  url: string;
  events: string[];
  description?: string;
  metadata?: Record<string, string>;
  idempotency_key?: string;
}
export interface WebhookEndpointUpdateParams {
  url?: string;
  events?: string[];
  description?: string;
  active?: boolean;
  /** Merge entries; a null value removes the key. */
  metadata?: Record<string, string | null>;
}
export interface WebhookEndpointListParams { limit?: number; after_id?: string; }
/** Accepted delivery rows; not a delivery success report. */
export interface WebhookEndpointTestResponse { event_id: number; delivery_rows: number; [key: string]: unknown; }

/** Requires a PAT or administrator SAT. */
export class Webhooks extends APIResource { readonly endpoints = new WebhookEndpoints(this._client); }
export class WebhookEndpoints extends APIResource {
  /** Create webhook endpoints.
   * @operation createWebhookEndpoint
   */
  create(params: WebhookEndpointCreateParams, options?: RequestOptions): APIPromise<WebhookEndpointCreateResponse> {
    const path = 'webhook/endpoints';
    const { idempotency_key, ...body } = params;
    return this._client.request<WebhookEndpointCreateResponse>({
      method: "POST",
      path,
      body,
      ...options,
      headers: requestHeaders({ "Idempotency-Key": idempotency_key }, options?.headers)
    });
  }
  /** List webhook endpoints.
   * @operation listWebhookEndpoints
   */
  list(params: WebhookEndpointListParams = {}, options?: RequestOptions): PagePromise<WebhookEndpoint> {
    const path = 'webhook/endpoints';
    return this._client.getAPIList<WebhookEndpoint>(path, params, options, 'cursor');
  }
  /** Retrieve webhook endpoints.
   * @operation getWebhookEndpoint
   */
  retrieve(endpointID: string, options?: RequestOptions): APIPromise<WebhookEndpoint> {
    const path = `webhook/endpoints/${pathParam(endpointID, "endpointID")}`;
    return this._client.request<WebhookEndpoint>({
      method: "GET",
      path,
      ...options
    });
  }
  /** Update webhook endpoints.
   * @operation updateWebhookEndpoint
   */
  update(endpointID: string, params: WebhookEndpointUpdateParams = {}, options?: RequestOptions): APIPromise<WebhookEndpoint> {
    const path = `webhook/endpoints/${pathParam(endpointID, "endpointID")}`;
    return this._client.request<WebhookEndpoint>({
      method: "PUT",
      path,
      body: params,
      ...options
    });
  }
  /** Delete webhook endpoints.
   * @operation deleteWebhookEndpoint
   */
  delete(endpointID: string, options?: RequestOptions): APIPromise<void> {
    const path = `webhook/endpoints/${pathParam(endpointID, "endpointID")}`;
    return this._client.request<void>({
      method: "DELETE",
      path, responseType: "void",
      ...options
    });
  }
  /** Enable webhook endpoints.
   * @operation enableWebhookEndpoint
   */
  enable(endpointID: string, options?: RequestOptions): APIPromise<WebhookEndpoint> {
    const path = `webhook/endpoints/${pathParam(endpointID, "endpointID")}/enable`;
    return this._client.request<WebhookEndpoint>({
      method: "POST",
      path,
      ...options
    });
  }
  /** Disable webhook endpoints.
   * @operation disableWebhookEndpoint
   */
  disable(endpointID: string, options?: RequestOptions): APIPromise<WebhookEndpoint> {
    const path = `webhook/endpoints/${pathParam(endpointID, "endpointID")}/disable`;
    return this._client.request<WebhookEndpoint>({
      method: "POST",
      path,
      ...options
    });
  }
  /** Queue a synthetic event; acceptance does not confirm delivery.
   * @operation testWebhookEndpoint
   */
  test(endpointID: string, options?: RequestOptions): APIPromise<WebhookEndpointTestResponse> {
    const path = `webhook/endpoints/${pathParam(endpointID, "endpointID")}/test`;
    return this._client.request<WebhookEndpointTestResponse>({
      method: "POST",
      path,
      ...options
    });
  }
}
