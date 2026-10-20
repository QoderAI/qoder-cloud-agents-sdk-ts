[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [forward](../README.md) / ChannelPairingNewParams

# Interface: ChannelPairingNewParams

## Indexable

> \[`key`: `string`\]: `unknown`

Additional fields are preserved verbatim by the SDK.

## Properties

### channel\_pairing\_id?

> `optional` **channel\_pairing\_id?**: `string`

Pending pairing ID. Supply exactly one of code or channel_pairing_id.

***

### code?

> `optional` **code?**: `string`

Channel 消息中的配对码；与 channel_pairing_id 二选一。

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
