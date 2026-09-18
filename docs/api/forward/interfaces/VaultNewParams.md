[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [forward](../README.md) / VaultNewParams

# Interface: VaultNewParams

## Indexable

> \[`key`: `string`\]: `unknown`

Additional fields are preserved verbatim by the SDK.

## Properties

### display\_name

> **display\_name**: `string`

Vault 展示名。

***

### idempotency\_key?

> `optional` **idempotency\_key?**: `string` \| `null`

可选创建请求幂等键。传入时相同 key 只能用于相同请求；不传时不提供本地幂等重放保护。

***

### metadata?

> `optional` **metadata?**: `Record`\<`string`, `unknown`\> \| `null`

元数据对象；`created_by` 为保留字段，不可传入（传入返回 400）。
