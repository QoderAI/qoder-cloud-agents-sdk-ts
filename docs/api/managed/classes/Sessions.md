[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [managed](../README.md) / Sessions

# Class: Sessions

## Extends

- `APIResource`

## Constructors

### Constructor

> **new Sessions**(`_client`): `Sessions`

#### Parameters

##### \_client

[`APIClient`](../../index/classes/APIClient.md)

#### Returns

`Sessions`

#### Inherited from

`APIResource.constructor`

## Properties

### \_client

> `protected` `readonly` **\_client**: [`APIClient`](../../index/classes/APIClient.md)

#### Inherited from

`APIResource._client`

***

### events

> `readonly` **events**: [`SessionsEvents`](SessionsEvents.md)

***

### resources

> `readonly` **resources**: [`SessionsResources`](SessionsResources.md)

***

### threads

> `readonly` **threads**: [`SessionsThreads`](SessionsThreads.md)

## Methods

### archive()

> **archive**(`sessionID`, `params?`, `options?`): [`APIPromise`](../../index/classes/APIPromise.md)\<[`ManagedAgentsSession`](../interfaces/ManagedAgentsSession.md)\>

Archive Session

#### Parameters

##### sessionID

`string`

##### params?

[`SessionArchiveParams`](../interfaces/SessionArchiveParams.md) \| `null` \| `undefined`

##### options?

[`RequestOptions`](../../index/interfaces/RequestOptions.md)

#### Returns

[`APIPromise`](../../index/classes/APIPromise.md)\<[`ManagedAgentsSession`](../interfaces/ManagedAgentsSession.md)\>

***

### create()

> **create**(`params`, `options?`): [`APIPromise`](../../index/classes/APIPromise.md)\<[`ManagedAgentsSession`](../interfaces/ManagedAgentsSession.md)\>

Create Session

#### Parameters

##### params

[`SessionNewParams`](../interfaces/SessionNewParams.md)

##### options?

[`RequestOptions`](../../index/interfaces/RequestOptions.md)

#### Returns

[`APIPromise`](../../index/classes/APIPromise.md)\<[`ManagedAgentsSession`](../interfaces/ManagedAgentsSession.md)\>

***

### delete()

> **delete**(`sessionID`, `params?`, `options?`): [`APIPromise`](../../index/classes/APIPromise.md)\<[`ManagedAgentsDeletedSession`](../interfaces/ManagedAgentsDeletedSession.md)\>

Delete Session

#### Parameters

##### sessionID

`string`

##### params?

[`SessionDeleteParams`](../interfaces/SessionDeleteParams.md) \| `null` \| `undefined`

##### options?

[`RequestOptions`](../../index/interfaces/RequestOptions.md)

#### Returns

[`APIPromise`](../../index/classes/APIPromise.md)\<[`ManagedAgentsDeletedSession`](../interfaces/ManagedAgentsDeletedSession.md)\>

***

### list()

> **list**(`params?`, `options?`): [`PagePromise`](../../index/classes/PagePromise.md)\<[`ManagedAgentsSession`](../interfaces/ManagedAgentsSession.md)\>

List Sessions

#### Parameters

##### params?

[`SessionListParams`](../interfaces/SessionListParams.md) \| `null` \| `undefined`

##### options?

[`RequestOptions`](../../index/interfaces/RequestOptions.md)

#### Returns

[`PagePromise`](../../index/classes/PagePromise.md)\<[`ManagedAgentsSession`](../interfaces/ManagedAgentsSession.md)\>

***

### retrieve()

> **retrieve**(`sessionID`, `params?`, `options?`): [`APIPromise`](../../index/classes/APIPromise.md)\<[`ManagedAgentsSession`](../interfaces/ManagedAgentsSession.md)\>

Get Session

#### Parameters

##### sessionID

`string`

##### params?

[`SessionGetParams`](../interfaces/SessionGetParams.md) \| `null` \| `undefined`

##### options?

[`RequestOptions`](../../index/interfaces/RequestOptions.md)

#### Returns

[`APIPromise`](../../index/classes/APIPromise.md)\<[`ManagedAgentsSession`](../interfaces/ManagedAgentsSession.md)\>

***

### update()

> **update**(`sessionID`, `params?`, `options?`): [`APIPromise`](../../index/classes/APIPromise.md)\<[`ManagedAgentsSession`](../interfaces/ManagedAgentsSession.md)\>

Update Session

#### Parameters

##### sessionID

`string`

##### params?

[`SessionUpdateParams`](../interfaces/SessionUpdateParams.md) \| `null` \| `undefined`

##### options?

[`RequestOptions`](../../index/interfaces/RequestOptions.md)

#### Returns

[`APIPromise`](../../index/classes/APIPromise.md)\<[`ManagedAgentsSession`](../interfaces/ManagedAgentsSession.md)\>
