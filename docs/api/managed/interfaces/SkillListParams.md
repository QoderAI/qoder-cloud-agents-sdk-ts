[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [managed](../README.md) / SkillListParams

# Interface: SkillListParams

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

### display\_title?

> `optional` **display\_title?**: `string`

***

### limit?

> `optional` **limit?**: `number`

Number of results to return per page.

Ranges from `1` to `1000`. Defaults to `20`.

***

### name?

> `optional` **name?**: `string`

***

### page?

> `optional` **page?**: `string`

Pagination token for fetching a specific page of results.

Pass the value from a previous response's `next_page` field to get the next page
of results.

***

### source?

> `optional` **source?**: `string`

Filter skills by source.

If provided, only skills from the specified source will be returned:

- `"custom"`: only return user-created skills
- `"qoder"`: only return Qoder-created skills

***

### workspace\_id?

> `optional` **workspace\_id?**: `string`
