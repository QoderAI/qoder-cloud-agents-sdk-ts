[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [managed](../README.md) / FileListParams

# Interface: FileListParams

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

### ids?

> `optional` **ids?**: `string`[]

Restrict the result set to Files whose `id` is in this list. At most 100 entries
(after de-duplication). Mutually exclusive with `page` and `limit`. When
supplied, the response is always a single page (`next_page` is null). IDs that
do not resolve to a visible File — including deleted Files — are silently
omitted.

***

### limit?

> `optional` **limit?**: `number`

Number of items to return per page.

Defaults to `20`. Ranges from `1` to `1000`.

***

### name?

> `optional` **name?**: `string`

***

### page?

> `optional` **page?**: `string`

Opaque page cursor returned in a prior list response's `next_page`. Prefixed
`page_`.

***

### scope\_id?

> `optional` **scope\_id?**: `string`

Filter by scope ID. Only returns files associated with the specified scope
(e.g., a session ID).

***

### workspace\_id?

> `optional` **workspace\_id?**: `string`
