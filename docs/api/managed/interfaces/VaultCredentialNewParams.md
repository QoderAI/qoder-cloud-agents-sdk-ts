[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [managed](../README.md) / VaultCredentialNewParams

# Interface: VaultCredentialNewParams

## Properties

### auth

> **auth**: [`VaultCredentialNewParamsAuthUnion`](../type-aliases/VaultCredentialNewParamsAuthUnion.md)

Authentication details for creating a credential.

***

### betas?

> `optional` **betas?**: `string`[]

Optional header to specify the beta version(s) you want to use.

***

### display\_name?

> `optional` **display\_name?**: `string` \| `null`

Human-readable name for the credential. Up to 255 characters.

***

### metadata?

> `optional` **metadata?**: `Record`\<`string`, `string`\> \| `null`

Arbitrary key-value metadata to attach to the credential. Maximum 16 pairs, keys
up to 64 chars, values up to 512 chars.

***

### workspace\_id?

> `optional` **workspace\_id?**: `string`
