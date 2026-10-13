import { APIResource } from '../../core/resource.js';
import { RealtimeConversations } from './conversation.js';
import { RealtimeConnection, type RealtimeConnectOptions } from './connection.js';
/** Forward Realtime Beta. WebSocket transport is supported on Node.js only. */
export class Realtime extends APIResource {
  readonly conversations = new RealtimeConversations(this._client);
  connect(options: RealtimeConnectOptions): Promise<RealtimeConnection> { return RealtimeConnection.connect(this._client, options); }
}
