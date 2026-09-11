// Generated from the Go SDK and verified against its API contracts.
import { APIResource } from '../core/resource.js';
import type { RequestOptions } from '../core/client.js';
import type { APIPromise } from '../core/api-promise.js';
import type { PagePromise } from '../core/pagination.js';
import { pathParam, requestHeaders } from './_utils.js';
import type { Channel, ChannelCreateParams, ChannelListParams, ChannelUpdateParams, DeletedChannel } from './types.js';
import { ChannelQRSessions } from './channel-qr-session.js';

export class Channels extends APIResource {
  readonly qrSessions: ChannelQRSessions = new ChannelQRSessions(this._client);

  /**
   * 列出 Channels.
   *
   * @see Go ChannelService.List
   * @operation listChannels
   */
  list(params: ChannelListParams = {}, options?: RequestOptions): PagePromise<Channel> {
    const path = "channels";
    return this._client.getAPIList<Channel>(path, params, options, "cursor");
  }

  /**
   * 创建 Channel.
   *
   * @see Go ChannelService.New
   * @operation createChannel
   */
  create(params: ChannelCreateParams, options?: RequestOptions): APIPromise<Channel> {
    const path = "channels";
    const { idempotency_key, ...payload } = params;
    return this._client.request<Channel>({
      method: "POST",
      path,
      body: payload,
      ...options,
      headers: requestHeaders({ "Idempotency-Key": idempotency_key }, options?.headers),
    });
  }

  /**
   * 获取 Channel.
   *
   * @see Go ChannelService.Get
   * @operation getChannel
   */
  retrieve(channelID: string, options?: RequestOptions): APIPromise<Channel> {
    const path = `channels/${pathParam(channelID, "channel_id")}`;
    return this._client.request<Channel>({
      method: "GET",
      path,
      ...options,
    });
  }

  /**
   * 更新 Channel.
   *
   * @see Go ChannelService.Update
   * @operation updateChannel
   */
  update(channelID: string, params: ChannelUpdateParams = {}, options?: RequestOptions): APIPromise<Channel> {
    const path = `channels/${pathParam(channelID, "channel_id")}`;
    const { idempotency_key, ...payload } = params;
    return this._client.request<Channel>({
      method: "POST",
      path,
      body: payload,
      ...options,
      headers: requestHeaders({ "Idempotency-Key": idempotency_key }, options?.headers),
    });
  }

  /**
   * 删除 Channel.
   *
   * @see Go ChannelService.Delete
   * @operation deleteChannel
   */
  delete(channelID: string, options?: RequestOptions): APIPromise<DeletedChannel> {
    const path = `channels/${pathParam(channelID, "channel_id")}`;
    return this._client.request<DeletedChannel>({
      method: "DELETE",
      path,
      ...options,
    });
  }

}

export type { Channel, ChannelCreateParams, ChannelListParams, ChannelUpdateParams, DeletedChannel } from './types.js';
