[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [managed](../README.md) / WebSearchToolResultBlockParam

# Interface: WebSearchToolResultBlockParam

The properties Content, ToolUseID, Type are required.

## Properties

### cache\_control?

> `optional` **cache\_control?**: [`CacheControlEphemeralParam`](CacheControlEphemeralParam.md) \| `null`

Create a cache control breakpoint at this content block.

***

### caller?

> `optional` **caller?**: [`WebSearchToolResultBlockParamCallerUnion`](../type-aliases/WebSearchToolResultBlockParamCallerUnion.md) \| `null`

Tool invocation directly from the model.

***

### content

> **content**: [`WebSearchToolResultBlockParamContentUnion`](../type-aliases/WebSearchToolResultBlockParamContentUnion.md)

***

### tool\_use\_id

> **tool\_use\_id**: `string`

***

### type?

> `optional` **type?**: `"web_search_tool_result"` \| `null`

This field can be elided, and will marshal its zero value as
"web_search_tool_result".
