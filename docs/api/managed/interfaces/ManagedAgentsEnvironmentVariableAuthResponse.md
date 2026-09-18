[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [managed](../README.md) / ManagedAgentsEnvironmentVariableAuthResponse

# Interface: ManagedAgentsEnvironmentVariableAuthResponse

Environment variable credential details. The secret value is never returned.

## Properties

### injection\_location

> **injection\_location**: [`ManagedAgentsInjectionLocationResponse`](ManagedAgentsInjectionLocationResponse.md)

Where in the outbound request the secret value is substituted.

***

### networking

> **networking**: [`ManagedAgentsEnvironmentVariableAuthResponseNetworkingUnion`](../type-aliases/ManagedAgentsEnvironmentVariableAuthResponseNetworkingUnion.md)

Outbound hosts the secret value is substituted on.

***

### secret\_name

> **secret\_name**: `string`

Name of the environment variable.

***

### type

> **type**: `"environment_variable"`

Any of "environment_variable".
