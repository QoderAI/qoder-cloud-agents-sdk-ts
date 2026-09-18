[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [forward](../README.md) / SessionEventListParams

# Interface: SessionEventListParams

## Indexable

> \[`key`: `string`\]: `unknown`

Additional fields are preserved verbatim by the SDK.

## Properties

### after\_id?

> `optional` **after\_id?**: `string` \| `null`

返回该 Event ID 之后的事件。

***

### before\_id?

> `optional` **before\_id?**: `string` \| `null`

返回该 Event ID 之前的事件。

***

### include\_thinking?

> `optional` **include\_thinking?**: `boolean` \| `null`

是否包含思考过程事件。

***

### include\_tool\_calls?

> `optional` **include\_tool\_calls?**: `boolean` \| `null`

是否包含工具调用类事件。

***

### limit?

> `optional` **limit?**: `number` \| `null`

分页大小，最大 100。

***

### order?

> `optional` **order?**: `string` \| `null`

排序方向：`asc` 或 `desc`。

***

### type?

> `optional` **type?**: `string` \| `null`

按 Event 类型过滤，支持逗号分隔。

***

### types\[\]?

> `optional` **types\[\]?**: `string`[] \| `null`

数组形式的 Event 类型过滤。
