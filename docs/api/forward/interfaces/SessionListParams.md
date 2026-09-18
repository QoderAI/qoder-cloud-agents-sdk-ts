[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [forward](../README.md) / SessionListParams

# Interface: SessionListParams

## Indexable

> \[`key`: `string`\]: `unknown`

Additional fields are preserved verbatim by the SDK.

## Properties

### after\_id?

> `optional` **after\_id?**: `string` \| `null`

向后翻页游标，传入上一页响应的 `last_id`。

***

### before\_id?

> `optional` **before\_id?**: `string` \| `null`

向前翻页游标，传入当前页响应的 `first_id`。

***

### created\_at\[gt\]?

> `optional` **created\_at\[gt\]?**: `string` \| `null`

创建时间严格大于该 RFC 3339 时间。

***

### created\_at\[gte\]?

> `optional` **created\_at\[gte\]?**: `string` \| `null`

创建时间大于等于该 RFC 3339 时间。

***

### created\_at\[lt\]?

> `optional` **created\_at\[lt\]?**: `string` \| `null`

创建时间严格小于该 RFC 3339 时间。

***

### created\_at\[lte\]?

> `optional` **created\_at\[lte\]?**: `string` \| `null`

创建时间小于等于该 RFC 3339 时间。

***

### identity\_ids?

> `optional` **identity\_ids?**: `string`[] \| `null`

按一个或多个 Identity ID 过滤，支持逗号分隔。

***

### include\_archived?

> `optional` **include\_archived?**: `boolean` \| `null`

是否包含已归档 Session。

***

### limit?

> `optional` **limit?**: `number` \| `null`

分页大小，最大 100。

***

### order?

> `optional` **order?**: `string` \| `null`

创建时间排序方向：`desc` 或 `asc`。

***

### source\_type?

> `optional` **source\_type?**: `string` \| `null`

按 `api`、`im`、`schedule` 或 `batch` 过滤。

***

### template\_id?

> `optional` **template\_id?**: `string` \| `null`

按 Forward Template ID 过滤。

***

### updated\_at\[gt\]?

> `optional` **updated\_at\[gt\]?**: `string` \| `null`

更新时间严格大于该 RFC 3339 时间。

***

### updated\_at\[gte\]?

> `optional` **updated\_at\[gte\]?**: `string` \| `null`

更新时间大于等于该 RFC 3339 时间。

***

### updated\_at\[lt\]?

> `optional` **updated\_at\[lt\]?**: `string` \| `null`

更新时间严格小于该 RFC 3339 时间。

***

### updated\_at\[lte\]?

> `optional` **updated\_at\[lte\]?**: `string` \| `null`

更新时间小于等于该 RFC 3339 时间。
