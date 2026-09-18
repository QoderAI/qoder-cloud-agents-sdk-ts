[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [index](../README.md) / ResumableSessionEventStream

# Class: ResumableSessionEventStream\<T\>

A stateful, single-consumer Session Events stream that reconnects after retryable
failures and resumes from the last fully decoded SSE frame.

## Type Parameters

### T

`T`

## Implements

- `AsyncIterable`\<`T`\>

## Constructors

### Constructor

> **new ResumableSessionEventStream**\<`T`\>(`openStream`, `initialLastEventID?`, `signal?`): `ResumableSessionEventStream`\<`T`\>

#### Parameters

##### openStream

`StreamFactory`\<`T`\>

##### initialLastEventID?

`string` \| `null`

##### signal?

`AbortSignal` \| `null`

#### Returns

`ResumableSessionEventStream`\<`T`\>

## Properties

### controller

> `readonly` **controller**: `AbortController`

***

### lastEventID

> **lastEventID**: `string` \| `undefined`

## Methods

### \[asyncIterator\]()

> **\[asyncIterator\]**(): `AsyncGenerator`\<`T`\>

#### Returns

`AsyncGenerator`\<`T`\>

#### Implementation of

`AsyncIterable.[asyncIterator]`

***

### close()

> **close**(): `Promise`\<`void`\>

#### Returns

`Promise`\<`void`\>
