[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [managed](../README.md) / MemoryStoreListParams

# Interface: MemoryStoreListParams

## Properties

### betas?

> `optional` **betas?**: `string`[]

Optional header to specify the beta version(s) you want to use.

***

### created\_at\[gte\]?

> `optional` **created\_at\[gte\]?**: `string`

Return only stores whose `created_at` is at or after this time (inclusive). Sent
on the wire as `created_at`gte``.

***

### created\_at\[lte\]?

> `optional` **created\_at\[lte\]?**: `string`

Return only stores whose `created_at` is at or before this time (inclusive).
Sent on the wire as `created_at`lte``.

***

### include\_archived?

> `optional` **include\_archived?**: `boolean`

When `true`, archived stores are included in the results. Defaults to `false`
(archived stores are excluded).

***

### limit?

> `optional` **limit?**: `number`

Maximum number of stores to return per page. Must be between 1 and 100. Defaults
to 20 when omitted.

***

### name?

> `optional` **name?**: `string`

***

### page?

> `optional` **page?**: `string`

Opaque pagination cursor (a `page_...` value). Pass the `next_page` value from a
previous response to fetch the next page; omit for the first page.

***

### workspace\_id?

> `optional` **workspace\_id?**: `string`
