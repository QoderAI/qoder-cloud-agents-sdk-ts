[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [managed](../README.md) / RequestMCPToolResultBlockParam

# Interface: RequestMCPToolResultBlockParam

The properties ToolUseID, Type are required.

## Properties

### cache\_control?

> `optional` **cache\_control?**: [`CacheControlEphemeralParam`](CacheControlEphemeralParam.md) \| `null`

Create a cache control breakpoint at this content block.

***

### content?

> `optional` **content?**: [`RequestMCPToolResultBlockParamContentUnion`](../type-aliases/RequestMCPToolResultBlockParamContentUnion.md) \| `null`

***

### is\_error?

> `optional` **is\_error?**: `boolean` \| `null`

***

### tool\_use\_id

> **tool\_use\_id**: `string`

***

### type?

> `optional` **type?**: `"mcp_tool_result"` \| `null`

This field can be elided, and will marshal its zero value as "mcp_tool_result".
