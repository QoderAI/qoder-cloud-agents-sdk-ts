[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [managed](../README.md) / ManagedAgentsMCPOAuthCreateParams

# Interface: ManagedAgentsMCPOAuthCreateParams

Parameters for creating an MCP OAuth credential.

## Properties

### access\_token

> **access\_token**: `string`

OAuth access token.

***

### expires\_at?

> `optional` **expires\_at?**: `string` \| `null`

A timestamp in RFC 3339 format

***

### mcp\_server\_url

> **mcp\_server\_url**: `string`

URL of the MCP server this credential authenticates against.

***

### refresh?

> `optional` **refresh?**: [`ManagedAgentsMCPOAuthRefreshParams`](ManagedAgentsMCPOAuthRefreshParams.md) \| `null`

OAuth refresh token parameters for creating a credential with refresh support.

***

### type

> **type**: `"mcp_oauth"`

Any of "mcp_oauth".
