[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [managed](../README.md) / OAuth

# Class: OAuth

## Extends

- `APIResource`

## Constructors

### Constructor

> **new OAuth**(`_client`): `OAuth`

#### Parameters

##### \_client

[`APIClient`](../../index/classes/APIClient.md)

#### Returns

`OAuth`

#### Inherited from

`APIResource.constructor`

## Properties

### \_client

> `protected` `readonly` **\_client**: [`APIClient`](../../index/classes/APIClient.md)

#### Inherited from

`APIResource._client`

## Methods

### start()

> **start**(`params`, `options?`): [`APIPromise`](../../index/classes/APIPromise.md)\<[`OAuthStartResponse`](../interfaces/OAuthStartResponse.md)\>

Returns an authorization URL; the user completes authorization in their browser.

#### Parameters

##### params

[`OAuthStartParams`](../interfaces/OAuthStartParams.md)

##### options?

[`RequestOptions`](../../index/interfaces/RequestOptions.md)

#### Returns

[`APIPromise`](../../index/classes/APIPromise.md)\<[`OAuthStartResponse`](../interfaces/OAuthStartResponse.md)\>
