[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [managed](../README.md) / ManagedAgentsGlobToolConfigParams

# Interface: ManagedAgentsGlobToolConfigParams

Configuration override for the glob tool.

## Properties

### enabled?

> `optional` **enabled?**: `boolean` \| `null`

Whether this tool is enabled and available to Claude. Overrides the
default_config setting.

***

### name

> **name**: `"Glob"` \| `"glob"`

Required service selector. Legacy type is optional and does not replace name.

***

### permission\_policy?

> `optional` **permission\_policy?**: [`ManagedAgentsGlobToolConfigParamsPermissionPolicyUnion`](../type-aliases/ManagedAgentsGlobToolConfigParamsPermissionPolicyUnion.md) \| `null`

Permission policy for tool execution.

***

### type?

> `optional` **type?**: `"glob"` \| `null`

Any of "glob".
