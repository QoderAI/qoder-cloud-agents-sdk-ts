[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [index](../README.md) / Stream

# Class: Stream\<T\>

## Type Parameters

### T

`T`

## Implements

- `AsyncIterable`\<`T`\>

## Constructors

### Constructor

> **new Stream**\<`T`\>(`response`, `controller?`): `Stream`\<`T`\>

#### Parameters

##### response

`Response`

##### controller?

`AbortController` = `...`

#### Returns

`Stream`\<`T`\>

## Properties

### completed

> **completed**: `boolean` = `false`

***

### controller

> `readonly` **controller**: `AbortController`

***

### hasLastEventID

> **hasLastEventID**: `boolean` = `false`

***

### lastEventID

> **lastEventID**: `string` = `''`

***

### response

> `readonly` **response**: `Response`

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

***

### fromSSEResponse()

> `static` **fromSSEResponse**\<`T`\>(`response`, `controller?`): `Stream`\<`T`\>

#### Type Parameters

##### T

`T`

#### Parameters

##### response

`Response`

##### controller?

`AbortController` = `...`

#### Returns

`Stream`\<`T`\>
