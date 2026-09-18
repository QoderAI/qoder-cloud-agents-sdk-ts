[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [managed](../README.md) / DeploymentRunListParams

# Interface: DeploymentRunListParams

## Properties

### after\_id?

> `optional` **after\_id?**: `string`

***

### before\_id?

> `optional` **before\_id?**: `string`

***

### betas?

> `optional` **betas?**: `string`[]

Optional header to specify the beta version(s) you want to use.

***

### created\_at\[gt\]?

> `optional` **created\_at\[gt\]?**: `string`

Return runs created strictly after this time (exclusive).

***

### created\_at\[gte\]?

> `optional` **created\_at\[gte\]?**: `string`

Return runs created at or after this time (inclusive).

***

### created\_at\[lt\]?

> `optional` **created\_at\[lt\]?**: `string`

Return runs created strictly before this time (exclusive).

***

### created\_at\[lte\]?

> `optional` **created\_at\[lte\]?**: `string`

Return runs created at or before this time (inclusive).

***

### deployment\_id?

> `optional` **deployment\_id?**: `string`

Filter to a specific deployment. Omit to list across all deployments in the
workspace. Filtering by a non-existent `deployment_id` returns 200 with empty
data.

***

### has\_error?

> `optional` **has\_error?**: `boolean`

Filter: true for runs with non-null `error`, false for runs with non-null
`session_id`. Omit for all.

***

### limit?

> `optional` **limit?**: `number`

Maximum results per page. Default 20, maximum 1000.

***

### page?

> `optional` **page?**: `string`

Opaque pagination cursor. Pass `next_page` from the previous response. Invalid
or expired cursors return 400.

***

### trigger\_type?

> `optional` **trigger\_type?**: [`ManagedAgentsTriggerType`](../type-aliases/ManagedAgentsTriggerType.md)

Filter runs by what triggered them. Omit to return all runs.

Any of "schedule", "manual".

***

### workspace\_id?

> `optional` **workspace\_id?**: `string`
