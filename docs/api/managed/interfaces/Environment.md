[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [managed](../README.md) / Environment

# Interface: Environment

Unified Environment resource for both cloud and self-hosted environments.

## Properties

### archived\_at

> **archived\_at**: `string` \| `null`

RFC 3339 timestamp when environment was archived, or null if not archived

***

### config

> **config**: [`EnvironmentConfigUnion`](../type-aliases/EnvironmentConfigUnion.md)

Environment configuration (either Qoder Cloud or self-hosted)

***

### created\_at

> **created\_at**: `string`

RFC 3339 timestamp when environment was created

***

### description

> **description**: `string`

User-provided description for the environment; null when unset

***

### id

> **id**: `string`

Environment identifier (e.g., 'env\_...')

***

### metadata

> **metadata**: `Record`\<`string`, `string`\>

User-provided metadata key-value pairs

***

### name

> **name**: `string`

Human-readable name for the environment

***

### scope?

> `optional` **scope?**: [`EnvironmentScope`](../type-aliases/EnvironmentScope.md)

The visibility scope for this environment. 'organization' means visible to all
accounts. 'account' means visible only to the owning account.

Any of "organization", "account".

***

### type?

> `optional` **type?**: `"environment"`

The type of object (always 'environment')

***

### updated\_at

> **updated\_at**: `string`
