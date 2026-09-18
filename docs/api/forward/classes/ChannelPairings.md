[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [forward](../README.md) / ChannelPairings

# Class: ChannelPairings

## Extends

- `APIResource`

## Constructors

### Constructor

> **new ChannelPairings**(`_client`): `ChannelPairings`

#### Parameters

##### \_client

[`APIClient`](../../index/classes/APIClient.md)

#### Returns

`ChannelPairings`

#### Inherited from

`APIResource.constructor`

## Properties

### \_client

> `protected` `readonly` **\_client**: [`APIClient`](../../index/classes/APIClient.md)

#### Inherited from

`APIResource._client`

## Methods

### create()

> **create**(`params`, `options?`): [`APIPromise`](../../index/classes/APIPromise.md)\<[`ChannelPairing`](../interfaces/ChannelPairing.md)\>

完成 Channel 配对.

#### Parameters

##### params

[`ChannelPairingNewParams`](../interfaces/ChannelPairingNewParams.md)

##### options?

[`RequestOptions`](../../index/interfaces/RequestOptions.md)

#### Returns

[`APIPromise`](../../index/classes/APIPromise.md)\<[`ChannelPairing`](../interfaces/ChannelPairing.md)\>

#### Operation

pairChannel

***

### delete()

> **delete**(`pairingID`, `options?`): [`APIPromise`](../../index/classes/APIPromise.md)\<[`DeletedChannelPairing`](../interfaces/DeletedChannelPairing.md)\>

解除 Channel 配对.

#### Parameters

##### pairingID

`string`

##### options?

[`RequestOptions`](../../index/interfaces/RequestOptions.md)

#### Returns

[`APIPromise`](../../index/classes/APIPromise.md)\<[`DeletedChannelPairing`](../interfaces/DeletedChannelPairing.md)\>

#### Operation

unpairChannel
