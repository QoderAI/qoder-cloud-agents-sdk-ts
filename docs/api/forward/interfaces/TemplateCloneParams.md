[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [forward](../README.md) / TemplateCloneParams

# Interface: TemplateCloneParams

## Indexable

> \[`key`: `string`\]: `unknown`

Additional fields are preserved verbatim by the SDK.

## Properties

### description?

> `optional` **description?**: `string` \| `null`

新 Template 描述；不传时沿用源描述。

***

### idempotency\_key?

> `optional` **idempotency\_key?**: `string` \| `null`

有副作用请求可选的幂等键。

***

### name?

> `optional` **name?**: `string` \| `null`

新 Template 名称；不传时使用 `<源名称> Copy <随机短 ID>`。
