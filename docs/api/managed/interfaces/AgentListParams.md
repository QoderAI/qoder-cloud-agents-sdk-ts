[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [managed](../README.md) / AgentListParams

# Interface: AgentListParams

## Properties

### betas?

> `optional` **betas?**: `string`[]

Optional header to specify the beta version(s) you want to use.

***

### created\_at\[gte\]?

> `optional` **created\_at\[gte\]?**: `string`

Return agents created at or after this time (inclusive).

***

### created\_at\[lte\]?

> `optional` **created\_at\[lte\]?**: `string`

Return agents created at or before this time (inclusive).

***

### include\_archived?

> `optional` **include\_archived?**: `boolean`

Include archived agents in results. Defaults to false.

***

### limit?

> `optional` **limit?**: `number`

Maximum results per page. Default 20, maximum 100.

***

### page?

> `optional` **page?**: `string`

Opaque pagination cursor from a previous response.

***

### workspace\_id?

> `optional` **workspace\_id?**: `string`
