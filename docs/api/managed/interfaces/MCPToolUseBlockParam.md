[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [managed](../README.md) / MCPToolUseBlockParam

# Interface: MCPToolUseBlockParam

The properties ID, Input, Name, ServerName, Type are required.

## Properties

### cache\_control?

> `optional` **cache\_control?**: [`CacheControlEphemeralParam`](CacheControlEphemeralParam.md) \| `null`

Create a cache control breakpoint at this content block.

***

### id

> **id**: `string`

***

### input

> **input**: `unknown`

***

### name

> **name**: `string`

***

### server\_name

> **server\_name**: `string`

The name of the MCP server

***

### type?

> `optional` **type?**: `"mcp_tool_use"` \| `null`

This field can be elided, and will marshal its zero value as "mcp_tool_use".
