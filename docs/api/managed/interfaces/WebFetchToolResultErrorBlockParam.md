[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [managed](../README.md) / WebFetchToolResultErrorBlockParam

# Interface: WebFetchToolResultErrorBlockParam

The properties ErrorCode, Type are required.

## Properties

### error\_code

> **error\_code**: `string`

Any of "invalid_tool_input", "url_too_long", "url_not_allowed",
"url_not_in_prior_context", "url_not_accessible", "unsupported_content_type",
"too_many_requests", "max_uses_exceeded", "unavailable".

***

### type?

> `optional` **type?**: `"web_fetch_tool_result_error"` \| `null`

This field can be elided, and will marshal its zero value as
"web_fetch_tool_result_error".
