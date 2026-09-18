[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [managed](../README.md) / ManagedAgentsEnvironmentVariableCreateParams

# Interface: ManagedAgentsEnvironmentVariableCreateParams

Parameters for creating an environment variable credential.

## Properties

### injection\_location?

> `optional` **injection\_location?**: [`ManagedAgentsInjectionLocationParams`](ManagedAgentsInjectionLocationParams.md) \| `null`

Where in the outbound request the secret value may be substituted.

***

### networking

> **networking**: [`ManagedAgentsCredentialNetworkingParamsUnion`](../type-aliases/ManagedAgentsCredentialNetworkingParamsUnion.md)

Outbound hosts the secret value is substituted on.

***

### secret\_name

> **secret\_name**: `string`

Name of the environment variable. Immutable after create.

***

### secret\_value

> **secret\_value**: `string`

Secret value. Write-only; never returned in responses.

***

### type

> **type**: `"environment_variable"`

Any of "environment_variable".
