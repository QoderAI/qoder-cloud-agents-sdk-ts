[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [managed](../README.md) / SessionsThreadsEvents

# Class: SessionsThreadsEvents

## Extends

- `APIResource`

## Constructors

### Constructor

> **new SessionsThreadsEvents**(`_client`): `SessionsThreadsEvents`

#### Parameters

##### \_client

[`APIClient`](../../index/classes/APIClient.md)

#### Returns

`SessionsThreadsEvents`

#### Inherited from

`APIResource.constructor`

## Properties

### \_client

> `protected` `readonly` **\_client**: [`APIClient`](../../index/classes/APIClient.md)

#### Inherited from

`APIResource._client`

## Methods

### list()

> **list**(`threadID`, `params`, `options?`): [`PagePromise`](../../index/classes/PagePromise.md)\<[`ManagedAgentsSessionEventUnion`](../type-aliases/ManagedAgentsSessionEventUnion.md)\>

List Session Thread Events

#### Parameters

##### threadID

`string`

##### params

[`SessionThreadEventListParams`](../interfaces/SessionThreadEventListParams.md)

##### options?

[`RequestOptions`](../../index/interfaces/RequestOptions.md)

#### Returns

[`PagePromise`](../../index/classes/PagePromise.md)\<[`ManagedAgentsSessionEventUnion`](../type-aliases/ManagedAgentsSessionEventUnion.md)\>

***

### streamEvents()

> **streamEvents**(`threadID`, `params`, `options?`): [`APIPromise`](../../index/classes/APIPromise.md)\<[`Stream`](../../index/classes/Stream.md)\<[`ManagedAgentsStreamSessionThreadEventsUnion`](../type-aliases/ManagedAgentsStreamSessionThreadEventsUnion.md)\>\>

Stream Session Thread Events

#### Parameters

##### threadID

`string`

##### params

[`SessionThreadEventStreamParams`](../interfaces/SessionThreadEventStreamParams.md)

##### options?

[`RequestOptions`](../../index/interfaces/RequestOptions.md)

#### Returns

[`APIPromise`](../../index/classes/APIPromise.md)\<[`Stream`](../../index/classes/Stream.md)\<[`ManagedAgentsStreamSessionThreadEventsUnion`](../type-aliases/ManagedAgentsStreamSessionThreadEventsUnion.md)\>\>
