[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [managed](../README.md) / SessionsEvents

# Class: SessionsEvents

## Extends

- `APIResource`

## Constructors

### Constructor

> **new SessionsEvents**(`_client`): `SessionsEvents`

#### Parameters

##### \_client

[`APIClient`](../../index/classes/APIClient.md)

#### Returns

`SessionsEvents`

#### Inherited from

`APIResource.constructor`

## Properties

### \_client

> `protected` `readonly` **\_client**: [`APIClient`](../../index/classes/APIClient.md)

#### Inherited from

`APIResource._client`

## Methods

### list()

> **list**(`sessionID`, `params?`, `options?`): [`PagePromise`](../../index/classes/PagePromise.md)\<[`ManagedAgentsSessionEventUnion`](../type-aliases/ManagedAgentsSessionEventUnion.md)\>

List Events

#### Parameters

##### sessionID

`string`

##### params?

[`SessionEventListParams`](../interfaces/SessionEventListParams.md) \| `null` \| `undefined`

##### options?

[`RequestOptions`](../../index/interfaces/RequestOptions.md)

#### Returns

[`PagePromise`](../../index/classes/PagePromise.md)\<[`ManagedAgentsSessionEventUnion`](../type-aliases/ManagedAgentsSessionEventUnion.md)\>

***

### resumableStream()

> **resumableStream**(`sessionID`, `params?`, `options?`): [`ResumableSessionEventStream`](../../index/classes/ResumableSessionEventStream.md)\<[`ManagedAgentsStreamSessionEventsUnion`](../type-aliases/ManagedAgentsStreamSessionEventsUnion.md)\>

Subscribe to Session Events and reconnect from the latest delivered SSE frame.

#### Parameters

##### sessionID

`string`

##### params?

[`SessionEventStreamParams`](../interfaces/SessionEventStreamParams.md) \| `null` \| `undefined`

##### options?

[`RequestOptions`](../../index/interfaces/RequestOptions.md)

#### Returns

[`ResumableSessionEventStream`](../../index/classes/ResumableSessionEventStream.md)\<[`ManagedAgentsStreamSessionEventsUnion`](../type-aliases/ManagedAgentsStreamSessionEventsUnion.md)\>

***

### send()

> **send**(`sessionID`, `params`, `options?`): [`APIPromise`](../../index/classes/APIPromise.md)\<[`ManagedAgentsSendSessionEvents`](../interfaces/ManagedAgentsSendSessionEvents.md)\>

Send Events

#### Parameters

##### sessionID

`string`

##### params

[`SessionEventSendParams`](../interfaces/SessionEventSendParams.md)

##### options?

[`RequestOptions`](../../index/interfaces/RequestOptions.md)

#### Returns

[`APIPromise`](../../index/classes/APIPromise.md)\<[`ManagedAgentsSendSessionEvents`](../interfaces/ManagedAgentsSendSessionEvents.md)\>

***

### streamEvents()

> **streamEvents**(`sessionID`, `params?`, `options?`): [`APIPromise`](../../index/classes/APIPromise.md)\<[`Stream`](../../index/classes/Stream.md)\<[`ManagedAgentsStreamSessionEventsUnion`](../type-aliases/ManagedAgentsStreamSessionEventsUnion.md)\>\>

Stream Events

#### Parameters

##### sessionID

`string`

##### params?

[`SessionEventStreamParams`](../interfaces/SessionEventStreamParams.md) \| `null` \| `undefined`

##### options?

[`RequestOptions`](../../index/interfaces/RequestOptions.md)

#### Returns

[`APIPromise`](../../index/classes/APIPromise.md)\<[`Stream`](../../index/classes/Stream.md)\<[`ManagedAgentsStreamSessionEventsUnion`](../type-aliases/ManagedAgentsStreamSessionEventsUnion.md)\>\>
