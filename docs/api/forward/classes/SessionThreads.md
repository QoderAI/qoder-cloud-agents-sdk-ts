[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [forward](../README.md) / SessionThreads

# Class: SessionThreads

## Extends

- `APIResource`

## Constructors

### Constructor

> **new SessionThreads**(`_client`): `SessionThreads`

#### Parameters

##### \_client

[`APIClient`](../../index/classes/APIClient.md)

#### Returns

`SessionThreads`

#### Inherited from

`APIResource.constructor`

## Properties

### \_client

> `protected` `readonly` **\_client**: [`APIClient`](../../index/classes/APIClient.md)

#### Inherited from

`APIResource._client`

***

### events

> `readonly` **events**: [`SessionThreadEvents`](SessionThreadEvents.md)

## Methods

### archive()

> **archive**(`sessionID`, `threadID`, `params?`, `options?`): [`APIPromise`](../../index/classes/APIPromise.md)\<[`SessionThread`](../interfaces/SessionThread.md)\>

归档 Session Thread.

#### Parameters

##### sessionID

`string`

##### threadID

`string`

##### params?

[`SessionThreadArchiveParams`](../interfaces/SessionThreadArchiveParams.md) = `{}`

##### options?

[`RequestOptions`](../../index/interfaces/RequestOptions.md)

#### Returns

[`APIPromise`](../../index/classes/APIPromise.md)\<[`SessionThread`](../interfaces/SessionThread.md)\>

#### Operation

archiveSessionThread

***

### list()

> **list**(`sessionID`, `params?`, `options?`): [`PagePromise`](../../index/classes/PagePromise.md)\<[`SessionThread`](../interfaces/SessionThread.md)\>

列出 Session Threads.

#### Parameters

##### sessionID

`string`

##### params?

[`SessionThreadListParams`](../interfaces/SessionThreadListParams.md) = `{}`

##### options?

[`RequestOptions`](../../index/interfaces/RequestOptions.md)

#### Returns

[`PagePromise`](../../index/classes/PagePromise.md)\<[`SessionThread`](../interfaces/SessionThread.md)\>

#### Operation

listSessionThreads

***

### retrieve()

> **retrieve**(`sessionID`, `threadID`, `options?`): [`APIPromise`](../../index/classes/APIPromise.md)\<[`SessionThread`](../interfaces/SessionThread.md)\>

获取 Session Thread.

#### Parameters

##### sessionID

`string`

##### threadID

`string`

##### options?

[`RequestOptions`](../../index/interfaces/RequestOptions.md)

#### Returns

[`APIPromise`](../../index/classes/APIPromise.md)\<[`SessionThread`](../interfaces/SessionThread.md)\>

#### Operation

getSessionThread
