[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [managed](../README.md) / SessionsThreads

# Class: SessionsThreads

## Extends

- `APIResource`

## Constructors

### Constructor

> **new SessionsThreads**(`_client`): `SessionsThreads`

#### Parameters

##### \_client

[`APIClient`](../../index/classes/APIClient.md)

#### Returns

`SessionsThreads`

#### Inherited from

`APIResource.constructor`

## Properties

### \_client

> `protected` `readonly` **\_client**: [`APIClient`](../../index/classes/APIClient.md)

#### Inherited from

`APIResource._client`

***

### events

> `readonly` **events**: [`SessionsThreadsEvents`](SessionsThreadsEvents.md)

## Methods

### archive()

> **archive**(`threadID`, `params`, `options?`): [`APIPromise`](../../index/classes/APIPromise.md)\<[`ManagedAgentsSessionThread`](../interfaces/ManagedAgentsSessionThread.md)\>

Archive Session Thread

#### Parameters

##### threadID

`string`

##### params

[`SessionThreadArchiveParams`](../interfaces/SessionThreadArchiveParams.md)

##### options?

[`RequestOptions`](../../index/interfaces/RequestOptions.md)

#### Returns

[`APIPromise`](../../index/classes/APIPromise.md)\<[`ManagedAgentsSessionThread`](../interfaces/ManagedAgentsSessionThread.md)\>

***

### list()

> **list**(`sessionID`, `params?`, `options?`): [`PagePromise`](../../index/classes/PagePromise.md)\<[`ManagedAgentsSessionThread`](../interfaces/ManagedAgentsSessionThread.md)\>

List Session Threads

#### Parameters

##### sessionID

`string`

##### params?

[`SessionThreadListParams`](../interfaces/SessionThreadListParams.md) \| `null` \| `undefined`

##### options?

[`RequestOptions`](../../index/interfaces/RequestOptions.md)

#### Returns

[`PagePromise`](../../index/classes/PagePromise.md)\<[`ManagedAgentsSessionThread`](../interfaces/ManagedAgentsSessionThread.md)\>

***

### retrieve()

> **retrieve**(`threadID`, `params`, `options?`): [`APIPromise`](../../index/classes/APIPromise.md)\<[`ManagedAgentsSessionThread`](../interfaces/ManagedAgentsSessionThread.md)\>

Get Session Thread

#### Parameters

##### threadID

`string`

##### params

[`SessionThreadGetParams`](../interfaces/SessionThreadGetParams.md)

##### options?

[`RequestOptions`](../../index/interfaces/RequestOptions.md)

#### Returns

[`APIPromise`](../../index/classes/APIPromise.md)\<[`ManagedAgentsSessionThread`](../interfaces/ManagedAgentsSessionThread.md)\>
