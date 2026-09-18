[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [managed](../README.md) / ServerToolUseBlockParam

# Interface: ServerToolUseBlockParam

The properties ID, Input, Name, Type are required.

## Properties

### cache\_control?

> `optional` **cache\_control?**: [`CacheControlEphemeralParam`](CacheControlEphemeralParam.md) \| `null`

Create a cache control breakpoint at this content block.

***

### caller?

> `optional` **caller?**: [`ServerToolUseBlockParamCallerUnion`](../type-aliases/ServerToolUseBlockParamCallerUnion.md) \| `null`

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

Any of "advisor", "web_search", "web_fetch", "code_execution",
"bash_code_execution", "text_editor_code_execution", "tool_search_tool_regex",
"tool_search_tool_bm25".

***

### type?

> `optional` **type?**: `"server_tool_use"` \| `null`

This field can be elided, and will marshal its zero value as "server_tool_use".
