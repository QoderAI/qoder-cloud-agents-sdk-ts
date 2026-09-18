[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [index](../README.md) / Page

# Class: Page\<T\>

## Type Parameters

### T

`T`

## Implements

- `AsyncIterable`\<`T`\>

## Indexable

> \[`key`: `string`\]: `unknown`

## Constructors

### Constructor

> **new Page**\<`T`\>(`client`, `response`, `body`, `path`, `query`, `options`, `mode`): `Page`\<`T`\>

#### Parameters

##### client

[`APIClient`](APIClient.md)

##### response

`Response`

##### body

[`PageResponse`](../interfaces/PageResponse.md)\<`T`\>

##### path

`string`

##### query

`Record`\<`string`, `unknown`\>

##### options

[`RequestOptions`](../interfaces/RequestOptions.md)

##### mode

[`PaginationMode`](../type-aliases/PaginationMode.md)

#### Returns

`Page`\<`T`\>

## Properties

### data

> `readonly` **data**: `T`[]

***

### first\_id?

> `readonly` `optional` **first\_id?**: `string` \| `null`

***

### has\_more?

> `readonly` `optional` **has\_more?**: `boolean`

***

### last\_id?

> `readonly` `optional` **last\_id?**: `string` \| `null`

***

### next\_page?

> `readonly` `optional` **next\_page?**: `string` \| `null`

***

### prev\_page?

> `readonly` `optional` **prev\_page?**: `string` \| `null`

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

### getNextPage()

> **getNextPage**(): `Promise`\<`Page`\<`T`\> \| `null`\>

#### Returns

`Promise`\<`Page`\<`T`\> \| `null`\>

***

### getPaginatedItems()

> **getPaginatedItems**(): `T`[]

#### Returns

`T`[]

***

### hasNextPage()

> **hasNextPage**(): `boolean`

#### Returns

`boolean`

***

### iterPages()

> **iterPages**(): `AsyncGenerator`\<`Page`\<`T`\>\>

#### Returns

`AsyncGenerator`\<`Page`\<`T`\>\>

***

### toJSON()

> **toJSON**(): [`PageResponse`](../interfaces/PageResponse.md)\<`T`\>

#### Returns

[`PageResponse`](../interfaces/PageResponse.md)\<`T`\>
