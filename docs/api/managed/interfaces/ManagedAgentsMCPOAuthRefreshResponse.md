[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [managed](../README.md) / ManagedAgentsMCPOAuthRefreshResponse

# Interface: ManagedAgentsMCPOAuthRefreshResponse

OAuth refresh token configuration returned in credential responses.

## Properties

### client\_id

> **client\_id**: `string`

OAuth client ID.

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

> **token\_endpoint\_auth**: [`ManagedAgentsMCPOAuthRefreshResponseTokenEndpointAuthUnion`](../type-aliases/ManagedAgentsMCPOAuthRefreshResponseTokenEndpointAuthUnion.md)

Token endpoint requires no client authentication.
