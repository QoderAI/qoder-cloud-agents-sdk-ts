[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [managed](../README.md) / DeploymentSearchParams

# Interface: DeploymentSearchParams

JSON body filters for deployments Search.

## Properties

### agent\_id?

> `optional` **agent\_id?**: `string`

***

### betas?

> `optional` **betas?**: `string`[]

Additional betas; Search is always included.

***

### created\_at\[gte\]?

> `optional` **created\_at\[gte\]?**: `string`

***

### created\_at\[lte\]?

> `optional` **created\_at\[lte\]?**: `string`

***

### include\_archived?

> `optional` **include\_archived?**: `boolean`

Include archived resources; defaults to false.

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

### status?

> `optional` **status?**: `"active"` \| `"paused"`

***

### workspace\_id?

> `optional` **workspace\_id?**: `string`
