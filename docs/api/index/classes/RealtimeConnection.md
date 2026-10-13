[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [index](../README.md) / RealtimeConnection

# Class: RealtimeConnection

A Node-only connection with one receiver and bounded input/output queues. No reconnect or replay.

## Implements

- `AsyncIterable`\<[`RealtimeServerEvent`](../type-aliases/RealtimeServerEvent.md)\>

## Properties

### conversationId

> `readonly` **conversationId**: `string`

***

### ready

> **ready**: [`RealtimeReady`](../interfaces/RealtimeReady.md)

***

### request\_id

> **request\_id**: `string` \| `null` = `null`

## Methods

### \[asyncIterator\]()

> **\[asyncIterator\]**(): `AsyncGenerator`\<[`RealtimeServerEvent`](../type-aliases/RealtimeServerEvent.md)\>

#### Returns

`AsyncGenerator`\<[`RealtimeServerEvent`](../type-aliases/RealtimeServerEvent.md)\>

#### Implementation of

`AsyncIterable.[asyncIterator]`

***

### appendAudio()

> **appendAudio**(`pcm`, `options?`): `Promise`\<`void`\>

#### Parameters

##### pcm

`Uint8Array`

##### options?

[`RealtimeWaitOptions`](../interfaces/RealtimeWaitOptions.md)

#### Returns

`Promise`\<`void`\>

***

### close()

> **close**(): `void`

Transport close does not promise history persistence or cancel background Work.

#### Returns

`void`

***

### closeGracefully()

> **closeGracefully**(`options?`): `Promise`\<[`RealtimeClosed`](../interfaces/RealtimeClosed.md)\>

Send connection.close, require its matching persistence acknowledgement, then release transport.

#### Parameters

##### options?

[`RealtimeCloseOptions`](../interfaces/RealtimeCloseOptions.md) = `{}`

#### Returns

`Promise`\<[`RealtimeClosed`](../interfaces/RealtimeClosed.md)\>

***

### interrupt()

> **interrupt**(`options?`): `Promise`\<`void`\>

#### Parameters

##### options?

[`RealtimeWaitOptions`](../interfaces/RealtimeWaitOptions.md)

#### Returns

`Promise`\<`void`\>

***

### ping()

> **ping**(`options?`): `Promise`\<`void`\>

#### Parameters

##### options?

[`RealtimeWaitOptions`](../interfaces/RealtimeWaitOptions.md)

#### Returns

`Promise`\<`void`\>

***

### playbackCancelled()

> **playbackCancelled**(`receipt?`, `options?`): `Promise`\<`void`\>

#### Parameters

##### receipt?

[`RealtimePlaybackReceipt`](../interfaces/RealtimePlaybackReceipt.md) = `{}`

##### options?

[`RealtimeWaitOptions`](../interfaces/RealtimeWaitOptions.md)

#### Returns

`Promise`\<`void`\>

***

### playbackEnded()

> **playbackEnded**(`receipt?`, `options?`): `Promise`\<`void`\>

#### Parameters

##### receipt?

[`RealtimePlaybackReceipt`](../interfaces/RealtimePlaybackReceipt.md) = `{}`

##### options?

[`RealtimeWaitOptions`](../interfaces/RealtimeWaitOptions.md)

#### Returns

`Promise`\<`void`\>

***

### playbackStarted()

> **playbackStarted**(`receipt?`, `options?`): `Promise`\<`void`\>

#### Parameters

##### receipt?

[`RealtimePlaybackReceipt`](../interfaces/RealtimePlaybackReceipt.md) = `{}`

##### options?

[`RealtimeWaitOptions`](../interfaces/RealtimeWaitOptions.md)

#### Returns

`Promise`\<`void`\>

***

### receive()

> **receive**(`options?`): `Promise`\<`IteratorResult`\<[`RealtimeServerEvent`](../type-aliases/RealtimeServerEvent.md), `any`\>\>

Read one event. Concurrent consumers are rejected instead of stealing each other's events.

#### Parameters

##### options?

[`RealtimeWaitOptions`](../interfaces/RealtimeWaitOptions.md) = `{}`

#### Returns

`Promise`\<`IteratorResult`\<[`RealtimeServerEvent`](../type-aliases/RealtimeServerEvent.md), `any`\>\>

***

### sendEvent()

> **sendEvent**(`event`, `options?`): `Promise`\<`void`\>

Serialize sends in call order; no input is automatically replayed.

#### Parameters

##### event

[`RealtimeClientEvent`](../interfaces/RealtimeClientEvent.md)

##### options?

[`RealtimeWaitOptions`](../interfaces/RealtimeWaitOptions.md) = `{}`

#### Returns

`Promise`\<`void`\>

***

### sendText()

> **sendText**(`text`, `options?`): `Promise`\<`void`\>

#### Parameters

##### text

`string`

##### options?

[`RealtimeWaitOptions`](../interfaces/RealtimeWaitOptions.md)

#### Returns

`Promise`\<`void`\>

***

### connect()

> `static` **connect**(`client`, `options`): `Promise`\<`RealtimeConnection`\>

**`Internal`**

#### Parameters

##### client

[`APIClient`](APIClient.md)

##### options

[`RealtimeConnectOptions`](../interfaces/RealtimeConnectOptions.md)

#### Returns

`Promise`\<`RealtimeConnection`\>
