[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [forward](../README.md) / EnvironmentUpdateParams

# Interface: EnvironmentUpdateParams

## Indexable

> \[`key`: `string`\]: `unknown`

Additional fields are preserved verbatim by the SDK.

## Properties

### config?

> `optional` **config?**: `Record`\<`string`, `unknown`\> \| [`EnvironmentConfigUpdateParam`](../type-aliases/EnvironmentConfigUpdateParam.md) \| `null`

Replaces the entire config; explicit null is invalid. Bucket credentials may be omitted to preserve them.
Removing buckets affects only new Sessions. Send X-Qoder-Beta: oss-bucket-2026-09-23 for OSS storage.

***

### description?

> `optional` **description?**: `string` \| `null`

新描述。

***

### identity\_id?

> `optional` **identity\_id?**: `string`

Select identity ownership with a PAT. Omit when using a SAT.

***

### metadata?

> `optional` **metadata?**: `Record`\<`string`, `unknown`\> \| `null`

要合并的 [Environment metadata](./schemas.md#environment-metadata)；传入时不能为 `null`，显式 `null` 返回 400。

***

### name?

> `optional` **name?**: `string` \| `null`

新名称。
