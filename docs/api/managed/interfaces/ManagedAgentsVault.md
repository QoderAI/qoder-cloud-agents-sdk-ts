[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [managed](../README.md) / ManagedAgentsVault

# Interface: ManagedAgentsVault

A vault that stores credentials for use by agents during sessions.

## Properties

### archived\_at

> **archived\_at**: `string` \| `null`

A timestamp in RFC 3339 format

***

### created\_at

> **created\_at**: `string`

A timestamp in RFC 3339 format

***

### display\_name

> **display\_name**: `string`

Human-readable name for the vault.

***

### id

> **id**: `string`

Unique identifier for the vault.

***

### metadata

> **metadata**: `Record`\<`string`, `string`\>

Arbitrary key-value metadata attached to the vault.

***

### type

> **type**: `"vault"`

Any of "vault".

***

### updated\_at

> **updated\_at**: `string`

A timestamp in RFC 3339 format
