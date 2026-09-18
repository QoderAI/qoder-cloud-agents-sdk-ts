[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [forward](../README.md) / MemoryStoreMemoryVersionListParams

# Interface: MemoryStoreMemoryVersionListParams

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

### memory\_id?

> `optional` **memory\_id?**: `string` \| `null`

只返回该 memory（`mem_...`）的版本，用于查看单条记忆的变更历史。
