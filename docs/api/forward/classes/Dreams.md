[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [forward](../README.md) / Dreams

# Class: Dreams

Forward memory consolidation; requires PAT or an admin SAT.

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

> **archive**(`dreamID`, `options?`): [`APIPromise`](../../index/classes/APIPromise.md)\<[`Dream`](../interfaces/Dream.md)\>

#### Parameters

##### dreamID

`string`

##### options?

[`RequestOptions`](../../index/interfaces/RequestOptions.md)

#### Returns

[`APIPromise`](../../index/classes/APIPromise.md)\<[`Dream`](../interfaces/Dream.md)\>

***

### cancel()

> **cancel**(`dreamID`, `options?`): [`APIPromise`](../../index/classes/APIPromise.md)\<[`Dream`](../interfaces/Dream.md)\>

#### Parameters

##### dreamID

`string`

##### options?

[`RequestOptions`](../../index/interfaces/RequestOptions.md)

#### Returns

[`APIPromise`](../../index/classes/APIPromise.md)\<[`Dream`](../interfaces/Dream.md)\>

***

### create()

> **create**(`params`, `options?`): [`APIPromise`](../../index/classes/APIPromise.md)\<[`Dream`](../interfaces/Dream.md)\>

#### Parameters

##### params

[`DreamCreateParams`](../interfaces/DreamCreateParams.md)

##### options?

[`RequestOptions`](../../index/interfaces/RequestOptions.md)

#### Returns

[`APIPromise`](../../index/classes/APIPromise.md)\<[`Dream`](../interfaces/Dream.md)\>

***

### list()

> **list**(`params?`, `options?`): [`PagePromise`](../../index/classes/PagePromise.md)\<[`Dream`](../interfaces/Dream.md)\>

#### Parameters

##### params?

[`DreamListParams`](../interfaces/DreamListParams.md) = `{}`

##### options?

[`RequestOptions`](../../index/interfaces/RequestOptions.md)

#### Returns

[`PagePromise`](../../index/classes/PagePromise.md)\<[`Dream`](../interfaces/Dream.md)\>

***

### retrieve()

> **retrieve**(`dreamID`, `options?`): [`APIPromise`](../../index/classes/APIPromise.md)\<[`Dream`](../interfaces/Dream.md)\>

#### Parameters

##### dreamID

`string`

##### options?

[`RequestOptions`](../../index/interfaces/RequestOptions.md)

#### Returns

[`APIPromise`](../../index/classes/APIPromise.md)\<[`Dream`](../interfaces/Dream.md)\>
