[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [managed](../README.md) / ManagedAgentsUserCustomToolResultEvent

# Interface: ManagedAgentsUserCustomToolResultEvent

Event sent by the client providing the result of a custom tool execution.

## Properties

### content?

> `optional` **content?**: [`ManagedAgentsUserCustomToolResultEventContentUnion`](../type-aliases/ManagedAgentsUserCustomToolResultEventContentUnion.md)[]

The result content returned by the tool.

***

### custom\_tool\_use\_id

> **custom\_tool\_use\_id**: `string`

The id of the `agent.custom_tool_use` event this result corresponds to, which
can be found in the last `session.status_idle`
[event's](https://docs.qoder.com/cloud-agents/api/sessions/schemas)
`stop_reason.event_ids` field.

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

Routes this result to a subagent thread. Copy from the `agent.custom_tool_use`
event's `session_thread_id`.

***

### type

> **type**: `"user.custom_tool_result"`

Any of "user.custom_tool_result".
