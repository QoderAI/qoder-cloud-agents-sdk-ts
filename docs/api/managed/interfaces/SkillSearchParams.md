[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [managed](../README.md) / SkillSearchParams

# Interface: SkillSearchParams

JSON body filters for skills Search.

## Properties

### betas?

> `optional` **betas?**: `string`[]

Additional betas; Search is always included.

***

### display\_title?

> `optional` **display\_title?**: `string`

Case-insensitive Skill display-title substring filter.

***

### limit?

> `optional` **limit?**: `number`

Page size; default 20, maximum 100.

***

### metadata?

> `optional` **metadata?**: `Record`\<`string`, `string`\>

Exact string metadata filters combined with AND (at most 16 entries).

***

### ~~name?~~

> `optional` **name?**: `string`

#### Deprecated

Use display_title instead.

***

### page?

> `optional` **page?**: `string`

Opaque next_page cursor returned by the previous search response.

***

### source?

> `optional` **source?**: `"qoder"` \| `"custom"`

***

### workspace\_id?

> `optional` **workspace\_id?**: `string`
