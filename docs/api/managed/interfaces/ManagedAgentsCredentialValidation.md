[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [managed](../README.md) / ManagedAgentsCredentialValidation

# Interface: ManagedAgentsCredentialValidation

Result of live-probing a credential against its configured MCP server.

## Properties

### credential\_id

> **credential\_id**: `string`

Unique identifier of the credential that was validated.

***

### has\_refresh\_token

> **has\_refresh\_token**: `boolean`

Whether the credential has a refresh token configured.

***

### mcp\_probe

> **mcp\_probe**: [`ManagedAgentsMCPProbe`](ManagedAgentsMCPProbe.md)

The failing step of an MCP validation probe.

***

### refresh

> **refresh**: [`ManagedAgentsRefreshObject`](ManagedAgentsRefreshObject.md)

Outcome of a refresh-token exchange attempted during credential validation.

***

### status

> **status**: [`ManagedAgentsCredentialValidationStatus`](../type-aliases/ManagedAgentsCredentialValidationStatus.md)

Overall verdict of a credential validation probe.

Any of "valid", "invalid", "unknown".

***

### type

> **type**: `"vault_credential_validation"`

Any of "vault_credential_validation".

***

### validated\_at

> **validated\_at**: `string`

A timestamp in RFC 3339 format

***

### vault\_id

> **vault\_id**: `string`

Identifier of the vault containing the credential.
