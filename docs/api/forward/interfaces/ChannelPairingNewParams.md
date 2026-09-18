[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [forward](../README.md) / ChannelPairingNewParams

# Interface: ChannelPairingNewParams

## Indexable

> \[`key`: `string`\]: `unknown`

Additional fields are preserved verbatim by the SDK.

## Properties

### code

> **code**: `string`

Channel 消息中显示的 6 位配对码。

***

### idempotency\_key?

> `optional` **idempotency\_key?**: `string` \| `null`

由客户端生成的唯一幂等键，用于安全重试同一次配对请求。

***

### identity\_id

> **identity\_id**: `string`

要绑定的 Forward Identity ID。

***

### template\_id

> **template\_id**: `string`

要绑定的 Forward Template ID。
