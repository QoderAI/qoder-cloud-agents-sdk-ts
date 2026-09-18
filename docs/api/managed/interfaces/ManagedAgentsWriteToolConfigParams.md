[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [managed](../README.md) / ManagedAgentsWriteToolConfigParams

# Interface: ManagedAgentsWriteToolConfigParams

Configuration override for the write tool.

## Properties

### enabled?

> `optional` **enabled?**: `boolean` \| `null`

Whether this tool is enabled and available to Claude. Overrides the
default_config setting.

***

### name?

> `optional` **name?**: `"write"` \| `null`

Must be "write".

This field can be elided, and will marshal its zero value as "write".

***

### permission\_policy?

> `optional` **permission\_policy?**: [`ManagedAgentsWriteToolConfigParamsPermissionPolicyUnion`](../type-aliases/ManagedAgentsWriteToolConfigParamsPermissionPolicyUnion.md) \| `null`

Permission policy for tool execution.

***

### type?

> `optional` **type?**: `"write"` \| `null`

Any of "write".
