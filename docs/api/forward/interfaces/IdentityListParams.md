[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [forward](../README.md) / IdentityListParams

# Interface: IdentityListParams

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

### enabled?

> `optional` **enabled?**: `boolean` \| `null`

按是否启用过滤；非布尔值返回 400。

***

### external\_id?

> `optional` **external\_id?**: `string` \| `null`

按集成方终端用户 ID 过滤。

***

### identity\_ids?

> `optional` **identity\_ids?**: `string`[] \| `null`

按多个 Identity ID 过滤；支持逗号分隔或重复 query 参数，去重后最多 100 个。

***

### limit?

> `optional` **limit?**: `number` \| `null`

分页大小，最大 100；超过上限时按最大值处理。

***

### search?

> `optional` **search?**: `string` \| `null`

匹配 Identity ID、名称或外部 ID。
