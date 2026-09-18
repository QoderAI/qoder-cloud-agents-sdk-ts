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

### name?

> `optional` **name?**: `"glob"` \| `null`

Must be "glob".

This field can be elided, and will marshal its zero value as "glob".

***

### permission\_policy?

> `optional` **permission\_policy?**: [`ManagedAgentsGlobToolConfigParamsPermissionPolicyUnion`](../type-aliases/ManagedAgentsGlobToolConfigParamsPermissionPolicyUnion.md) \| `null`

Permission policy for tool execution.

***

### type?

> `optional` **type?**: `"glob"` \| `null`

Any of "glob".
