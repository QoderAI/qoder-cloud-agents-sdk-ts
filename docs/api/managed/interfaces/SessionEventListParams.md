[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [managed](../README.md) / SessionEventListParams

# Interface: SessionEventListParams

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

Return events created after this time (exclusive). Compared against the event's
`processed_at` value.

***

### created\_at\[gte\]?

> `optional` **created\_at\[gte\]?**: `string`

Return events created at or after this time (inclusive). Compared against the
event's `processed_at` value.

***

### created\_at\[lt\]?

> `optional` **created\_at\[lt\]?**: `string`

Return events created before this time (exclusive). Compared against the event's
`processed_at` value.

***

### created\_at\[lte\]?

> `optional` **created\_at\[lte\]?**: `string`

Return events created at or before this time (inclusive). Compared against the
event's `processed_at` value.

***

### limit?

> `optional` **limit?**: `number`

Query parameter for limit

***

### order?

> `optional` **order?**: [`SessionEventListParamsOrder`](../type-aliases/SessionEventListParamsOrder.md)

Sort direction for results, ordered by the event's `processed_at`. Defaults to
`asc` (chronological).

Any of "asc", "desc".

***

### page?

> `optional` **page?**: `string`

Opaque pagination cursor from a previous response's `next_page`.

***

### types?

> `optional` **types?**: `string`[]

Filter by event type. Values match the `type` field on returned events (for
example, `user.message` or `agent.tool_use`). Omit to return all event types.

***

### workspace\_id?

> `optional` **workspace\_id?**: `string`
