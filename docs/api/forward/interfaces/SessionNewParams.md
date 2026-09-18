[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [forward](../README.md) / SessionNewParams

# Interface: SessionNewParams

## Indexable

> \[`key`: `string`\]: `unknown`

Additional fields are preserved verbatim by the SDK.

## Properties

### config?

> `optional` **config?**: [`SessionNewParamsConfigParam`](SessionNewParamsConfigParam.md) \| `null`

***

### idempotency\_key?

> `optional` **idempotency\_key?**: `string` \| `null`

有副作用请求可选的幂等键。

***

### identity\_id

> **identity\_id**: `string`

Forward Identity ID。

***

### metadata?

> `optional` **metadata?**: `Record`\<`string`, `unknown`\> \| `null`

业务元数据。

***

### resources?

> `optional` **resources?**: [`SessionResourceSpecParam`](SessionResourceSpecParam.md)[] \| `null`

***

### template\_id

> **template\_id**: `string`

Forward Template ID。

***

### title?

> `optional` **title?**: `string` \| `null`

Session 标题。
