[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [managed](../README.md) / TextBlockParam

# Interface: TextBlockParam

The properties Text, Type are required.

## Properties

### cache\_control?

> `optional` **cache\_control?**: [`CacheControlEphemeralParam`](CacheControlEphemeralParam.md) \| `null`

Create a cache control breakpoint at this content block.

***

### citations?

> `optional` **citations?**: [`TextCitationParamUnion`](../type-aliases/TextCitationParamUnion.md)[] \| `null`

***

### text

> **text**: `string`

***

### type?

> `optional` **type?**: `"text"` \| `null`

This field can be elided, and will marshal its zero value as "text".
