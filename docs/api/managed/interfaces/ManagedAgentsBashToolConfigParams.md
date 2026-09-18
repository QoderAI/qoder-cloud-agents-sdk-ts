[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [managed](../README.md) / ManagedAgentsBashToolConfigParams

# Interface: ManagedAgentsBashToolConfigParams

Configuration override for the bash tool.

## Properties

### enabled?

> `optional` **enabled?**: `boolean` \| `null`

Whether this tool is enabled and available to Claude. Overrides the
default_config setting.

***

### name?

> `optional` **name?**: `"bash"` \| `null`

Must be "bash".

This field can be elided, and will marshal its zero value as "bash".

***

### permission\_policy?

> `optional` **permission\_policy?**: [`ManagedAgentsBashToolConfigParamsPermissionPolicyUnion`](../type-aliases/ManagedAgentsBashToolConfigParamsPermissionPolicyUnion.md) \| `null`

Permission policy for tool execution.

***

### type?

> `optional` **type?**: `"bash"` \| `null`

Any of "bash".
