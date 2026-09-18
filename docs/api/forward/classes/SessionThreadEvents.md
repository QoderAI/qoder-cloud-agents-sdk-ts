[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [forward](../README.md) / SessionThreadEvents

# Class: SessionThreadEvents

## Extends

- `APIResource`

## Constructors

### Constructor

> **new SessionThreadEvents**(`_client`): `SessionThreadEvents`

#### Parameters

##### \_client

[`APIClient`](../../index/classes/APIClient.md)

#### Returns

`SessionThreadEvents`

#### Inherited from

`APIResource.constructor`

## Properties

### \_client

> `protected` `readonly` **\_client**: [`APIClient`](../../index/classes/APIClient.md)

#### Inherited from

`APIResource._client`

## Methods

### list()

> **list**(`sessionID`, `threadID`, `params?`, `options?`): [`PagePromise`](../../index/classes/PagePromise.md)\<[`SessionEvent`](../interfaces/SessionEvent.md)\>

列出 Session Thread Events.

#### Parameters

##### sessionID

`string`

##### threadID

`string`

##### params?

[`SessionThreadEventListParams`](../interfaces/SessionThreadEventListParams.md) = `{}`

##### options?

[`RequestOptions`](../../index/interfaces/RequestOptions.md)

#### Returns

[`PagePromise`](../../index/classes/PagePromise.md)\<[`SessionEvent`](../interfaces/SessionEvent.md)\>

#### Operation

listSessionThreadEvents

***

### streamEvents()

> **streamEvents**(`sessionID`, `threadID`, `params?`, `options?`): [`APIPromise`](../../index/classes/APIPromise.md)\<[`Stream`](../../index/classes/Stream.md)\<[`SessionEvent`](../interfaces/SessionEvent.md)\>\>

订阅 Session Thread Event Stream.

#### Parameters

##### sessionID

`string`

##### threadID

`string`

##### params?

[`SessionThreadEventStreamParams`](../interfaces/SessionThreadEventStreamParams.md) = `{}`

##### options?

[`RequestOptions`](../../index/interfaces/RequestOptions.md)

#### Returns

[`APIPromise`](../../index/classes/APIPromise.md)\<[`Stream`](../../index/classes/Stream.md)\<[`SessionEvent`](../interfaces/SessionEvent.md)\>\>

#### Operation

streamSessionThreadEvents
