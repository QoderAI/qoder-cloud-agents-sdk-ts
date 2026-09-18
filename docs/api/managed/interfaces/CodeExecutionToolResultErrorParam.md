[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [managed](../README.md) / CodeExecutionToolResultErrorParam

# Interface: CodeExecutionToolResultErrorParam

The properties ErrorCode, Type are required.

## Properties

### error\_code

> **error\_code**: `string`

Any of "invalid_tool_input", "unavailable", "too_many_requests",
"execution_time_exceeded".

***

### type?

> `optional` **type?**: `"code_execution_tool_result_error"` \| `null`

This field can be elided, and will marshal its zero value as
"code_execution_tool_result_error".
