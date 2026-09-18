[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [managed](../README.md) / EnvironmentNewParams

# Interface: EnvironmentNewParams

## Properties

### betas?

> `optional` **betas?**: `string`[]

Optional header to specify the beta version(s) you want to use.

***

### config?

> `optional` **config?**: [`EnvironmentNewParamsConfigUnion`](../type-aliases/EnvironmentNewParamsConfigUnion.md) \| `null`

Environment configuration

***

### description?

> `optional` **description?**: `string` \| `null`

Optional description of the environment

***

### metadata?

> `optional` **metadata?**: `Record`\<`string`, `string`\> \| `null`

User-provided metadata key-value pairs

***

### name

> **name**: `string`

Human-readable name for the environment

***

### scope?

> `optional` **scope?**: [`EnvironmentNewParamsScope`](../type-aliases/EnvironmentNewParamsScope.md) \| `null`

The visibility scope for this environment. 'organization' makes the environment
visible to all accounts. 'account' restricts visibility to the owning account
only. Only applicable for self-hosted environments. If not specified, defaults
based on organization type.

Any of "organization", "account".

***

### workspace\_id?

> `optional` **workspace\_id?**: `string`
