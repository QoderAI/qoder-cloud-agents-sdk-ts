[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [managed](../README.md) / ManagedAgentsMCPAuthenticationFailedError

# Interface: ManagedAgentsMCPAuthenticationFailedError

Authentication to an MCP server failed.

## Properties

### mcp\_server\_name

> **mcp\_server\_name**: `string`

Name of the MCP server that failed authentication.

***

### message

> **message**: `string`

Human-readable error description.

***

### retry\_status

> **retry\_status**: [`ManagedAgentsMCPAuthenticationFailedErrorRetryStatusUnion`](../type-aliases/ManagedAgentsMCPAuthenticationFailedErrorRetryStatusUnion.md)

What the client should do next in response to this error.

***

### type

> **type**: `"mcp_authentication_failed_error"`

Any of "mcp_authentication_failed_error".
