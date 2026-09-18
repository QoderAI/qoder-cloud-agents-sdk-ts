[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [managed](../README.md) / ToolSearchToolResultErrorParam

# Interface: ToolSearchToolResultErrorParam

The properties ErrorCode, Type are required.

## Properties

### error\_code

> **error\_code**: `string`

Any of "invalid_tool_input", "unavailable", "too_many_requests",
"execution_time_exceeded".

***

### error\_message?

> `optional` **error\_message?**: `string` \| `null`

***

### type?

> `optional` **type?**: `"tool_search_tool_result_error"` \| `null`

This field can be elided, and will marshal its zero value as
"tool_search_tool_result_error".
