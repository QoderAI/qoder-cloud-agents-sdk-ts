[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [forward](../README.md) / FileSearchParams

# Interface: FileSearchParams

JSON body filters for files Search.

## Properties

### identity\_id?

> `optional` **identity\_id?**: `string`

Select Identity ownership with a PAT; omit with any SAT. Sent in the query only.

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
