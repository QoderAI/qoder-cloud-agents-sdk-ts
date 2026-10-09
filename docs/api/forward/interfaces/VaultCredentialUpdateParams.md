[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [forward](../README.md) / VaultCredentialUpdateParams

# Interface: VaultCredentialUpdateParams

Merge patch. Supply auth or metadata; null clears metadata or deletes a key.

## Properties

### auth?

> `optional` **auth?**: [`VaultCredentialUpdateAuth`](../type-aliases/VaultCredentialUpdateAuth.md)

***

### identity\_id?

> `optional` **identity\_id?**: `string`

PAT only. SAT credentials determine their own owner scope.

***

### metadata?

> `optional` **metadata?**: `Record`\<`string`, `unknown`\> \| `null`
