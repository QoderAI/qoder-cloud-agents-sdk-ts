[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [managed](../README.md) / ToolChangeToolReferenceParam

# Interface: ToolChangeToolReferenceParam

Reference to a single tool the caller declared directly in `tools[]`. Does not
accept the composed `{server}_{name}` form the server assigns to MCP-resolved
tools — use `mcp_tool_reference` or `mcp_toolset_reference` for those.

## Properties

### name

> **name**: `string`

***

### type?

> `optional` **type?**: `"tool_reference"` \| `null`

This field can be elided, and will marshal its zero value as "tool_reference".
