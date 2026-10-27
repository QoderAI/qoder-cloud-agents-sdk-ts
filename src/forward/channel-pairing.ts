// Generated code, verified against the API contracts.
import { APIResource } from '../core/resource.js';
import type { RequestOptions } from '../core/client.js';
import type { PagePromise } from '../core/pagination.js';
import type { APIPromise } from '../core/api-promise.js';
import { pathParam, requestHeaders } from './_utils.js';
import type { ChannelPairing, ChannelPairingListParams, ChannelPairingUpdateParams, ChannelPairingCreateParams, DeletedChannelPairing } from './types.js';

export class ChannelPairings extends APIResource {
  list(params: ChannelPairingListParams = {}, options?: RequestOptions): PagePromise<ChannelPairing> {
    return this._client.getAPIList<ChannelPairing>('channel_pairings', params, options);
  }
  retrieve(pairingID: string, options?: RequestOptions): APIPromise<ChannelPairing> {
    return this._client.request<ChannelPairing>({
      ...options,
      method: 'GET',
      path: `channel_pairings/${pathParam(pairingID, 'pairing_id')}`,
    });
  }
  /** Change an active binding. Omitted fields retain their value. */
  update(pairingID: string, params: ChannelPairingUpdateParams, options?: RequestOptions): APIPromise<ChannelPairing> {
    return this._client.request<ChannelPairing>({
      ...options,
      method: 'POST',
      path: `channel_pairings/${pathParam(pairingID, 'pairing_id')}`,
      body: params,
    });
  }

  /**
   * 完成 Channel 配对.
   *
   * @operation pairChannel
   */
  create(params: ChannelPairingCreateParams, options?: RequestOptions): APIPromise<ChannelPairing> {
    const path = "channel_pairings";
    const { idempotency_key, ...payload } = params;
    return this._client.request<ChannelPairing>({
      method: "POST",
      path,
      body: payload,
      ...options,
      headers: requestHeaders({ "Idempotency-Key": idempotency_key }, options?.headers),
    });
  }

  /**
   * 解除 Channel 配对.
   *
   * @operation unpairChannel
   */
  delete(pairingID: string, options?: RequestOptions): APIPromise<DeletedChannelPairing> {
    const path = `channel_pairings/${pathParam(pairingID, "pairing_id")}`;
    return this._client.request<DeletedChannelPairing>({
      method: "DELETE",
      path,
      ...options,
    });
  }

}

export type { ChannelPairing, ChannelPairingListParams, ChannelPairingUpdateParams, ChannelPairingCreateParams, DeletedChannelPairing } from './types.js';
