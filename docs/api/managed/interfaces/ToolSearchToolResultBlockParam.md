[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [managed](../README.md) / ToolSearchToolResultBlockParam

# Interface: ToolSearchToolResultBlockParam

The properties Content, ToolUseID, Type are required.

## Properties

### cache\_control?

> `optional` **cache\_control?**: [`CacheControlEphemeralParam`](CacheControlEphemeralParam.md) \| `null`

Create a cache control breakpoint at this content block.

***

### content

> **content**: [`ToolSearchToolResultBlockParamContentUnion`](../type-aliases/ToolSearchToolResultBlockParamContentUnion.md)

***

### tool\_use\_id

> **tool\_use\_id**: `string`

***

### type?

> `optional` **type?**: `"tool_search_tool_result"` \| `null`

This field can be elided, and will marshal its zero value as
"tool_search_tool_result".
