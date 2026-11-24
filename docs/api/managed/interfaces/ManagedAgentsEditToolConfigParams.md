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

### name

> **name**: `"Edit"` \| `"edit"`

Required service selector. Legacy type is optional and does not replace name.

***

### permission\_policy?

> `optional` **permission\_policy?**: [`ManagedAgentsEditToolConfigParamsPermissionPolicyUnion`](../type-aliases/ManagedAgentsEditToolConfigParamsPermissionPolicyUnion.md) \| `null`

Permission policy for tool execution.

***

### type?

> `optional` **type?**: `"edit"` \| `null`

Any of "edit".
