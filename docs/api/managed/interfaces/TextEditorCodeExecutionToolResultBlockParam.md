[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [managed](../README.md) / TextEditorCodeExecutionToolResultBlockParam

# Interface: TextEditorCodeExecutionToolResultBlockParam

The properties Content, ToolUseID, Type are required.

## Properties

### cache\_control?

> `optional` **cache\_control?**: [`CacheControlEphemeralParam`](CacheControlEphemeralParam.md) \| `null`

Create a cache control breakpoint at this content block.

***

### content

> **content**: [`TextEditorCodeExecutionToolResultBlockParamContentUnion`](../type-aliases/TextEditorCodeExecutionToolResultBlockParamContentUnion.md)

***

### tool\_use\_id

> **tool\_use\_id**: `string`

***

### type?

> `optional` **type?**: `"text_editor_code_execution_tool_result"` \| `null`

This field can be elided, and will marshal its zero value as
"text_editor_code_execution_tool_result".
