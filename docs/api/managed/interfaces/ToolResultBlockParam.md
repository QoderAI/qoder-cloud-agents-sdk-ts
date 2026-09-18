[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [managed](../README.md) / ToolResultBlockParam

# Interface: ToolResultBlockParam

The properties ToolUseID, Type are required.

## Properties

### cache\_control?

> `optional` **cache\_control?**: [`CacheControlEphemeralParam`](CacheControlEphemeralParam.md) \| `null`

Create a cache control breakpoint at this content block.

***

### content?

> `optional` **content?**: [`ToolResultBlockParamContentUnion`](../type-aliases/ToolResultBlockParamContentUnion.md)[] \| `null`

***

### is\_error?

> `optional` **is\_error?**: `boolean` \| `null`

***

### tool\_use\_id

> **tool\_use\_id**: `string`

***

### toolset\_name?

> `optional` **toolset\_name?**: `string` \| `null`

For a toolset member tool_result, the toolset family of the paired tool_use.

***

### type?

> `optional` **type?**: `"tool_result"` \| `null`

This field can be elided, and will marshal its zero value as "tool_result".
