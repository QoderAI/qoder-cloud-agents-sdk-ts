[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [forward](../README.md) / Channels

# Class: Channels

## Extends

- `APIResource`

## Constructors

### Constructor

> **new Channels**(`_client`): `Channels`

#### Parameters

##### \_client

[`APIClient`](../../index/classes/APIClient.md)

#### Returns

`Channels`

#### Inherited from

`APIResource.constructor`

## Properties

### \_client

> `protected` `readonly` **\_client**: [`APIClient`](../../index/classes/APIClient.md)

#### Inherited from

`APIResource._client`

***

### qrSessions

> `readonly` **qrSessions**: [`ChannelQRSessions`](ChannelQRSessions.md)

## Methods

### create()

> **create**(`params`, `options?`): [`APIPromise`](../../index/classes/APIPromise.md)\<[`Channel`](../interfaces/Channel.md)\>

创建 Channel.

#### Parameters

##### params

[`ChannelNewParams`](../interfaces/ChannelNewParams.md)

##### options?

[`RequestOptions`](../../index/interfaces/RequestOptions.md)

#### Returns

[`APIPromise`](../../index/classes/APIPromise.md)\<[`Channel`](../interfaces/Channel.md)\>

#### Operation

createChannel

***

### delete()

> **delete**(`channelID`, `options?`): [`APIPromise`](../../index/classes/APIPromise.md)\<[`DeletedChannel`](../interfaces/DeletedChannel.md)\>

删除 Channel.

#### Parameters

##### channelID

`string`

##### options?

[`RequestOptions`](../../index/interfaces/RequestOptions.md)

#### Returns

[`APIPromise`](../../index/classes/APIPromise.md)\<[`DeletedChannel`](../interfaces/DeletedChannel.md)\>

#### Operation

deleteChannel

***

### list()

> **list**(`params?`, `options?`): [`PagePromise`](../../index/classes/PagePromise.md)\<[`Channel`](../interfaces/Channel.md)\>

列出 Channels.

#### Parameters

##### params?

[`ChannelListParams`](../interfaces/ChannelListParams.md) = `{}`

##### options?

[`RequestOptions`](../../index/interfaces/RequestOptions.md)

#### Returns

[`PagePromise`](../../index/classes/PagePromise.md)\<[`Channel`](../interfaces/Channel.md)\>

#### Operation

listChannels

***

### retrieve()

> **retrieve**(`channelID`, `options?`): [`APIPromise`](../../index/classes/APIPromise.md)\<[`Channel`](../interfaces/Channel.md)\>

获取 Channel.

#### Parameters

##### channelID

`string`

##### options?

[`RequestOptions`](../../index/interfaces/RequestOptions.md)

#### Returns

[`APIPromise`](../../index/classes/APIPromise.md)\<[`Channel`](../interfaces/Channel.md)\>

#### Operation

getChannel

***

### update()

> **update**(`channelID`, `params?`, `options?`): [`APIPromise`](../../index/classes/APIPromise.md)\<[`Channel`](../interfaces/Channel.md)\>

更新 Channel.

#### Parameters

##### channelID

`string`

##### params?

[`ChannelUpdateParams`](../interfaces/ChannelUpdateParams.md) = `{}`

##### options?

[`RequestOptions`](../../index/interfaces/RequestOptions.md)

#### Returns

[`APIPromise`](../../index/classes/APIPromise.md)\<[`Channel`](../interfaces/Channel.md)\>

#### Operation

updateChannel
