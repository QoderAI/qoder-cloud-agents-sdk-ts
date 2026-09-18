[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [forward](../README.md) / SessionEvents

# Class: SessionEvents

## Extends

- `APIResource`

## Constructors

### Constructor

> **new SessionEvents**(`_client`): `SessionEvents`

#### Parameters

##### \_client

[`APIClient`](../../index/classes/APIClient.md)

#### Returns

`SessionEvents`

#### Inherited from

`APIResource.constructor`

## Properties

### \_client

> `protected` `readonly` **\_client**: [`APIClient`](../../index/classes/APIClient.md)

#### Inherited from

`APIResource._client`

## Methods

### list()

> **list**(`sessionID`, `params?`, `options?`): [`PagePromise`](../../index/classes/PagePromise.md)\<[`SessionEvent`](../interfaces/SessionEvent.md)\>

列出 Session Events.

#### Parameters

##### sessionID

`string`

##### params?

[`SessionEventListParams`](../interfaces/SessionEventListParams.md) = `{}`

##### options?

[`RequestOptions`](../../index/interfaces/RequestOptions.md)

#### Returns

[`PagePromise`](../../index/classes/PagePromise.md)\<[`SessionEvent`](../interfaces/SessionEvent.md)\>

#### Operation

listSessionEvents

***

### resumableStream()

> **resumableStream**(`sessionID`, `params?`, `options?`): [`ResumableSessionEventStream`](../../index/classes/ResumableSessionEventStream.md)\<[`SessionEvent`](../interfaces/SessionEvent.md)\>

Subscribe to Session Events and reconnect from the latest delivered SSE frame.

#### Parameters

##### sessionID

`string`

##### params?

[`SessionEventStreamParams`](../interfaces/SessionEventStreamParams.md) = `{}`

##### options?

[`RequestOptions`](../../index/interfaces/RequestOptions.md)

#### Returns

[`ResumableSessionEventStream`](../../index/classes/ResumableSessionEventStream.md)\<[`SessionEvent`](../interfaces/SessionEvent.md)\>

***

### send()

> **send**(`sessionID`, `params`, `options?`): [`APIPromise`](../../index/classes/APIPromise.md)\<[`SessionEventSendResponse`](../interfaces/SessionEventSendResponse.md)\>

发送 Session Events.

#### Parameters

##### sessionID

`string`

##### params

[`SessionEventSendParams`](../interfaces/SessionEventSendParams.md)

##### options?

[`RequestOptions`](../../index/interfaces/RequestOptions.md)

#### Returns

[`APIPromise`](../../index/classes/APIPromise.md)\<[`SessionEventSendResponse`](../interfaces/SessionEventSendResponse.md)\>

#### Operation

sendSessionEvents

***

### streamEvents()

> **streamEvents**(`sessionID`, `params?`, `options?`): [`APIPromise`](../../index/classes/APIPromise.md)\<[`Stream`](../../index/classes/Stream.md)\<[`SessionEvent`](../interfaces/SessionEvent.md)\>\>

订阅 Session Event Stream.

#### Parameters

##### sessionID

`string`

##### params?

[`SessionEventStreamParams`](../interfaces/SessionEventStreamParams.md) = `{}`

##### options?

[`RequestOptions`](../../index/interfaces/RequestOptions.md)

#### Returns

[`APIPromise`](../../index/classes/APIPromise.md)\<[`Stream`](../../index/classes/Stream.md)\<[`SessionEvent`](../interfaces/SessionEvent.md)\>\>

#### Operation

streamSessionEvents
