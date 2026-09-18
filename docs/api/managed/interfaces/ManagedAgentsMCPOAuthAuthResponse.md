[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [managed](../README.md) / ManagedAgentsMCPOAuthAuthResponse

# Interface: ManagedAgentsMCPOAuthAuthResponse

OAuth credential details for an MCP server.

## Properties

### expires\_at?

> `optional` **expires\_at?**: `string` \| `null`

A timestamp in RFC 3339 format

***

### mcp\_server\_url

> **mcp\_server\_url**: `string`

URL of the MCP server this credential authenticates against.

***

### refresh?

> `optional` **refresh?**: [`ManagedAgentsMCPOAuthRefreshResponse`](ManagedAgentsMCPOAuthRefreshResponse.md) \| `null`

OAuth refresh token configuration returned in credential responses.

***

### type

> **type**: `"mcp_oauth"`

Any of "mcp_oauth".
