[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [forward](../README.md) / MemoryStoreMemoryListParams

# Interface: MemoryStoreMemoryListParams

## Indexable

> \[`key`: `string`\]: `unknown`

Additional fields are preserved verbatim by the SDK.

## Properties

### after\_id?

> `optional` **after\_id?**: `string` \| `null`

向后翻页游标，与 `before_id` 互斥。

***

### before\_id?

> `optional` **before\_id?**: `string` \| `null`

向前翻页游标，与 `after_id` 互斥。

***

### limit?

> `optional` **limit?**: `number` \| `null`

每页返回数量上限，1..100，默认 20。

***

### path\_prefix?

> `optional` **path\_prefix?**: `string` \| `null`

按 `path` 前缀过滤。**这是纯字符串前缀匹配，不是目录语义** —— `path_prefix=a/b` 也会命中 `a/bc.md`。
