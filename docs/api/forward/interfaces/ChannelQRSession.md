[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [forward](../README.md) / ChannelQRSession

# Interface: ChannelQRSession

## Indexable

> \[`key`: `string`\]: `unknown`

Additional fields are preserved verbatim by the SDK.

## Properties

### channel\_id

> **channel\_id**: `string`

关联的 Channel ID。

***

### channel\_type

> **channel\_type**: `string`

`wechat`、`feishu`、`dingtalk` 或 `wecom`。

***

### err\_code

> **err\_code**: `string`

null|失败时的渠道错误码。

***

### err\_msg

> **err\_msg**: `string`

null|失败时的渠道错误信息。

***

### expires\_at

> **expires\_at**: `string`

过期时间。

***

### qr\_code\_content

> **qr\_code\_content**: `string`

二维码原始内容，通常是三方授权 URL。

***

### qr\_code\_image\_base64

> **qr\_code\_image\_base64**: `string`

服务端生成的二维码图片。

***

### session\_key

> **session\_key**: `string`

用于轮询状态的不透明 QR session key。

***

### status

> **status**: `string`

初始状态，通常为 `waiting`。
