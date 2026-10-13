[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [index](../README.md) / RealtimeHistoryPage

# Class: RealtimeHistoryPage

History uses before cursors and events, independently of ordinary list pages.

## Implements

- [`RealtimeHistoryResponse`](../interfaces/RealtimeHistoryResponse.md)
- `AsyncIterable`\<[`RealtimeHistoryEvent`](../interfaces/RealtimeHistoryEvent.md)\>

## Indexable

> \[`key`: `string`\]: `unknown`

## Constructors

### Constructor

> **new RealtimeHistoryPage**(`client`, `conversationID`, `params`, `options`, `data`, `response`): `RealtimeHistoryPage`

#### Parameters

##### client

[`APIClient`](APIClient.md)

##### conversationID

`string`

##### params

[`RealtimeHistoryParams`](../interfaces/RealtimeHistoryParams.md)

##### options

[`RequestOptions`](../interfaces/RequestOptions.md)

##### data

[`RealtimeHistoryResponse`](../interfaces/RealtimeHistoryResponse.md)

##### response

`Response`

#### Returns

`RealtimeHistoryPage`

## Properties

### \_request\_id

> `readonly` **\_request\_id**: `string` \| `null`

***

### conversation

> `readonly` **conversation**: `object`

#### Index Signature

\[`key`: `string`\]: `unknown`

#### created\_at

> **created\_at**: `string`

#### id

> **id**: `string`

#### initialization\_status

> **initialization\_status**: `string`

#### metadata

> **metadata**: `Record`\<`string`, `unknown`\>

#### title

> **title**: `string` \| `null`

#### updated\_at

> **updated\_at**: `string`

#### Implementation of

[`RealtimeHistoryResponse`](../interfaces/RealtimeHistoryResponse.md).[`conversation`](../interfaces/RealtimeHistoryResponse.md#conversation)

***

### events

> `readonly` **events**: [`RealtimeHistoryEvent`](../interfaces/RealtimeHistoryEvent.md)[]

#### Implementation of

[`RealtimeHistoryResponse`](../interfaces/RealtimeHistoryResponse.md).[`events`](../interfaces/RealtimeHistoryResponse.md#events)

***

### page

> `readonly` **page**: `object`

#### Index Signature

\[`key`: `string`\]: `unknown`

#### has\_more

> **has\_more**: `boolean`

#### next\_before

> **next\_before**: `string` \| `null`

#### Implementation of

[`RealtimeHistoryResponse`](../interfaces/RealtimeHistoryResponse.md).[`page`](../interfaces/RealtimeHistoryResponse.md#page)

***

### response

> `readonly` **response**: `Response`

## Methods

### \[asyncIterator\]()

> **\[asyncIterator\]**(): `AsyncGenerator`\<[`RealtimeHistoryEvent`](../interfaces/RealtimeHistoryEvent.md)\>

#### Returns

`AsyncGenerator`\<[`RealtimeHistoryEvent`](../interfaces/RealtimeHistoryEvent.md)\>

#### Implementation of

`AsyncIterable.[asyncIterator]`

***

### getNextPage()

> **getNextPage**(): [`APIPromise`](APIPromise.md)\<`RealtimeHistoryPage`\>

#### Returns

[`APIPromise`](APIPromise.md)\<`RealtimeHistoryPage`\>

***

### hasNextPage()

> **hasNextPage**(): `boolean`

#### Returns

`boolean`

***

### iterPages()

> **iterPages**(): `AsyncGenerator`\<`RealtimeHistoryPage`\>

#### Returns

`AsyncGenerator`\<`RealtimeHistoryPage`\>

***

### toJSON()

> **toJSON**(): [`RealtimeHistoryResponse`](../interfaces/RealtimeHistoryResponse.md)

#### Returns

[`RealtimeHistoryResponse`](../interfaces/RealtimeHistoryResponse.md)
