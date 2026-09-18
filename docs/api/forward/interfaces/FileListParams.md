[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [forward](../README.md) / FileListParams

# Interface: FileListParams

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

### limit?

> `optional` **limit?**: `number` \| `null`

分页大小，最大 100。

***

### name?

> `optional` **name?**: `string` \| `null`

按文件名搜索。

***

### page?

> `optional` **page?**: `string` \| `null`

分页游标（推荐使用），取值来自上一页响应的 `next_page`；与 `after_id`、`before_id` 互斥。

***

### scope\_id?

> `optional` **scope\_id?**: `string` \| `null`

按资源作用域 ID 过滤，常用于 Session 资源文件查询。传入时不要同时使用 `before_id` 或 `after_id`；当前游标参数在该过滤模式下不生效。
