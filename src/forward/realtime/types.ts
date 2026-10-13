/** Forward Realtime Beta protocol. Timestamp strings preserve nanosecond precision. */
export const REALTIME_VERSION = 'voice.realtime.v1' as const;
export type RealtimeVoice = 'longanqian' | 'longanlingxin' | 'longanlingxi' | 'longanxiaoxin' | 'longanlufeng';
export interface RealtimeConfig {
  audio?: { output?: { voice?: RealtimeVoice; [key: string]: unknown }; [key: string]: unknown };
  [key: string]: unknown;
}
export interface RealtimeConversationCreateParams {
  identity_id: string;
  template_id: string;
  /** Required header, omitted from the JSON body. */
  idempotency_key: string;
  title?: string | null;
  metadata?: Record<string, unknown> | null;
  config?: RealtimeConfig;
}
export interface RealtimeConversation {
  id: string;
  type: 'voice.conversation';
  status: 'ready';
  title: string | null;
  metadata: Record<string, unknown>;
  config: RealtimeConfig;
  created_at: string;
  updated_at: string;
  [key: string]: unknown;
}
export interface RealtimeHistoryParams {
  limit?: number;
  before?: string;
  types?: 'message' | 'work' | 'message,work';
}
export type RealtimeHistoryEventType = 'voice.user_message.completed' | 'voice.assistant_message.completed'
  | 'voice.assistant_message.interrupted' | 'voice.work.accepted' | 'voice.work.running'
  | 'voice.work.completed' | 'voice.work.failed' | 'voice.work.final_announcement' | (string & {});
export interface RealtimeHistoryEvent {
  id: string;
  type: RealtimeHistoryEventType;
  status: string;
  occurred_at: string;
  role?: string;
  text?: string;
  work_id?: string;
  objective?: string;
  result?: string;
  error?: { code: string; [key: string]: unknown };
  turn_id?: string;
  user_message_event_id?: string;
  announcement_id?: string;
  milestone_type?: string;
  [key: string]: unknown;
}
export interface RealtimeHistoryResponse {
  conversation: {
    id: string;
    title: string | null;
    initialization_status: string;
    metadata: Record<string, unknown>;
    created_at: string;
    updated_at: string;
    [key: string]: unknown;
  };
  events: RealtimeHistoryEvent[];
  page: { next_before: string | null; has_more: boolean; [key: string]: unknown };
  [key: string]: unknown;
}
export interface RealtimeAudioFormat { format: 'pcm16'; sample_rate: number; channels: 1; [key: string]: unknown }
export interface RealtimeReady {
  config: RealtimeConfig;
  provider: string;
  input_audio: RealtimeAudioFormat;
  output_audio: RealtimeAudioFormat;
  capabilities: { graceful_close: boolean; [key: string]: unknown };
  [key: string]: unknown;
}
export interface RealtimePlaybackReceipt { work_id?: string; announcement_id?: string }
export type RealtimeCloseOutcome = 'no_active_response' | 'no_content' | 'saved' | 'saved_interrupted';
export interface RealtimeClosed { request_id: string; outcome: RealtimeCloseOutcome }
export interface RealtimeErrorPayload { code: string; message: string; retryable?: boolean; retry_after_ms?: number; [key: string]: unknown }
export interface RealtimeServerPayloads {
  'voice.state': { state: string };
  'voice.ready': RealtimeReady;
  'voice.replaced': { reason: string };
  'transcript.delta': { role: string; text: string; item_id?: string; response_id?: string };
  'transcript.final': { role: string; text: string; item_id?: string; response_id?: string };
  'audio.delta': { audio: string };
  'audio.done': Record<string, never>;
  'playback.interrupt': { reason: string };
  'work.accepted': { status: 'accepted'; objective: string };
  'work.running': { status: 'running' };
  'work.progress': { kind: string; detail: string; title?: string; is_error?: boolean; event_id?: string };
  'work.milestone': { announcement_id: string; milestone_type: string; summary: string };
  'work.completed': { status: 'completed'; result: string; event_id?: string };
  'work.failed': { status: 'failed'; error: { code: string; [key: string]: unknown }; event_id?: string };
  pong: Record<string, never>;
  'connection.closed': RealtimeClosed;
  error: RealtimeErrorPayload;
}
export interface RealtimeEventEnvelope {
  version: typeof REALTIME_VERSION;
  event_id: string;
  sequence: number;
  conversation_id: string;
  timestamp: string;
  work_id?: string;
  announcement_id?: string;
  [key: string]: unknown;
}
export type RealtimeKnownEvent = { [K in keyof RealtimeServerPayloads]: RealtimeEventEnvelope & {
  type: K; payload: RealtimeServerPayloads[K] & Record<string, unknown>;
} }[keyof RealtimeServerPayloads];
/** Unknown Beta events retain their envelope and complete payload. */
export type RealtimeServerEvent = RealtimeKnownEvent | (RealtimeEventEnvelope & { type: string; payload: Record<string, unknown> });
export interface RealtimeClientEvent { version: typeof REALTIME_VERSION; type: string; payload: Record<string, unknown> }

/** Narrow a known event payload while continuing to allow future Beta event types. */
export function isRealtimeEvent<K extends keyof RealtimeServerPayloads>(event: RealtimeServerEvent, type: K): event is Extract<RealtimeKnownEvent, { type: K }> {
  return event.type === type;
}
