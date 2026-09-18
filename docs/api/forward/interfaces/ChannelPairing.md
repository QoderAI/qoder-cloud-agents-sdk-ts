[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [forward](../README.md) / ChannelPairing

# Interface: ChannelPairing

## Indexable

> \[`key`: `string`\]: `unknown`

Additional fields are preserved verbatim by the SDK.

## Properties

### channel\_id

> **channel\_id**: `string`

Channel ID。

***

### id

> **id**: `string`

Pairing ID，解除配对时使用。

***

### identity\_id

> **identity\_id**: `string`

已绑定的 Forward Identity ID。

***

### paired\_at

> **paired\_at**: `string`

配对完成时间。

***

### status

> **status**: `string`

配对成功时为 `active`。

***

### template\_id

> **template\_id**: `string`

已绑定的 Forward Template ID。

***

### type

> **type**: `string`

固定为 `channel_pairing`。
