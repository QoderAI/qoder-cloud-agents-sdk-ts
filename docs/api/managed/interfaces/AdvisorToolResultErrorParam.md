[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [managed](../README.md) / AdvisorToolResultErrorParam

# Interface: AdvisorToolResultErrorParam

The properties ErrorCode, Type are required.

## Properties

### error\_code

> **error\_code**: `string`

Any of "max_uses_exceeded", "prompt_too_long", "too_many_requests",
"overloaded", "unavailable", "execution_time_exceeded", "model_not_found".

***

### type?

> `optional` **type?**: `"advisor_tool_result_error"` \| `null`

This field can be elided, and will marshal its zero value as
"advisor_tool_result_error".
