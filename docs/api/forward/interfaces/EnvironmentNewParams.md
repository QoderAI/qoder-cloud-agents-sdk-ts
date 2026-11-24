[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [forward](../README.md) / EnvironmentNewParams

# Interface: EnvironmentNewParams

## Indexable

> \[`key`: `string`\]: `unknown`

Additional fields are preserved verbatim by the SDK.

## Properties

### config?

> `optional` **config?**: `Record`\<`string`, `unknown`\> \| [`EnvironmentConfigParam`](../type-aliases/EnvironmentConfigParam.md) \| `null`

Runtime config; omit for cloud defaults. Explicit null/empty objects are invalid.
OSS buckets require X-Qoder-Beta: oss-bucket-2026-09-23 (Forward supports up to 7).

***

### description?

> `optional` **description?**: `string` \| `null`

描述。

***

### idempotency\_key?

> `optional` **idempotency\_key?**: `string` \| `null`

建议创建请求携带。相同 key 和相同请求可安全重试。

***

### identity\_id?

> `optional` **identity\_id?**: `string`

Select identity ownership with a PAT. Omit when using a SAT.

***

### metadata?

> `optional` **metadata?**: `Record`\<`string`, `unknown`\> \| `null`

[Environment metadata](./schemas.md#environment-metadata)；省略时为 `{}`，显式传入时不能为 `null`。

***

### name

> **name**: `string`

Environment 名称；去除首尾空白后不能为空。
