[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [managed](../README.md) / DeploymentListParams

# Interface: DeploymentListParams

## Properties

### after\_id?

> `optional` **after\_id?**: `string`

***

### agent\_id?

> `optional` **agent\_id?**: `string`

Filter by agent ID.

***

### before\_id?

> `optional` **before\_id?**: `string`

***

### betas?

> `optional` **betas?**: `string`[]

Optional header to specify the beta version(s) you want to use.

***

### created\_at\[gte\]?

> `optional` **created\_at\[gte\]?**: `string`

Return deployments created at or after this time (inclusive).

***

### created\_at\[lte\]?

> `optional` **created\_at\[lte\]?**: `string`

Return deployments created at or before this time (inclusive).

***

### include\_archived?

> `optional` **include\_archived?**: `boolean`

When true, includes archived deployments. Default: false (exclude archived).

***

### limit?

> `optional` **limit?**: `number`

Maximum results per page. Default 20, maximum 100.

***

### page?

> `optional` **page?**: `string`

Opaque pagination cursor.

***

### status?

> `optional` **status?**: [`ManagedAgentsDeploymentStatus`](../type-aliases/ManagedAgentsDeploymentStatus.md)

Filter by status: `active` or `paused`. Omit for both. To include archived
deployments, use `include_archived` instead; the two cannot be combined.

Any of "active", "paused".

***

### workspace\_id?

> `optional` **workspace\_id?**: `string`
