[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [managed](../README.md) / Models

# Class: Models

## Extends

- `APIResource`

## Constructors

### Constructor

> **new Models**(`_client`): `Models`

#### Parameters

##### \_client

[`APIClient`](../../index/classes/APIClient.md)

#### Returns

`Models`

#### Inherited from

`APIResource.constructor`

## Properties

### \_client

> `protected` `readonly` **\_client**: [`APIClient`](../../index/classes/APIClient.md)

#### Inherited from

`APIResource._client`

## Methods

### list()

> **list**(`params?`, `options?`): [`PagePromise`](../../index/classes/PagePromise.md)\<[`ModelInfo`](../interfaces/ModelInfo.md)\>

List available models.

The Models API response can be used to determine which models are available for
use in the API. More recently released models are listed first.

#### Parameters

##### params?

[`ModelListParams`](../interfaces/ModelListParams.md) \| `null` \| `undefined`

##### options?

[`RequestOptions`](../../index/interfaces/RequestOptions.md)

#### Returns

[`PagePromise`](../../index/classes/PagePromise.md)\<[`ModelInfo`](../interfaces/ModelInfo.md)\>
