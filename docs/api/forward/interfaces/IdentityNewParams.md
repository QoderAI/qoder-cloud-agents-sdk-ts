[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [forward](../README.md) / IdentityNewParams

# Interface: IdentityNewParams

## Indexable

> \[`key`: `string`\]: `unknown`

Additional fields are preserved verbatim by the SDK.

## Properties

### enabled?

> `optional` **enabled?**: `boolean` \| `null`

是否启用该 Identity，默认 `true`。

***

### external\_id

> **external\_id**: `string`

集成方系统中的终端用户 ID，不能是空串或纯空白。

***

### idempotency\_key?

> `optional` **idempotency\_key?**: `string` \| `null`

有副作用请求可选的幂等键。

***

### metadata?

> `optional` **metadata?**: `Record`\<`string`, `unknown`\> \| `null`

业务元数据，建议最多 16 个 key。

***

### name?

> `optional` **name?**: `string` \| `null`

展示名，传入时不能是空串或纯空白。
