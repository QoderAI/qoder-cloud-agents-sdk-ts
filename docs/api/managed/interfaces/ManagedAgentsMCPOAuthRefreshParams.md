[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [managed](../README.md) / ManagedAgentsMCPOAuthRefreshParams

# Interface: ManagedAgentsMCPOAuthRefreshParams

OAuth refresh token parameters for creating a credential with refresh support.

## Properties

### client\_id

> **client\_id**: `string`

OAuth client ID.

***

### refresh\_token

> **refresh\_token**: `string`

OAuth refresh token.

***

### resource?

> `optional` **resource?**: `string` \| `null`

OAuth resource indicator.

***

### scope?

> `optional` **scope?**: `string` \| `null`

OAuth scope for the refresh request.

***

### token\_endpoint

> **token\_endpoint**: `string`

Token endpoint URL used to refresh the access token.

***

### token\_endpoint\_auth

> **token\_endpoint\_auth**: [`ManagedAgentsMCPOAuthRefreshParamsTokenEndpointAuthUnion`](../type-aliases/ManagedAgentsMCPOAuthRefreshParamsTokenEndpointAuthUnion.md)

Token endpoint requires no client authentication.
