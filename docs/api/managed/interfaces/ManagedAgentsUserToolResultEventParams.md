[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [managed](../README.md) / ManagedAgentsUserToolResultEventParams

# Interface: ManagedAgentsUserToolResultEventParams

Parameters for providing the result of an agent-toolset tool execution. Only
valid on `self_hosted` environments, where sandbox-routed tools are executed by
the client rather than the server.

## Properties

### content?

> `optional` **content?**: [`ManagedAgentsUserToolResultEventParamsContentUnion`](../type-aliases/ManagedAgentsUserToolResultEventParamsContentUnion.md)[] \| `null`

The result content returned by the tool.

***

### is\_error?

> `optional` **is\_error?**: `boolean` \| `null`

Whether the tool execution resulted in an error.

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
