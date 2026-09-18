[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [managed](../README.md) / ManagedAgentsMCPOAuthRefreshUpdateParams

# Interface: ManagedAgentsMCPOAuthRefreshUpdateParams

Parameters for updating OAuth refresh token configuration.

## Properties

### refresh\_token?

> `optional` **refresh\_token?**: `string` \| `null`

Updated OAuth refresh token.

***

### scope?

> `optional` **scope?**: `string` \| `null`

Updated OAuth scope for the refresh request.

***

### token\_endpoint\_auth?

> `optional` **token\_endpoint\_auth?**: [`ManagedAgentsMCPOAuthRefreshUpdateParamsTokenEndpointAuthUnion`](../type-aliases/ManagedAgentsMCPOAuthRefreshUpdateParamsTokenEndpointAuthUnion.md) \| `null`

Updated HTTP Basic authentication parameters for the token endpoint.
