[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [managed](../README.md) / VaultSearchParams

# Interface: VaultSearchParams

JSON body filters for vaults Search.

## Properties

### betas?

> `optional` **betas?**: `string`[]

Additional betas; Search is always included.

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

### workspace\_id?

> `optional` **workspace\_id?**: `string`
