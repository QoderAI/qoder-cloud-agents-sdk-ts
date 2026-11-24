[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [managed](../README.md) / ManagedAgentsReadToolConfigParams

# Interface: ManagedAgentsReadToolConfigParams

Configuration override for the read tool.

## Properties

### enabled?

> `optional` **enabled?**: `boolean` \| `null`

Whether this tool is enabled and available to Claude. Overrides the
default_config setting.

***

### name

> **name**: `"Read"` \| `"read"`

Required service selector. Legacy type is optional and does not replace name.

***

### permission\_policy?

> `optional` **permission\_policy?**: [`ManagedAgentsReadToolConfigParamsPermissionPolicyUnion`](../type-aliases/ManagedAgentsReadToolConfigParamsPermissionPolicyUnion.md) \| `null`

Permission policy for tool execution.

***

### type?

> `optional` **type?**: `"read"` \| `null`

Any of "read".
