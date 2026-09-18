[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [managed](../README.md) / AdvisorToolResultBlockParam

# Interface: AdvisorToolResultBlockParam

The properties Content, ToolUseID, Type are required.

## Properties

### cache\_control?

> `optional` **cache\_control?**: [`CacheControlEphemeralParam`](CacheControlEphemeralParam.md) \| `null`

Create a cache control breakpoint at this content block.

***

### content

> **content**: [`AdvisorToolResultBlockParamContentUnion`](../type-aliases/AdvisorToolResultBlockParamContentUnion.md)

***

### tool\_use\_id

> **tool\_use\_id**: `string`

***

### type?

> `optional` **type?**: `"advisor_tool_result"` \| `null`

This field can be elided, and will marshal its zero value as
"advisor_tool_result".
