[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [managed](../README.md) / SessionListParams

# Interface: SessionListParams

## Properties

### agent\_id?

> `optional` **agent\_id?**: `string`

Filter sessions created with this agent ID.

***

### agent\_version?

> `optional` **agent\_version?**: `number`

Filter by agent version. Only applies when `agent_id` is also set.

***

### betas?

> `optional` **betas?**: `string`[]

Optional header to specify the beta version(s) you want to use.

***

### created\_at\[gt\]?

> `optional` **created\_at\[gt\]?**: `string`

Return sessions created after this time (exclusive).

***

### created\_at\[gte\]?

> `optional` **created\_at\[gte\]?**: `string`

Return sessions created at or after this time (inclusive).

***

### created\_at\[lt\]?

> `optional` **created\_at\[lt\]?**: `string`

Return sessions created before this time (exclusive).

***

### created\_at\[lte\]?

> `optional` **created\_at\[lte\]?**: `string`

Return sessions created at or before this time (inclusive).

***

### deployment\_id?

> `optional` **deployment\_id?**: `string`

Filter sessions created by this deployment ID.

***

### include\_archived?

> `optional` **include\_archived?**: `boolean`

When true, includes archived sessions. Default: false (exclude archived).

***

### limit?

> `optional` **limit?**: `number`

Maximum number of results to return.

***

### memory\_store\_id?

> `optional` **memory\_store\_id?**: `string`

Filter sessions whose resources contain a `memory_store` with this memory store
ID.

***

### order?

> `optional` **order?**: [`SessionListParamsOrder`](../type-aliases/SessionListParamsOrder.md)

Sort direction for results, ordered by `created_at`. Defaults to `desc` (newest
first).

Any of "asc", "desc".

***

### page?

> `optional` **page?**: `string`

Opaque pagination cursor from a previous response.

***

### statuses?

> `optional` **statuses?**: `string`[]

Filter by session status. Repeat the parameter to match any of multiple
statuses.

Any of "rescheduling", "running", "idle", "terminated".

***

### workspace\_id?

> `optional` **workspace\_id?**: `string`
