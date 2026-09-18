[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [forward](../README.md) / ScheduleRunListParams

# Interface: ScheduleRunListParams

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

### has\_error?

> `optional` **has\_error?**: `boolean` \| `null`

是否只返回有错误或无错误的 Run。

***

### identity\_id

> **identity\_id**: `string`

Run 所属 Forward Identity ID。

***

### limit?

> `optional` **limit?**: `number` \| `null`

分页大小，最大 100。

***

### order?

> `optional` **order?**: `string` \| `null`

排序方向：`asc` 或 `desc`。

***

### schedule\_id?

> `optional` **schedule\_id?**: `string` \| `null`

按 Schedule ID 过滤。

***

### sort\_by?

> `optional` **sort\_by?**: `string` \| `null`

排序字段：`created_at` 或 `triggered_at`。

***

### status?

> `optional` **status?**: `string` \| `null`

按 `pending`、`running`、`completed`、`failed` 或 `skipped` 过滤。

***

### trigger\_type?

> `optional` **trigger\_type?**: `string` \| `null`

按 `schedule` 或 `manual` 过滤。
