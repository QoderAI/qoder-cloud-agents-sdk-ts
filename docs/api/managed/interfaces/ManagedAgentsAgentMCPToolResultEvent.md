[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [managed](../README.md) / ManagedAgentsAgentMCPToolResultEvent

# Interface: ManagedAgentsAgentMCPToolResultEvent

Event representing the result of an MCP tool execution.

## Properties

### content?

> `optional` **content?**: [`ManagedAgentsAgentMCPToolResultEventContentUnion`](../type-aliases/ManagedAgentsAgentMCPToolResultEventContentUnion.md)[]

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

### mcp\_tool\_use\_id

> **mcp\_tool\_use\_id**: `string`

The id of the `agent.mcp_tool_use` event this result corresponds to.

***

### processed\_at

> **processed\_at**: `string`

A timestamp in RFC 3339 format

***

### type

> **type**: `"agent.mcp_tool_result"`

Any of "agent.mcp_tool_result".
