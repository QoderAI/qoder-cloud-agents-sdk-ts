[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [managed](../README.md) / VaultCredentialUpdateParams

# Interface: VaultCredentialUpdateParams

## Properties

### auth?

> `optional` **auth?**: [`VaultCredentialUpdateParamsAuthUnion`](../type-aliases/VaultCredentialUpdateParamsAuthUnion.md) \| `null`

Updated authentication details for a credential.

***

### betas?

> `optional` **betas?**: `string`[]

Optional header to specify the beta version(s) you want to use.

***

### display\_name?

> `optional` **display\_name?**: `string` \| `null`

Updated human-readable name for the credential. 1-255 characters.

***

### metadata?

> `optional` **metadata?**: `Record`\<`string`, `unknown`\> \| `null`

Metadata patch. Set a key to a string to upsert it, or to null to delete it.
Omitted keys are preserved.

***

### vault\_id

> **vault\_id**: `string`

***

### workspace\_id?

> `optional` **workspace\_id?**: `string`
