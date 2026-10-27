[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [managed](../README.md) / SessionSearchParams

# Interface: SessionSearchParams

JSON body filters for sessions Search.

## Properties

### agent\_id?

> `optional` **agent\_id?**: `string`

***

### agent\_version?

> `optional` **agent\_version?**: `number`

***

### betas?

> `optional` **betas?**: `string`[]

Additional betas; Search is always included.

***

### created\_at\[gt\]?

> `optional` **created\_at\[gt\]?**: `string`

***

### created\_at\[gte\]?

> `optional` **created\_at\[gte\]?**: `string`

***

### created\_at\[lt\]?

> `optional` **created\_at\[lt\]?**: `string`

***

### created\_at\[lte\]?

> `optional` **created\_at\[lte\]?**: `string`

***

### deployment\_id?

> `optional` **deployment\_id?**: `string`

***

### include\_archived?

> `optional` **include\_archived?**: `boolean`

Include archived resources; defaults to false.

***

### limit?

> `optional` **limit?**: `number`

Page size; default 20, maximum 100.

***

### memory\_store\_id?

> `optional` **memory\_store\_id?**: `string`

***

### metadata?

> `optional` **metadata?**: `Record`\<`string`, `string`\>

Exact string metadata filters combined with AND (at most 16 entries).

***

### name?

> `optional` **name?**: `string`

Case-insensitive name substring filter.

***

### order?

> `optional` **order?**: `"asc"` \| `"desc"`

***

### page?

> `optional` **page?**: `string`

Opaque next_page cursor returned by the previous search response.

***

### statuses?

> `optional` **statuses?**: (`"running"` \| `"rescheduling"` \| `"idle"` \| `"terminated"`)[]

***

### workspace\_id?

> `optional` **workspace\_id?**: `string`
