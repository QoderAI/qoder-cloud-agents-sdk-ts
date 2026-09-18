[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [managed](../README.md) / ToolChangeMCPToolReferenceParam

# Interface: ToolChangeMCPToolReferenceParam

Reference to a single MCP tool by its server and remote name — the same
`server_name`/`name` pair `mcp_tool_use` carries.

## Properties

### name

> **name**: `string`

***

### server\_name

> **server\_name**: `string`

***

### type?

> `optional` **type?**: `"mcp_tool_reference"` \| `null`

This field can be elided, and will marshal its zero value as
"mcp_tool_reference".
