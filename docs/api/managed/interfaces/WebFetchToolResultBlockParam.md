[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [managed](../README.md) / WebFetchToolResultBlockParam

# Interface: WebFetchToolResultBlockParam

The properties Content, ToolUseID, Type are required.

## Properties

### cache\_control?

> `optional` **cache\_control?**: [`CacheControlEphemeralParam`](CacheControlEphemeralParam.md) \| `null`

Create a cache control breakpoint at this content block.

***

### caller?

> `optional` **caller?**: [`WebFetchToolResultBlockParamCallerUnion`](../type-aliases/WebFetchToolResultBlockParamCallerUnion.md) \| `null`

Tool invocation directly from the model.

***

### content

> **content**: [`WebFetchToolResultBlockParamContentUnion`](../type-aliases/WebFetchToolResultBlockParamContentUnion.md)

***

### tool\_use\_id

> **tool\_use\_id**: `string`

***

### type?

> `optional` **type?**: `"web_fetch_tool_result"` \| `null`

This field can be elided, and will marshal its zero value as
"web_fetch_tool_result".
