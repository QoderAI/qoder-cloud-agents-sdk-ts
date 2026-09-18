[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [forward](../README.md) / Channel

# Interface: Channel

## Indexable

> \[`key`: `string`\]: `unknown`

Additional fields are preserved verbatim by the SDK.

## Properties

### binding\_status

> **binding\_status**: `string`

`unbound`、`bound` 或 `expired`。

***

### channel\_config

> **channel\_config**: [`ChannelChannelConfig`](ChannelChannelConfig.md)

***

### channel\_type

> **channel\_type**: `string`

外部渠道类型。

***

### created\_at

> **created\_at**: `string`

***

### enabled

> **enabled**: `boolean`

人工启停开关。

***

### id

> **id**: `string`

Channel ID，示例前缀 `channel_`。

***

### identity\_id

> **identity\_id**: `string` \| `null`

`fixed` 模式为绑定的 Forward Identity ID；`pairing` 模式为 `null`。

***

### identity\_resolution

> **identity\_resolution**: [`ChannelIdentityResolution`](ChannelIdentityResolution.md)

***

### name

> **name**: `string`

***

### template\_id

> **template\_id**: `string` \| `null`

`fixed` 模式为绑定的 Forward Template ID；`pairing` 模式为 `null`。

***

### type

> **type**: `string`

固定为 `channel`。

***

### updated\_at

> **updated\_at**: `string`
