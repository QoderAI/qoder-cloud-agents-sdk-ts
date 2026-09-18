[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [forward](../README.md) / IdentityConfigUpsertParams

# Interface: IdentityConfigUpsertParams

## Indexable

> \[`key`: `string`\]: `unknown`

Additional fields are preserved verbatim by the SDK.

## Properties

### idempotency\_key?

> `optional` **idempotency\_key?**: `string` \| `null`

有副作用请求可选的幂等键。

***

### identity\_config

> **identity\_config**: [`IdentityConfigSpecParam`](IdentityConfigSpecParam.md)

用户级覆盖配置。

***

### metadata?

> `optional` **metadata?**: `Record`\<`string`, `unknown`\> \| `null`

业务元数据；传入时整体替换已有 metadata。

***

### name?

> `optional` **name?**: `string` \| `null`

Config 展示名。
