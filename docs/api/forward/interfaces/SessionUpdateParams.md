[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [forward](../README.md) / SessionUpdateParams

# Interface: SessionUpdateParams

## Indexable

> \[`key`: `string`\]: `unknown`

Additional fields are preserved verbatim by the SDK.

## Properties

### config?

> `optional` **config?**: [`SessionUpdateParamsConfigParam`](SessionUpdateParamsConfigParam.md) \| `null`

***

### idempotency\_key?

> `optional` **idempotency\_key?**: `string` \| `null`

有副作用请求可选的幂等键。

***

### metadata?

> `optional` **metadata?**: `Record`\<`string`, `unknown`\> \| `null`

metadata merge patch；传入的 key 覆盖已有 key，未出现的 key 保留。

***

### title?

> `optional` **title?**: `string` \| `null`

新的 Session 标题。
