[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [forward](../README.md) / SkillSearchParams

# Interface: SkillSearchParams

JSON body filters for skills Search.

## Properties

### display\_title?

> `optional` **display\_title?**: `string`

Case-insensitive Skill display-title substring filter.

***

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

### page?

> `optional` **page?**: `string`

Opaque next_page cursor returned by the previous search response.

***

### source?

> `optional` **source?**: `"qoder"` \| `"custom"`
