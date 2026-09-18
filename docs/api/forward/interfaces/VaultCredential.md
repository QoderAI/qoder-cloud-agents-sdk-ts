[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [forward](../README.md) / VaultCredential

# Interface: VaultCredential

## Indexable

> \[`key`: `string`\]: `unknown`

Additional fields are preserved verbatim by the SDK.

## Properties

### auth

> **auth**: [`VaultCredentialAuth`](VaultCredentialAuth.md)

脱敏后的认证信息。

***

### created\_at

> **created\_at**: `string`

创建时间，RFC 3339 格式。

***

### display\_name

> **display\_name**: `string`

当前固定为空字符串。

***

### id

> **id**: `string`

Credential ID。

***

### metadata

> **metadata**: `Record`\<`string`, `unknown`\>

Credential 元数据。

***

### type

> **type**: `string`

固定为 `vault_credential`。

***

### updated\_at

> **updated\_at**: `string`

最后更新时间，RFC 3339 格式。

***

### vault\_id

> **vault\_id**: `string`

所属 Vault ID。
