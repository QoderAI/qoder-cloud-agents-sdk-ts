[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [forward](../README.md) / ChannelQRSessions

# Class: ChannelQRSessions

## Extends

- `APIResource`

## Constructors

### Constructor

> **new ChannelQRSessions**(`_client`): `ChannelQRSessions`

#### Parameters

##### \_client

[`APIClient`](../../index/classes/APIClient.md)

#### Returns

`ChannelQRSessions`

#### Inherited from

`APIResource.constructor`

## Properties

### \_client

> `protected` `readonly` **\_client**: [`APIClient`](../../index/classes/APIClient.md)

#### Inherited from

`APIResource._client`

## Methods

### create()

> **create**(`channelID`, `params?`, `options?`): [`APIPromise`](../../index/classes/APIPromise.md)\<[`ChannelQRSession`](../interfaces/ChannelQRSession.md)\>

创建 Channel QR Session.

#### Parameters

##### channelID

`string`

##### params?

[`ChannelQRSessionNewParams`](../interfaces/ChannelQRSessionNewParams.md) = `{}`

##### options?

[`RequestOptions`](../../index/interfaces/RequestOptions.md)

#### Returns

[`APIPromise`](../../index/classes/APIPromise.md)\<[`ChannelQRSession`](../interfaces/ChannelQRSession.md)\>

#### Operation

createChannelQrSession

***

### retrieve()

> **retrieve**(`sessionKey`, `options?`): [`APIPromise`](../../index/classes/APIPromise.md)\<[`ChannelQRSession`](../interfaces/ChannelQRSession.md)\>

获取 Channel QR Session.

#### Parameters

##### sessionKey

`string`

##### options?

[`RequestOptions`](../../index/interfaces/RequestOptions.md)

#### Returns

[`APIPromise`](../../index/classes/APIPromise.md)\<[`ChannelQRSession`](../interfaces/ChannelQRSession.md)\>

#### Operation

getChannelQrSession
