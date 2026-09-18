[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [managed](../README.md) / BashCodeExecutionToolResultErrorParam

# Interface: BashCodeExecutionToolResultErrorParam

The properties ErrorCode, Type are required.

## Properties

### error\_code

> **error\_code**: `string`

Any of "invalid_tool_input", "unavailable", "too_many_requests",
"execution_time_exceeded", "output_file_too_large".

***

### type?

> `optional` **type?**: `"bash_code_execution_tool_result_error"` \| `null`

This field can be elided, and will marshal its zero value as
"bash_code_execution_tool_result_error".
