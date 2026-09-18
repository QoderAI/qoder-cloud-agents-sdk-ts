[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [managed](../README.md) / ManagedAgentsCredentialHostUnreachableError

# Interface: ManagedAgentsCredentialHostUnreachableError

An `environment_variable` credential's `auth.networking.allowed_hosts` includes
a host the environment's network policy does not permit.

## Properties

### credential\_id

> **credential\_id**: `string`

ID of the affected credential.

***

### message

> **message**: `string`

Human-readable error description.

***

### retry\_status

> **retry\_status**: [`ManagedAgentsCredentialHostUnreachableErrorRetryStatusUnion`](../type-aliases/ManagedAgentsCredentialHostUnreachableErrorRetryStatusUnion.md)

What the client should do next in response to this error.

***

### type

> **type**: `"credential_host_unreachable_error"`

Any of "credential_host_unreachable_error".

***

### vault\_id

> **vault\_id**: `string`

ID of the vault containing the affected credential.
