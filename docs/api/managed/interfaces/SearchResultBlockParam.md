[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [managed](../README.md) / SearchResultBlockParam

# Interface: SearchResultBlockParam

The properties Content, Source, Title, Type are required.

## Properties

### cache\_control?

> `optional` **cache\_control?**: [`CacheControlEphemeralParam`](CacheControlEphemeralParam.md) \| `null`

Create a cache control breakpoint at this content block.

***

### citations?

> `optional` **citations?**: [`CitationsConfigParam`](CitationsConfigParam.md) \| `null`

***

### content

> **content**: [`TextBlockParam`](TextBlockParam.md)[]

***

### source

> **source**: `string`

***

### title

> **title**: `string`

***

### type?

> `optional` **type?**: `"search_result"` \| `null`

This field can be elided, and will marshal its zero value as "search_result".
