[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [forward](../README.md) / IdentityConfigListParams

# Interface: IdentityConfigListParams

## Indexable

> \[`key`: `string`\]: `unknown`

Additional fields are preserved verbatim by the SDK.

## Properties

### after\_id?

> `optional` **after\_id?**: `string` \| `null`

来自上一页响应 `last_id` 的向后游标。

***

### before\_id?

> `optional` **before\_id?**: `string` \| `null`

来自上一页响应 `first_id` 的向前游标。

***

### limit?

> `optional` **limit?**: `number` \| `null`

分页大小，最大 100。

***

### status?

> `optional` **status?**: `string` \| `null`

按 `active` 或 `archived` 过滤。

***

### template\_id?

> `optional` **template\_id?**: `string` \| `null`

按 Forward Template ID 过滤。
