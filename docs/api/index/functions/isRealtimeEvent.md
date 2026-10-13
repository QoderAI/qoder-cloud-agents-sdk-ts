[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [index](../README.md) / isRealtimeEvent

# Function: isRealtimeEvent()

> **isRealtimeEvent**\<`K`\>(`event`, `type`): event is Extract\<RealtimeEventEnvelope & \{ payload: RealtimeErrorPayload & Record\<string, unknown\>; type: "error" \}, \{ type: K \}\> \| Extract\<RealtimeEventEnvelope & \{ payload: \{ state: string \} & Record\<string, unknown\>; type: "voice.state" \}, \{ type: K \}\> \| Extract\<RealtimeEventEnvelope & \{ payload: RealtimeReady & Record\<string, unknown\>; type: "voice.ready" \}, \{ type: K \}\> \| Extract\<RealtimeEventEnvelope & \{ payload: \{ reason: string \} & Record\<string, unknown\>; type: "voice.replaced" \}, \{ type: K \}\> \| Extract\<RealtimeEventEnvelope & \{ payload: \{ item\_id?: string; response\_id?: string; role: string; text: string \} & Record\<string, unknown\>; type: "transcript.delta" \}, \{ type: K \}\> \| Extract\<RealtimeEventEnvelope & \{ payload: \{ item\_id?: string; response\_id?: string; role: string; text: string \} & Record\<string, unknown\>; type: "transcript.final" \}, \{ type: K \}\> \| Extract\<RealtimeEventEnvelope & \{ payload: \{ audio: string \} & Record\<string, unknown\>; type: "audio.delta" \}, \{ type: K \}\> \| Extract\<RealtimeEventEnvelope & \{ payload: Record\<string, never\> & Record\<string, unknown\>; type: "audio.done" \}, \{ type: K \}\> \| Extract\<RealtimeEventEnvelope & \{ payload: \{ reason: string \} & Record\<string, unknown\>; type: "playback.interrupt" \}, \{ type: K \}\> \| Extract\<RealtimeEventEnvelope & \{ payload: \{ objective: string; status: "accepted" \} & Record\<string, unknown\>; type: "work.accepted" \}, \{ type: K \}\> \| Extract\<RealtimeEventEnvelope & \{ payload: \{ status: "running" \} & Record\<string, unknown\>; type: "work.running" \}, \{ type: K \}\> \| Extract\<RealtimeEventEnvelope & \{ payload: \{ detail: string; event\_id?: string; is\_error?: boolean; kind: string; title?: string \} & Record\<string, unknown\>; type: "work.progress" \}, \{ type: K \}\> \| Extract\<RealtimeEventEnvelope & \{ payload: \{ announcement\_id: string; milestone\_type: string; summary: string \} & Record\<string, unknown\>; type: "work.milestone" \}, \{ type: K \}\> \| Extract\<RealtimeEventEnvelope & \{ payload: \{ event\_id?: string; result: string; status: "completed" \} & Record\<string, unknown\>; type: "work.completed" \}, \{ type: K \}\> \| Extract\<RealtimeEventEnvelope & \{ payload: \{ error: \{ code: string; \[key: string\]: unknown \}; event\_id?: string; status: "failed" \} & Record\<string, unknown\>; type: "work.failed" \}, \{ type: K \}\> \| Extract\<RealtimeEventEnvelope & \{ payload: Record\<string, never\> & Record\<string, unknown\>; type: "pong" \}, \{ type: K \}\> \| Extract\<RealtimeEventEnvelope & \{ payload: RealtimeClosed & Record\<string, unknown\>; type: "connection.closed" \}, \{ type: K \}\>

Narrow a known event payload while continuing to allow future Beta event types.

## Type Parameters

### K

`K` *extends* keyof [`RealtimeServerPayloads`](../interfaces/RealtimeServerPayloads.md)

## Parameters

### event

[`RealtimeServerEvent`](../type-aliases/RealtimeServerEvent.md)

### type

`K`

## Returns

event is Extract\<RealtimeEventEnvelope & \{ payload: RealtimeErrorPayload & Record\<string, unknown\>; type: "error" \}, \{ type: K \}\> \| Extract\<RealtimeEventEnvelope & \{ payload: \{ state: string \} & Record\<string, unknown\>; type: "voice.state" \}, \{ type: K \}\> \| Extract\<RealtimeEventEnvelope & \{ payload: RealtimeReady & Record\<string, unknown\>; type: "voice.ready" \}, \{ type: K \}\> \| Extract\<RealtimeEventEnvelope & \{ payload: \{ reason: string \} & Record\<string, unknown\>; type: "voice.replaced" \}, \{ type: K \}\> \| Extract\<RealtimeEventEnvelope & \{ payload: \{ item\_id?: string; response\_id?: string; role: string; text: string \} & Record\<string, unknown\>; type: "transcript.delta" \}, \{ type: K \}\> \| Extract\<RealtimeEventEnvelope & \{ payload: \{ item\_id?: string; response\_id?: string; role: string; text: string \} & Record\<string, unknown\>; type: "transcript.final" \}, \{ type: K \}\> \| Extract\<RealtimeEventEnvelope & \{ payload: \{ audio: string \} & Record\<string, unknown\>; type: "audio.delta" \}, \{ type: K \}\> \| Extract\<RealtimeEventEnvelope & \{ payload: Record\<string, never\> & Record\<string, unknown\>; type: "audio.done" \}, \{ type: K \}\> \| Extract\<RealtimeEventEnvelope & \{ payload: \{ reason: string \} & Record\<string, unknown\>; type: "playback.interrupt" \}, \{ type: K \}\> \| Extract\<RealtimeEventEnvelope & \{ payload: \{ objective: string; status: "accepted" \} & Record\<string, unknown\>; type: "work.accepted" \}, \{ type: K \}\> \| Extract\<RealtimeEventEnvelope & \{ payload: \{ status: "running" \} & Record\<string, unknown\>; type: "work.running" \}, \{ type: K \}\> \| Extract\<RealtimeEventEnvelope & \{ payload: \{ detail: string; event\_id?: string; is\_error?: boolean; kind: string; title?: string \} & Record\<string, unknown\>; type: "work.progress" \}, \{ type: K \}\> \| Extract\<RealtimeEventEnvelope & \{ payload: \{ announcement\_id: string; milestone\_type: string; summary: string \} & Record\<string, unknown\>; type: "work.milestone" \}, \{ type: K \}\> \| Extract\<RealtimeEventEnvelope & \{ payload: \{ event\_id?: string; result: string; status: "completed" \} & Record\<string, unknown\>; type: "work.completed" \}, \{ type: K \}\> \| Extract\<RealtimeEventEnvelope & \{ payload: \{ error: \{ code: string; \[key: string\]: unknown \}; event\_id?: string; status: "failed" \} & Record\<string, unknown\>; type: "work.failed" \}, \{ type: K \}\> \| Extract\<RealtimeEventEnvelope & \{ payload: Record\<string, never\> & Record\<string, unknown\>; type: "pong" \}, \{ type: K \}\> \| Extract\<RealtimeEventEnvelope & \{ payload: RealtimeClosed & Record\<string, unknown\>; type: "connection.closed" \}, \{ type: K \}\>
