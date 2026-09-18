[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [managed](../README.md) / ManagedAgentsGrepToolConfigParams

# Interface: ManagedAgentsGrepToolConfigParams

Configuration override for the grep tool.

## Properties

### enabled?

> `optional` **enabled?**: `boolean` \| `null`

Whether this tool is enabled and available to Claude. Overrides the
default_config setting.

***

### name?

> `optional` **name?**: `"grep"` \| `null`

Must be "grep".

This field can be elided, and will marshal its zero value as "grep".

***

### permission\_policy?

> `optional` **permission\_policy?**: [`ManagedAgentsGrepToolConfigParamsPermissionPolicyUnion`](../type-aliases/ManagedAgentsGrepToolConfigParamsPermissionPolicyUnion.md) \| `null`

Permission policy for tool execution.

***

### type?

> `optional` **type?**: `"grep"` \| `null`

Any of "grep".
