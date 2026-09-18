[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [managed](../README.md) / ManagedAgentsUserCustomToolResultEventParams

# Interface: ManagedAgentsUserCustomToolResultEventParams

Parameters for providing the result of a custom tool execution.

## Properties

### content?

> `optional` **content?**: [`ManagedAgentsUserCustomToolResultEventParamsContentUnion`](../type-aliases/ManagedAgentsUserCustomToolResultEventParamsContentUnion.md)[] \| `null`

The result content returned by the tool.

***

### custom\_tool\_use\_id

> **custom\_tool\_use\_id**: `string`

The id of the `agent.custom_tool_use` event this result corresponds to, which
can be found in the last `session.status_idle`
[event's](https://docs.qoder.com/cloud-agents/api/sessions/schemas)
`stop_reason.event_ids` field.

***

### is\_error?

> `optional` **is\_error?**: `boolean` \| `null`

Whether the tool execution resulted in an error.

***

### type

> **type**: `"user.custom_tool_result"`

Any of "user.custom_tool_result".
