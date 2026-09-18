[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [managed](../README.md) / ManagedAgentsAgentToolsetDefaultConfigParams

# Interface: ManagedAgentsAgentToolsetDefaultConfigParams

Default configuration for all tools in a toolset.

## Properties

### enabled?

> `optional` **enabled?**: `boolean` \| `null`

Whether tools are enabled and available to Claude by default. Defaults to true
if not specified.

***

### permission\_policy?

> `optional` **permission\_policy?**: [`ManagedAgentsAgentToolsetDefaultConfigParamsPermissionPolicyUnion`](../type-aliases/ManagedAgentsAgentToolsetDefaultConfigParamsPermissionPolicyUnion.md) \| `null`

Permission policy for tool execution.
