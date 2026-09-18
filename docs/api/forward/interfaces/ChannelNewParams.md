[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [forward](../README.md) / ChannelNewParams

# Interface: ChannelNewParams

## Indexable

> \[`key`: `string`\]: `unknown`

Additional fields are preserved verbatim by the SDK.

## Properties

### channel\_config?

> `optional` **channel\_config?**: `Record`\<`string`, `unknown`\> \| `null`

***

### channel\_type

> **channel\_type**: `string`

渠道类型，当前支持 `wechat`、`wecom`、`feishu`、`dingtalk` 和 `teams`（Global）。

***

### enabled?

> `optional` **enabled?**: `boolean` \| `null`

人工启停开关，默认 `true`。传 `false` 可创建后暂不处理上行消息。

***

### idempotency\_key?

> `optional` **idempotency\_key?**: `string` \| `null`

有副作用请求可选的幂等键。

***

### identity\_id?

> `optional` **identity\_id?**: `string` \| `null`

`fixed` 模式必填；`pairing` 模式不传。

***

### identity\_resolution?

> `optional` **identity\_resolution?**: `Record`\<`string`, `unknown`\> \| `null`

***

### name?

> `optional` **name?**: `string` \| `null`

Channel 展示名。

***

### template\_id?

> `optional` **template\_id?**: `string` \| `null`

`fixed` 模式必填；`pairing` 模式不传。
