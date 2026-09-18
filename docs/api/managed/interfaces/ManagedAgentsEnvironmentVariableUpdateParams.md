[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [managed](../README.md) / ManagedAgentsEnvironmentVariableUpdateParams

# Interface: ManagedAgentsEnvironmentVariableUpdateParams

Parameters for updating an environment variable credential. `secret_name` is
immutable.

## Properties

### injection\_location?

> `optional` **injection\_location?**: [`ManagedAgentsInjectionLocationUpdateParams`](ManagedAgentsInjectionLocationUpdateParams.md) \| `null`

Updated injection location.

***

### networking?

> `optional` **networking?**: [`ManagedAgentsCredentialNetworkingParamsUnion`](../type-aliases/ManagedAgentsCredentialNetworkingParamsUnion.md) \| `null`

Updated networking scope. Full replacement.

***

### secret\_value?

> `optional` **secret\_value?**: `string` \| `null`

Updated secret value.

***

### type

> **type**: `"environment_variable"`

Any of "environment_variable".
