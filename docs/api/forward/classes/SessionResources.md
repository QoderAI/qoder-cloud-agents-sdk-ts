[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [forward](../README.md) / SessionResources

# Class: SessionResources

## Extends

- `APIResource`

## Constructors

### Constructor

> **new SessionResources**(`_client`): `SessionResources`

#### Parameters

##### \_client

[`APIClient`](../../index/classes/APIClient.md)

#### Returns

`SessionResources`

#### Inherited from

`APIResource.constructor`

## Properties

### \_client

> `protected` `readonly` **\_client**: [`APIClient`](../../index/classes/APIClient.md)

#### Inherited from

`APIResource._client`

## Methods

### add()

> **add**(`sessionID`, `params`, `options?`): [`APIPromise`](../../index/classes/APIPromise.md)\<[`SessionResource`](../interfaces/SessionResource.md)\>

添加 Session 资源.

#### Parameters

##### sessionID

`string`

##### params

[`SessionResourceAddParams`](../interfaces/SessionResourceAddParams.md)

##### options?

[`RequestOptions`](../../index/interfaces/RequestOptions.md)

#### Returns

[`APIPromise`](../../index/classes/APIPromise.md)\<[`SessionResource`](../interfaces/SessionResource.md)\>

#### Operation

addSessionResource
