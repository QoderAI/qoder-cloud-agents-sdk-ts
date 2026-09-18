[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [forward](../README.md) / ScheduleListParams

# Interface: ScheduleListParams

## Indexable

> \[`key`: `string`\]: `unknown`

Additional fields are preserved verbatim by the SDK.

## Properties

### after\_id?

> `optional` **after\_id?**: `string` \| `null`

向后翻页游标。

***

### before\_id?

> `optional` **before\_id?**: `string` \| `null`

向前翻页游标。

***

### identity\_id?

> `optional` **identity\_id?**: `string` \| `null`

PAT 或管理员 SAT 可省略，省略时查询当前 owner 全部 Identity；Identity-bound SAT 省略时自动绑定自身，显式传其他 Identity 返回 403。

***

### include\_archived?

> `optional` **include\_archived?**: `boolean` \| `null`

是否包含已归档 Schedule。

***

### limit?

> `optional` **limit?**: `number` \| `null`

分页大小，最大 100。

***

### order?

> `optional` **order?**: `string` \| `null`

排序方向：`asc` 或 `desc`。

***

### sort\_by?

> `optional` **sort\_by?**: `string` \| `null`

排序字段：`created_at` 或 `upcoming_runs_at`。

***

### status?

> `optional` **status?**: `string` \| `null`

按 `active` 或 `paused` 过滤。

***

### template\_id?

> `optional` **template\_id?**: `string` \| `null`

按 Forward Template ID 过滤。
