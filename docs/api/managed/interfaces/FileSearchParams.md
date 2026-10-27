[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [managed](../README.md) / FileSearchParams

# Interface: FileSearchParams

JSON body filters for files Search.

## Properties

### betas?

> `optional` **betas?**: `string`[]

Additional betas; Search is always included.

***

### limit?

> `optional` **limit?**: `number`

Page size; default 20, maximum 100.

***

### metadata?

> `optional` **metadata?**: `Record`\<`string`, `string`\>

Exact string metadata filters combined with AND (at most 16 entries).

***

### name?

> `optional` **name?**: `string`

Case-insensitive name substring filter.

***

### page?

> `optional` **page?**: `string`

Opaque next_page cursor returned by the previous search response.

***

### scope\_id?

> `optional` **scope\_id?**: `string`

Resource scope ID, currently a Session ID.

***

### workspace\_id?

> `optional` **workspace\_id?**: `string`
