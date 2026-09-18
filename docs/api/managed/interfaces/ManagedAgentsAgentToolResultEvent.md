[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [managed](../README.md) / ManagedAgentsAgentToolResultEvent

# Interface: ManagedAgentsAgentToolResultEvent

Event representing the result of an agent tool execution.

## Properties

### content?

> `optional` **content?**: [`ManagedAgentsAgentToolResultEventContentUnion`](../type-aliases/ManagedAgentsAgentToolResultEventContentUnion.md)[]

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

### processed\_at

> **processed\_at**: `string`

A timestamp in RFC 3339 format

***

### tool\_use\_id

> **tool\_use\_id**: `string`

The id of the `agent.tool_use` event this result corresponds to.

***

### type

> **type**: `"agent.tool_result"`

Any of "agent.tool_result".
