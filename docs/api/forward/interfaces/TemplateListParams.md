[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [forward](../README.md) / TemplateListParams

# Interface: TemplateListParams

## Indexable

> \[`key`: `string`\]: `unknown`

Additional fields are preserved verbatim by the SDK.

## Properties

### after\_id?

> `optional` **after\_id?**: `string` \| `null`

向后翻页游标，不能与 `before_id` 同用。

***

### before\_id?

> `optional` **before\_id?**: `string` \| `null`

向前翻页游标，不能与 `after_id` 同用。

***

### limit?

> `optional` **limit?**: `number` \| `null`

分页大小，最大 100。

***

### status?

> `optional` **status?**: `string` \| `null`

按 `active` 或 `archived` 过滤。
