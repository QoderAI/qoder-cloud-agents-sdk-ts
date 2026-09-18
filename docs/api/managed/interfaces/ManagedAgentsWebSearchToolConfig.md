[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [managed](../README.md) / ManagedAgentsWebSearchToolConfig

# Interface: ManagedAgentsWebSearchToolConfig

Configuration for the web_search tool.

## Properties

### allowed\_domains?

> `optional` **allowed\_domains?**: `string`[]

***

### blocked\_domains?

> `optional` **blocked\_domains?**: `string`[]

***

### enabled

> **enabled**: `boolean`

***

### name?

> `optional` **name?**: `"web_search"`

***

### permission\_policy

> **permission\_policy**: [`ManagedAgentsWebSearchToolConfigPermissionPolicyUnion`](../type-aliases/ManagedAgentsWebSearchToolConfigPermissionPolicyUnion.md)

Permission policy for tool execution.

***

### type?

> `optional` **type?**: `"web_search"`

***

### user\_location?

> `optional` **user\_location?**: [`ManagedAgentsUserLocation`](ManagedAgentsUserLocation.md) \| `null`

Approximate user location for search result localization.
