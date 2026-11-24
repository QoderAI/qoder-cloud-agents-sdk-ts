[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [managed](../README.md) / ManagedAgentsImageGenToolConfigParams

# Interface: ManagedAgentsImageGenToolConfigParams

Tool configuration, not media-generation invocation parameters. Name selects the service tool.

## Properties

### enabled?

> `optional` **enabled?**: `boolean` \| `null`

***

### name

> **name**: `"ImageGen"` \| `"image_gen"`

***

### permission\_policy?

> `optional` **permission\_policy?**: [`ManagedAgentsAgentToolsetDefaultConfigParamsPermissionPolicyUnion`](../type-aliases/ManagedAgentsAgentToolsetDefaultConfigParamsPermissionPolicyUnion.md) \| `null`

***

### type?

> `optional` **type?**: `"image_gen"` \| `null`

Legacy compatibility only; does not replace name.
