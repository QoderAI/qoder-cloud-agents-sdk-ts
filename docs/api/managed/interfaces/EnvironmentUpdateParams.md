[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [managed](../README.md) / EnvironmentUpdateParams

# Interface: EnvironmentUpdateParams

## Properties

### betas?

> `optional` **betas?**: `string`[]

Optional header to specify the beta version(s) you want to use.

***

### config?

> `optional` **config?**: [`EnvironmentUpdateParamsConfigUnion`](../type-aliases/EnvironmentUpdateParamsConfigUnion.md) \| `null`

Updated environment configuration

***

### description?

> `optional` **description?**: `string` \| `null`

Updated description of the environment. Omit to preserve; null clears to null;
an empty string is stored as an empty string.

***

### metadata?

> `optional` **metadata?**: `Record`\<`string`, `unknown`\> \| `null`

User-provided metadata key-value pairs. Set a value to null or empty string to
delete the key.

***

### name?

> `optional` **name?**: `string` \| `null`

Updated name for the environment

***

### scope?

> `optional` **scope?**: [`EnvironmentUpdateParamsScope`](../type-aliases/EnvironmentUpdateParamsScope.md) \| `null`

The visibility scope for this environment. 'organization' makes the environment
visible to all accounts. 'account' restricts visibility to the owning account
only.

Any of "organization", "account".

***

### workspace\_id?

> `optional` **workspace\_id?**: `string`
