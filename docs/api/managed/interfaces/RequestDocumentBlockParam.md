[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [managed](../README.md) / RequestDocumentBlockParam

# Interface: RequestDocumentBlockParam

The properties Source, Type are required.

## Properties

### cache\_control?

> `optional` **cache\_control?**: [`CacheControlEphemeralParam`](CacheControlEphemeralParam.md) \| `null`

Create a cache control breakpoint at this content block.

***

### citations?

> `optional` **citations?**: [`CitationsConfigParam`](CitationsConfigParam.md) \| `null`

***

### context?

> `optional` **context?**: `string` \| `null`

***

### source

> **source**: [`RequestDocumentBlockSourceUnionParam`](../type-aliases/RequestDocumentBlockSourceUnionParam.md)

***

### title?

> `optional` **title?**: `string` \| `null`

***

### type?

> `optional` **type?**: `"document"` \| `null`

This field can be elided, and will marshal its zero value as "document".
