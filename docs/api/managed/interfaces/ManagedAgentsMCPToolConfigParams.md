[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [managed](../README.md) / ManagedAgentsMCPToolConfigParams

# Interface: ManagedAgentsMCPToolConfigParams

Configuration override for a specific MCP tool.

## Properties

### enabled?

> `optional` **enabled?**: `boolean` \| `null`

Whether this tool is enabled. Overrides the `default_config` setting.

***

### name

> **name**: `string`

Name of the MCP tool to configure. 1-128 characters.

***

### permission\_policy?

> `optional` **permission\_policy?**: [`ManagedAgentsMCPToolConfigParamsPermissionPolicyUnion`](../type-aliases/ManagedAgentsMCPToolConfigParamsPermissionPolicyUnion.md) \| `null`

Permission policy for tool execution.
