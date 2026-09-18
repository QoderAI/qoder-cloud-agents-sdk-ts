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

### name?

> `optional` **name?**: `"read"` \| `null`

Must be "read".

This field can be elided, and will marshal its zero value as "read".

***

### permission\_policy?

> `optional` **permission\_policy?**: [`ManagedAgentsReadToolConfigParamsPermissionPolicyUnion`](../type-aliases/ManagedAgentsReadToolConfigParamsPermissionPolicyUnion.md) \| `null`

Permission policy for tool execution.

***

### type?

> `optional` **type?**: `"read"` \| `null`

Any of "read".
