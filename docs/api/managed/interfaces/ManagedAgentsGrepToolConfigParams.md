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

### name

> **name**: `"Grep"` \| `"grep"`

Required service selector. Legacy type is optional and does not replace name.

***

### permission\_policy?

> `optional` **permission\_policy?**: [`ManagedAgentsGrepToolConfigParamsPermissionPolicyUnion`](../type-aliases/ManagedAgentsGrepToolConfigParamsPermissionPolicyUnion.md) \| `null`

Permission policy for tool execution.

***

### type?

> `optional` **type?**: `"grep"` \| `null`

Any of "grep".
