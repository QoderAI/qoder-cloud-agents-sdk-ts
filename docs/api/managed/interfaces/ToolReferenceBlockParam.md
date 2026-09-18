[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [managed](../README.md) / ToolReferenceBlockParam

# Interface: ToolReferenceBlockParam

Tool reference block that can be included in tool_result content.

## Properties

### cache\_control?

> `optional` **cache\_control?**: [`CacheControlEphemeralParam`](CacheControlEphemeralParam.md) \| `null`

Create a cache control breakpoint at this content block.

***

### tool\_name

> **tool\_name**: `string`

***

### type?

> `optional` **type?**: `"tool_reference"` \| `null`

This field can be elided, and will marshal its zero value as "tool_reference".
