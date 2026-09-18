[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [forward](../README.md) / ChannelListParams

# Interface: ChannelListParams

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

### binding\_status?

> `optional` **binding\_status?**: `string` \| `null`

按 `unbound`、`bound` 或 `expired` 过滤。

***

### channel\_type?

> `optional` **channel\_type?**: `string` \| `null`

按 `wechat`、`wecom`、`feishu`、`dingtalk` 或 `teams`（Global）过滤。

***

### enabled?

> `optional` **enabled?**: `boolean` \| `null`

按人工启停状态过滤。

***

### identity\_id?

> `optional` **identity\_id?**: `string` \| `null`

按 Forward Identity ID 过滤。

***

### limit?

> `optional` **limit?**: `number` \| `null`

分页大小，最大 100。

***

### template\_id?

> `optional` **template\_id?**: `string` \| `null`

按 Forward Template ID 过滤。
