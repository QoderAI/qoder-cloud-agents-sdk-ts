[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [managed](../README.md) / WebSearchToolRequestErrorParam

# Interface: WebSearchToolRequestErrorParam

The properties ErrorCode, Type are required.

## Properties

### error\_code

> **error\_code**: `string`

Any of "invalid_tool_input", "unavailable", "max_uses_exceeded",
"too_many_requests", "query_too_long", "request_too_large".

***

### type?

> `optional` **type?**: `"web_search_tool_result_error"` \| `null`

This field can be elided, and will marshal its zero value as
"web_search_tool_result_error".
