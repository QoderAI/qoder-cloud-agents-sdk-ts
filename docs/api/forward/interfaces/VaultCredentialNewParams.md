[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [forward](../README.md) / VaultCredentialNewParams

# Interface: VaultCredentialNewParams

## Indexable

> \[`key`: `string`\]: `unknown`

Additional fields are preserved verbatim by the SDK.

## Properties

### auth

> **auth**: `Record`\<`string`, `unknown`\>

Credential 认证信息，支持 `static_bearer`、`mcp_oauth`；响应只返回脱敏后的非密文字段。

***

### display\_name?

> `optional` **display\_name?**: `string` \| `null`

兼容字段；当前不持久化，Forward 响应固定为空字符串。

***

### idempotency\_key?

> `optional` **idempotency\_key?**: `string` \| `null`

可选创建请求幂等键。相同 key 只能用于相同请求。

***

### metadata?

> `optional` **metadata?**: `Record`\<`string`, `unknown`\> \| `null`

元数据对象；`created_by` 为保留字段，不可传入（传入返回 400）。
