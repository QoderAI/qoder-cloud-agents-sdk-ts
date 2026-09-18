[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [managed](../README.md) / ToolUseBlockParam

# Interface: ToolUseBlockParam

The properties ID, Input, Name, Type are required.

## Properties

### cache\_control?

> `optional` **cache\_control?**: [`CacheControlEphemeralParam`](CacheControlEphemeralParam.md) \| `null`

Create a cache control breakpoint at this content block.

***

### caller?

> `optional` **caller?**: [`ToolUseBlockParamCallerUnion`](../type-aliases/ToolUseBlockParamCallerUnion.md) \| `null`

Tool invocation directly from the model.

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

### toolset\_name?

> `optional` **toolset\_name?**: `string` \| `null`

For a toolset member tool_use, the toolset family this member belongs to.

***

### type?

> `optional` **type?**: `"tool_use"` \| `null`

This field can be elided, and will marshal its zero value as "tool_use".
