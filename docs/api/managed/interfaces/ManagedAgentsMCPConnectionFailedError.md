[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [managed](../README.md) / ManagedAgentsMCPConnectionFailedError

# Interface: ManagedAgentsMCPConnectionFailedError

Failed to connect to an MCP server.

## Properties

### mcp\_server\_name

> **mcp\_server\_name**: `string`

Name of the MCP server that failed to connect.

***

### message

> **message**: `string`

Human-readable error description.

***

### retry\_status

> **retry\_status**: [`ManagedAgentsMCPConnectionFailedErrorRetryStatusUnion`](../type-aliases/ManagedAgentsMCPConnectionFailedErrorRetryStatusUnion.md)

What the client should do next in response to this error.

***

### type

> **type**: `"mcp_connection_failed_error"`

Any of "mcp_connection_failed_error".
