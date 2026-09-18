[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [managed](../README.md) / Dreams

# Class: Dreams

## Extends

- `APIResource`

## Constructors

### Constructor

> **new Dreams**(`_client`): `Dreams`

#### Parameters

##### \_client

[`APIClient`](../../index/classes/APIClient.md)

#### Returns

`Dreams`

#### Inherited from

`APIResource.constructor`

## Properties

### \_client

> `protected` `readonly` **\_client**: [`APIClient`](../../index/classes/APIClient.md)

#### Inherited from

`APIResource._client`

## Methods

### archive()

> **archive**(`dreamID`, `params?`, `options?`): [`APIPromise`](../../index/classes/APIPromise.md)\<[`Dream`](../interfaces/Dream.md)\>

Archive a Dream

#### Parameters

##### dreamID

`string`

##### params?

[`DreamArchiveParams`](../interfaces/DreamArchiveParams.md) \| `null` \| `undefined`

##### options?

[`RequestOptions`](../../index/interfaces/RequestOptions.md)

#### Returns

[`APIPromise`](../../index/classes/APIPromise.md)\<[`Dream`](../interfaces/Dream.md)\>

***

### cancel()

> **cancel**(`dreamID`, `params?`, `options?`): [`APIPromise`](../../index/classes/APIPromise.md)\<[`Dream`](../interfaces/Dream.md)\>

Cancel a Dream

#### Parameters

##### dreamID

`string`

##### params?

[`DreamCancelParams`](../interfaces/DreamCancelParams.md) \| `null` \| `undefined`

##### options?

[`RequestOptions`](../../index/interfaces/RequestOptions.md)

#### Returns

[`APIPromise`](../../index/classes/APIPromise.md)\<[`Dream`](../interfaces/Dream.md)\>

***

### create()

> **create**(`params`, `options?`): [`APIPromise`](../../index/classes/APIPromise.md)\<[`Dream`](../interfaces/Dream.md)\>

Create a Dream

#### Parameters

##### params

[`DreamNewParams`](../interfaces/DreamNewParams.md)

##### options?

[`RequestOptions`](../../index/interfaces/RequestOptions.md)

#### Returns

[`APIPromise`](../../index/classes/APIPromise.md)\<[`Dream`](../interfaces/Dream.md)\>

***

### list()

> **list**(`params?`, `options?`): [`PagePromise`](../../index/classes/PagePromise.md)\<[`Dream`](../interfaces/Dream.md)\>

List Dreams

#### Parameters

##### params?

[`DreamListParams`](../interfaces/DreamListParams.md) \| `null` \| `undefined`

##### options?

[`RequestOptions`](../../index/interfaces/RequestOptions.md)

#### Returns

[`PagePromise`](../../index/classes/PagePromise.md)\<[`Dream`](../interfaces/Dream.md)\>

***

### retrieve()

> **retrieve**(`dreamID`, `params?`, `options?`): [`APIPromise`](../../index/classes/APIPromise.md)\<[`Dream`](../interfaces/Dream.md)\>

Get a Dream

#### Parameters

##### dreamID

`string`

##### params?

[`DreamGetParams`](../interfaces/DreamGetParams.md) \| `null` \| `undefined`

##### options?

[`RequestOptions`](../../index/interfaces/RequestOptions.md)

#### Returns

[`APIPromise`](../../index/classes/APIPromise.md)\<[`Dream`](../interfaces/Dream.md)\>
