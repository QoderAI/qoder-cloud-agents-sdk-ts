[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [forward](../README.md) / Sessions

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

> `readonly` **events**: [`SessionEvents`](SessionEvents.md)

***

### resources

> `readonly` **resources**: [`SessionResources`](SessionResources.md)

***

### threads

> `readonly` **threads**: [`SessionThreads`](SessionThreads.md)

## Methods

### archive()

> **archive**(`sessionID`, `params?`, `options?`): [`APIPromise`](../../index/classes/APIPromise.md)\<[`Session`](../interfaces/Session.md)\>

归档 Session.

#### Parameters

##### sessionID

`string`

##### params?

[`SessionArchiveParams`](../interfaces/SessionArchiveParams.md) = `{}`

##### options?

[`RequestOptions`](../../index/interfaces/RequestOptions.md)

#### Returns

[`APIPromise`](../../index/classes/APIPromise.md)\<[`Session`](../interfaces/Session.md)\>

#### Operation

archiveSession

***

### cancel()

> **cancel**(`sessionID`, `params?`, `options?`): [`APIPromise`](../../index/classes/APIPromise.md)\<[`Session`](../interfaces/Session.md)\>

取消当前 Turn.

#### Parameters

##### sessionID

`string`

##### params?

[`SessionCancelParams`](../interfaces/SessionCancelParams.md) = `{}`

##### options?

[`RequestOptions`](../../index/interfaces/RequestOptions.md)

#### Returns

[`APIPromise`](../../index/classes/APIPromise.md)\<[`Session`](../interfaces/Session.md)\>

#### Operation

cancelSession

***

### create()

> **create**(`params`, `options?`): [`APIPromise`](../../index/classes/APIPromise.md)\<[`Session`](../interfaces/Session.md)\>

创建 Session.

#### Parameters

##### params

[`SessionNewParams`](../interfaces/SessionNewParams.md)

##### options?

[`RequestOptions`](../../index/interfaces/RequestOptions.md)

#### Returns

[`APIPromise`](../../index/classes/APIPromise.md)\<[`Session`](../interfaces/Session.md)\>

#### Operation

createSession

***

### list()

> **list**(`params?`, `options?`): [`PagePromise`](../../index/classes/PagePromise.md)\<[`Session`](../interfaces/Session.md)\>

列出 Sessions.

#### Parameters

##### params?

[`SessionListParams`](../interfaces/SessionListParams.md) = `{}`

##### options?

[`RequestOptions`](../../index/interfaces/RequestOptions.md)

#### Returns

[`PagePromise`](../../index/classes/PagePromise.md)\<[`Session`](../interfaces/Session.md)\>

#### Operation

listSessions

***

### retrieve()

> **retrieve**(`sessionID`, `options?`): [`APIPromise`](../../index/classes/APIPromise.md)\<[`Session`](../interfaces/Session.md)\>

获取 Session.

#### Parameters

##### sessionID

`string`

##### options?

[`RequestOptions`](../../index/interfaces/RequestOptions.md)

#### Returns

[`APIPromise`](../../index/classes/APIPromise.md)\<[`Session`](../interfaces/Session.md)\>

#### Operation

getSession

***

### update()

> **update**(`sessionID`, `params?`, `options?`): [`APIPromise`](../../index/classes/APIPromise.md)\<[`Session`](../interfaces/Session.md)\>

更新 Session.

#### Parameters

##### sessionID

`string`

##### params?

[`SessionUpdateParams`](../interfaces/SessionUpdateParams.md) = `{}`

##### options?

[`RequestOptions`](../../index/interfaces/RequestOptions.md)

#### Returns

[`APIPromise`](../../index/classes/APIPromise.md)\<[`Session`](../interfaces/Session.md)\>

#### Operation

updateSession
