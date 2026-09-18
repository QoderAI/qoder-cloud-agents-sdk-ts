[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [forward](../README.md) / EnvironmentUpdateParams

# Interface: EnvironmentUpdateParams

## Indexable

> \[`key`: `string`\]: `unknown`

Additional fields are preserved verbatim by the SDK.

## Properties

### config?

> `optional` **config?**: `Record`\<`string`, `unknown`\> \| `null`

新配置；传入时不能为 `null`，显式 `null` 返回 400。字段详见 schemas。

***

### description?

> `optional` **description?**: `string` \| `null`

新描述。

***

### metadata?

> `optional` **metadata?**: `Record`\<`string`, `unknown`\> \| `null`

要合并的 [Environment metadata](./schemas.md#environment-metadata)；传入时不能为 `null`，显式 `null` 返回 400。

***

### name?

> `optional` **name?**: `string` \| `null`

新名称。
