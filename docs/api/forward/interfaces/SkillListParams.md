[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [forward](../README.md) / SkillListParams

# Interface: SkillListParams

## Indexable

> \[`key`: `string`\]: `unknown`

Additional fields are preserved verbatim by the SDK.

## Properties

### after\_id?

> `optional` **after\_id?**: `string` \| `null`

向后翻页游标；与 `page`、`before_id` 互斥。

***

### before\_id?

> `optional` **before\_id?**: `string` \| `null`

向前翻页游标；与 `page`、`after_id` 互斥。

***

### display\_title?

> `optional` **display\_title?**: `string` \| `null`

按 Skill 展示名前缀搜索，不区分大小写。

***

### limit?

> `optional` **limit?**: `number` \| `null`

分页大小，最大 100。

***

### name?

> `optional` **name?**: `string` \| `null`

⚠️ **已弃用**：`display_title` 的兼容别名，语义完全一致。请使用 `display_title`。

***

### page?

> `optional` **page?**: `string` \| `null`

分页游标（推荐使用），取值来自上一页响应的 `next_page`；与 `after_id`、`before_id` 互斥。

***

### source?

> `optional` **source?**: `string` \| `null`

按 Skill 来源过滤，可选 `custom`、`qoder`。传 `source` 时不支持 `before_id`。
