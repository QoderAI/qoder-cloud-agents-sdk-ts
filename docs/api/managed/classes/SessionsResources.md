[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [managed](../README.md) / SessionsResources

# Class: SessionsResources

## Extends

- `APIResource`

## Constructors

### Constructor

> **new SessionsResources**(`_client`): `SessionsResources`

#### Parameters

##### \_client

[`APIClient`](../../index/classes/APIClient.md)

#### Returns

`SessionsResources`

#### Inherited from

`APIResource.constructor`

## Properties

### \_client

> `protected` `readonly` **\_client**: [`APIClient`](../../index/classes/APIClient.md)

#### Inherited from

`APIResource._client`

## Methods

### add()

> **add**(`sessionID`, `params`, `options?`): [`APIPromise`](../../index/classes/APIPromise.md)\<[`ManagedAgentsFileResource`](../interfaces/ManagedAgentsFileResource.md)\>

Add Session Resource

#### Parameters

##### sessionID

`string`

##### params

[`SessionResourceAddParams`](../interfaces/SessionResourceAddParams.md)

##### options?

[`RequestOptions`](../../index/interfaces/RequestOptions.md)

#### Returns

[`APIPromise`](../../index/classes/APIPromise.md)\<[`ManagedAgentsFileResource`](../interfaces/ManagedAgentsFileResource.md)\>

***

### delete()

> **delete**(`resourceID`, `params`, `options?`): [`APIPromise`](../../index/classes/APIPromise.md)\<[`ManagedAgentsDeleteSessionResource`](../interfaces/ManagedAgentsDeleteSessionResource.md)\>

Delete Session Resource

#### Parameters

##### resourceID

`string`

##### params

[`SessionResourceDeleteParams`](../interfaces/SessionResourceDeleteParams.md)

##### options?

[`RequestOptions`](../../index/interfaces/RequestOptions.md)

#### Returns

[`APIPromise`](../../index/classes/APIPromise.md)\<[`ManagedAgentsDeleteSessionResource`](../interfaces/ManagedAgentsDeleteSessionResource.md)\>

***

### list()

> **list**(`sessionID`, `params?`, `options?`): [`PagePromise`](../../index/classes/PagePromise.md)\<[`ManagedAgentsSessionResourceUnion`](../type-aliases/ManagedAgentsSessionResourceUnion.md)\>

List Session Resources

#### Parameters

##### sessionID

`string`

##### params?

[`SessionResourceListParams`](../interfaces/SessionResourceListParams.md) \| `null` \| `undefined`

##### options?

[`RequestOptions`](../../index/interfaces/RequestOptions.md)

#### Returns

[`PagePromise`](../../index/classes/PagePromise.md)\<[`ManagedAgentsSessionResourceUnion`](../type-aliases/ManagedAgentsSessionResourceUnion.md)\>

***

### retrieve()

> **retrieve**(`resourceID`, `params`, `options?`): [`APIPromise`](../../index/classes/APIPromise.md)\<[`SessionResourceGetResponseUnion`](../type-aliases/SessionResourceGetResponseUnion.md)\>

Get Session Resource

#### Parameters

##### resourceID

`string`

##### params

[`SessionResourceGetParams`](../interfaces/SessionResourceGetParams.md)

##### options?

[`RequestOptions`](../../index/interfaces/RequestOptions.md)

#### Returns

[`APIPromise`](../../index/classes/APIPromise.md)\<[`SessionResourceGetResponseUnion`](../type-aliases/SessionResourceGetResponseUnion.md)\>

***

### update()

> **update**(`resourceID`, `params`, `options?`): [`APIPromise`](../../index/classes/APIPromise.md)\<[`SessionResourceUpdateResponseUnion`](../type-aliases/SessionResourceUpdateResponseUnion.md)\>

Update Session Resource

#### Parameters

##### resourceID

`string`

##### params

[`SessionResourceUpdateParams`](../interfaces/SessionResourceUpdateParams.md)

##### options?

[`RequestOptions`](../../index/interfaces/RequestOptions.md)

#### Returns

[`APIPromise`](../../index/classes/APIPromise.md)\<[`SessionResourceUpdateResponseUnion`](../type-aliases/SessionResourceUpdateResponseUnion.md)\>
