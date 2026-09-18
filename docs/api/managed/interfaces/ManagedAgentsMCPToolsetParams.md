[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [managed](../README.md) / ManagedAgentsMCPToolsetParams

# Interface: ManagedAgentsMCPToolsetParams

Configuration for tools from an MCP server defined in `mcp_servers`.

## Properties

### configs?

> `optional` **configs?**: [`ManagedAgentsMCPToolConfigParams`](ManagedAgentsMCPToolConfigParams.md)[] \| `null`

Per-tool configuration overrides.

***

### default\_config?

> `optional` **default\_config?**: [`ManagedAgentsMCPToolsetDefaultConfigParams`](ManagedAgentsMCPToolsetDefaultConfigParams.md) \| `null`

Default configuration for all tools from an MCP server.

***

### mcp\_server\_name

> **mcp\_server\_name**: `string`

Name of the MCP server. Must match a server name from the mcp_servers array.
1-255 characters.

***

### type

> **type**: `"mcp_toolset"`

Any of "mcp_toolset".
