[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [forward](../README.md) / IdentityUpdateParams

# Interface: IdentityUpdateParams

## Indexable

> \[`key`: `string`\]: `unknown`

Additional fields are preserved verbatim by the SDK.

## Properties

### enabled?

> `optional` **enabled?**: `boolean` \| `null`

更新 Identity 是否可用。

***

### external\_id?

> `optional` **external\_id?**: `string` \| `null`

替换原有终端用户 ID。

***

### idempotency\_key?

> `optional` **idempotency\_key?**: `string` \| `null`

有副作用请求可选的幂等键。

***

### metadata?

> `optional` **metadata?**: `Record`\<`string`, `unknown`\> \| `null`

合并更新业务元数据；空字符串 value 删除对应 key。

***

### name?

> `optional` **name?**: `string` \| `null`

替换展示名。
