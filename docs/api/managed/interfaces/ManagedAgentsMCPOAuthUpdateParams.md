[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [managed](../README.md) / ManagedAgentsMCPOAuthUpdateParams

# Interface: ManagedAgentsMCPOAuthUpdateParams

Parameters for updating an MCP OAuth credential. The `mcp_server_url` is
immutable.

## Properties

### access\_token?

> `optional` **access\_token?**: `string` \| `null`

Updated OAuth access token.

***

### expires\_at?

> `optional` **expires\_at?**: `string` \| `null`

A timestamp in RFC 3339 format

***

### refresh?

> `optional` **refresh?**: [`ManagedAgentsMCPOAuthRefreshUpdateParams`](ManagedAgentsMCPOAuthRefreshUpdateParams.md) \| `null`

Parameters for updating OAuth refresh token configuration.

***

### type

> **type**: `"mcp_oauth"`

Any of "mcp_oauth".
