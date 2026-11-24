[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [managed](../README.md) / ManagedAgentsMCPToolset

# Interface: ManagedAgentsMCPToolset

## Properties

### configs?

> `optional` **configs?**: [`ManagedAgentsMCPToolConfig`](ManagedAgentsMCPToolConfig.md)[] \| `null`

***

### default\_config?

> `optional` **default\_config?**: [`ManagedAgentsMCPToolsetDefaultConfig`](ManagedAgentsMCPToolsetDefaultConfig.md) \| `null`

Preserved metadata; the MCP default policy is the top-level permission_policy.

***

### mcp\_server\_name

> **mcp\_server\_name**: `string`

***

### permission\_policy?

> `optional` **permission\_policy?**: [`ManagedAgentsMCPToolConfigPermissionPolicyUnion`](../type-aliases/ManagedAgentsMCPToolConfigPermissionPolicyUnion.md) \| `null`

***

### type

> **type**: `"mcp_toolset"`

Any of "mcp_toolset".
