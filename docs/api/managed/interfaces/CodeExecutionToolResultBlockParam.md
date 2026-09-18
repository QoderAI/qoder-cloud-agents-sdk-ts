[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [managed](../README.md) / CodeExecutionToolResultBlockParam

# Interface: CodeExecutionToolResultBlockParam

The properties Content, ToolUseID, Type are required.

## Properties

### cache\_control?

> `optional` **cache\_control?**: [`CacheControlEphemeralParam`](CacheControlEphemeralParam.md) \| `null`

Create a cache control breakpoint at this content block.

***

### content

> **content**: [`CodeExecutionToolResultBlockParamContentUnion`](../type-aliases/CodeExecutionToolResultBlockParamContentUnion.md)

Code execution result with encrypted stdout for PFC + web_search results.

***

### tool\_use\_id

> **tool\_use\_id**: `string`

***

### type?

> `optional` **type?**: `"code_execution_tool_result"` \| `null`

This field can be elided, and will marshal its zero value as
"code_execution_tool_result".
