[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [forward](../README.md) / MemoryStoreListParams

# Interface: MemoryStoreListParams

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

### system\_managed?

> `optional` **system\_managed?**: `boolean` \| `null`

三态过滤：`true` 只返回系统默认库；`false` 只返回用户创建的库；不传不过滤。
