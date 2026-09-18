[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [managed](../README.md) / ManagedAgentsCredential

# Interface: ManagedAgentsCredential

A credential stored in a vault. Sensitive fields are never returned in
responses.

## Properties

### archived\_at

> **archived\_at**: `string` \| `null`

A timestamp in RFC 3339 format

***

### auth

> **auth**: [`ManagedAgentsCredentialAuthUnion`](../type-aliases/ManagedAgentsCredentialAuthUnion.md)

Authentication details for a credential.

***

### created\_at

> **created\_at**: `string`

A timestamp in RFC 3339 format

***

### display\_name?

> `optional` **display\_name?**: `string` \| `null`

Human-readable name for the credential.

***

### id

> **id**: `string`

Unique identifier for the credential.

***

### metadata

> **metadata**: `Record`\<`string`, `string`\>

Arbitrary key-value metadata attached to the credential.

***

### type

> **type**: `"vault_credential"`

Any of "vault_credential".

***

### updated\_at

> **updated\_at**: `string`

A timestamp in RFC 3339 format

***

### vault\_id

> **vault\_id**: `string`

Identifier of the vault this credential belongs to.
