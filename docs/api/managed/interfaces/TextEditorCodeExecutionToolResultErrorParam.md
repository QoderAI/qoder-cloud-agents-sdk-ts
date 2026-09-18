[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [managed](../README.md) / TextEditorCodeExecutionToolResultErrorParam

# Interface: TextEditorCodeExecutionToolResultErrorParam

The properties ErrorCode, Type are required.

## Properties

### error\_code

> **error\_code**: `string`

Any of "invalid_tool_input", "unavailable", "too_many_requests",
"execution_time_exceeded", "file_not_found".

***

### error\_message?

> `optional` **error\_message?**: `string` \| `null`

***

### type?

> `optional` **type?**: `"text_editor_code_execution_tool_result_error"` \| `null`

This field can be elided, and will marshal its zero value as
"text_editor_code_execution_tool_result_error".
