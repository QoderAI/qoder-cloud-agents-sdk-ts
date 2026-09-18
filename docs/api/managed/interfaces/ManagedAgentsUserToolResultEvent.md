[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [managed](../README.md) / ManagedAgentsUserToolResultEvent

# Interface: ManagedAgentsUserToolResultEvent

Event sent by the client providing the result of an agent-toolset tool
execution. Only valid on `self_hosted` environments, where sandbox-routed tools
are executed by the client rather than the server.

## Properties

### content?

> `optional` **content?**: [`ManagedAgentsUserToolResultEventContentUnion`](../type-aliases/ManagedAgentsUserToolResultEventContentUnion.md)[]

The result content returned by the tool.

***

### id

> **id**: `string`

Unique identifier for this event.

***

### is\_error?

> `optional` **is\_error?**: `boolean` \| `null`

Whether the tool execution resulted in an error.

***

### processed\_at?

> `optional` **processed\_at?**: `string` \| `null`

A timestamp in RFC 3339 format

***

### session\_thread\_id?

> `optional` **session\_thread\_id?**: `string` \| `null`

Routes this result to a subagent thread. Copy from the `agent.tool_use` event's
`session_thread_id`.

***

### tool\_use\_id

> **tool\_use\_id**: `string`

The id of the `agent.tool_use` event this result corresponds to, which can be
found in the last `session.status_idle`
[event's](https://docs.qoder.com/cloud-agents/api/sessions/schemas)
`stop_reason.event_ids` field.

***

### type

> **type**: `"user.tool_result"`

Any of "user.tool_result".
