[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [forward](../README.md) / BatchTaskListParams

# Interface: BatchTaskListParams

## Indexable

> \[`key`: `string`\]: `unknown`

Additional fields are preserved verbatim by the SDK.

## Properties

### after\_id?

> `optional` **after\_id?**: `string` \| `null`

向后翻页游标，传上一页响应的 `last_id`；游标必须属于当前 Batch。

***

### custom\_id?

> `optional` **custom\_id?**: `string` \| `null`

按调用方任务标识精确过滤，仅支持单值；未命中返回空列表。

***

### limit?

> `optional` **limit?**: `number` \| `null`

分页大小，最大 100。

***

### status?

> `optional` **status?**: `string` \| `null`

按任务状态过滤：`pending`、`running`、`completed`、`failed`、`cancelled`、`expired`。
