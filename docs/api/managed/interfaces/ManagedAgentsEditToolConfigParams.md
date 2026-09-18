[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [managed](../README.md) / ManagedAgentsEditToolConfigParams

# Interface: ManagedAgentsEditToolConfigParams

Configuration override for the edit tool.

## Properties

### enabled?

> `optional` **enabled?**: `boolean` \| `null`

Whether this tool is enabled and available to Claude. Overrides the
default_config setting.

***

### name?

> `optional` **name?**: `"edit"` \| `null`

Must be "edit".

This field can be elided, and will marshal its zero value as "edit".

***

### permission\_policy?

> `optional` **permission\_policy?**: [`ManagedAgentsEditToolConfigParamsPermissionPolicyUnion`](../type-aliases/ManagedAgentsEditToolConfigParamsPermissionPolicyUnion.md) \| `null`

Permission policy for tool execution.

***

### type?

> `optional` **type?**: `"edit"` \| `null`

Any of "edit".
