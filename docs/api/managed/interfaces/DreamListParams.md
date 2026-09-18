[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [managed](../README.md) / DreamListParams

# Interface: DreamListParams

## Properties

### betas?

> `optional` **betas?**: `string`[]

Optional header to specify the beta version(s) you want to use.

***

### created\_at\[gt\]?

> `optional` **created\_at\[gt\]?**: `string`

Return dreams with `created_at` strictly after this timestamp (exclusive lower
bound, RFC 3339). Unset applies no lower bound.

***

### created\_at\[lt\]?

> `optional` **created\_at\[lt\]?**: `string`

Return dreams with `created_at` strictly before this timestamp (exclusive upper
bound, RFC 3339). Unset applies no upper bound.

***

### include\_archived?

> `optional` **include\_archived?**: `boolean`

Query parameter for include_archived

***

### limit?

> `optional` **limit?**: `number`

Query parameter for limit

***

### page?

> `optional` **page?**: `string`

Query parameter for page

***

### statuses?

> `optional` **statuses?**: [`DreamStatus`](../type-aliases/DreamStatus.md)[]

Filter by lifecycle status. Repeat the parameter to match any of multiple
statuses. Empty applies no status filter.

***

### workspace\_id?

> `optional` **workspace\_id?**: `string`
