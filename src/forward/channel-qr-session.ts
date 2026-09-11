// Generated from the Go SDK and verified against its API contracts.
import { APIResource } from '../core/resource.js';
import type { RequestOptions } from '../core/client.js';
import type { APIPromise } from '../core/api-promise.js';
import { pathParam, requestHeaders } from './_utils.js';
import type { ChannelQRSession, ChannelQRSessionCreateParams } from './types.js';

export class ChannelQRSessions extends APIResource {
  /**
   * 创建 Channel QR Session.
   *
   * @see Go ChannelQRSessionService.New
   * @operation createChannelQrSession
   */
  create(
    channelID: string,
    params: ChannelQRSessionCreateParams = {},
    options?: RequestOptions,
  ): APIPromise<ChannelQRSession> {
    const path = `channels/${pathParam(channelID, "channel_id")}/qr_sessions`;
    const { idempotency_key, ...payload } = params;
    return this._client.request<ChannelQRSession>({
      method: "POST",
      path,
      ...options,
      headers: requestHeaders({ "Idempotency-Key": idempotency_key }, options?.headers),
    });
  }

  /**
   * 获取 Channel QR Session.
   *
   * @see Go ChannelQRSessionService.Get
   * @operation getChannelQrSession
   */
  retrieve(sessionKey: string, options?: RequestOptions): APIPromise<ChannelQRSession> {
    const path = `qr_sessions/${pathParam(sessionKey, "session_key")}`;
    return this._client.request<ChannelQRSession>({
      method: "GET",
      path,
      ...options,
    });
  }

}

export type { ChannelQRSession, ChannelQRSessionCreateParams } from './types.js';
