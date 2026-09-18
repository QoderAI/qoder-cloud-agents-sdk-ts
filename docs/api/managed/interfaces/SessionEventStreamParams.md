[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [managed](../README.md) / SessionEventStreamParams

# Interface: SessionEventStreamParams

## Properties

### betas?

> `optional` **betas?**: `string`[]

Optional header to specify the beta version(s) you want to use.

***

### event\_deltas?

> `optional` **event\_deltas?**: [`ManagedAgentsDeltaType`](../type-aliases/ManagedAgentsDeltaType.md)[]

When set, this connection also receives streaming deltas (`event_start`,
`event_delta`) while an event is being produced, before the event itself
arrives. Deltas are best-effort; when the final event is produced it carries the
complete content. A model request that ends early (an error or interrupt)
produces no final event — its terminal `span.model_request_end` closes the
preview. Accepts one or more event types to preview and may be repeated:
`agent.message` streams `content_delta` fragments; `agent.thinking` is
start-only — a signal that the agent has begun extended thinking, concluded by
the `agent.thinking` event itself. Only previews of the requested event types
are sent.

***

### last\_event\_id?

> `optional` **last\_event\_id?**: `string` \| `null`

Resume after this event ID.

***

### workspace\_id?

> `optional` **workspace\_id?**: `string`
