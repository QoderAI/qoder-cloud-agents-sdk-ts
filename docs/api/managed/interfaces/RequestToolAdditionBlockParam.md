[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [managed](../README.md) / RequestToolAdditionBlockParam

# Interface: RequestToolAdditionBlockParam

Mid-conversation directive to surface a declared tool.

`tool` references a tool (or MCP toolset) by name from the request's `tools`; it
is offered to the model from this point in the conversation onward.

## Properties

### cache\_control?

> `optional` **cache\_control?**: [`CacheControlEphemeralParam`](CacheControlEphemeralParam.md) \| `null`

Create a cache control breakpoint at this content block.

***

### tool

> **tool**: [`RequestToolAdditionBlockToolUnionParam`](../type-aliases/RequestToolAdditionBlockToolUnionParam.md)

Reference to a single tool the caller declared directly in `tools[]`. Does not
accept the composed `{server}_{name}` form the server assigns to MCP-resolved
tools — use `mcp_tool_reference` or `mcp_toolset_reference` for those.

***

### type?

> `optional` **type?**: `"tool_addition"` \| `null`

This field can be elided, and will marshal its zero value as "tool_addition".
