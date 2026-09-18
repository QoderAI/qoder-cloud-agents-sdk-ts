[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [index](../README.md) / APIClient

# Class: APIClient

## Extended by

- [`ForwardClient`](ForwardClient.md)
- [`ManagedClient`](ManagedClient.md)

## Constructors

### Constructor

> **new APIClient**(`options?`, `mode?`): `APIClient`

#### Parameters

##### options?

[`ClientOptions`](../interfaces/ClientOptions.md) = `{}`

##### mode?

`"forward"` \| `"managed"`

#### Returns

`APIClient`

## Properties

### baseURL

> `readonly` **baseURL**: `string`

***

### defaultHeaders

> `readonly` **defaultHeaders**: [`HeadersLike`](../type-aliases/HeadersLike.md) \| `undefined`

***

### maxRetries

> `readonly` **maxRetries**: `number`

***

### mode

> `readonly` **mode**: `"forward"` \| `"managed"` = `'managed'`

***

### options

> `protected` `readonly` **options**: [`ClientOptions`](../interfaces/ClientOptions.md)

***

### timeout

> `readonly` **timeout**: `number`

## Methods

### downloadFile()

> **downloadFile**(`path`, `options?`): [`APIPromise`](APIPromise.md)\<`Response`\>

Resolve the API grant, then send a separate request without API credentials or headers.

#### Parameters

##### path

`string`

##### options?

[`RequestOptions`](../interfaces/RequestOptions.md) = `{}`

#### Returns

[`APIPromise`](APIPromise.md)\<`Response`\>

***

### getAPIList()

> **getAPIList**\<`T`\>(`path`, `query?`, `options?`, `pagination?`): [`PagePromise`](PagePromise.md)\<`T`\>

#### Type Parameters

##### T

`T`

#### Parameters

##### path

`string`

##### query?

`object` = `{}`

##### options?

[`RequestOptions`](../interfaces/RequestOptions.md) = `{}`

##### pagination?

[`PaginationMode`](../type-aliases/PaginationMode.md) = `...`

#### Returns

[`PagePromise`](PagePromise.md)\<`T`\>

***

### request()

> **request**\<`T`\>(`options`): [`APIPromise`](APIPromise.md)\<`T`\>

#### Type Parameters

##### T

`T`

#### Parameters

##### options

[`APIRequestOptions`](../interfaces/APIRequestOptions.md)

#### Returns

[`APIPromise`](APIPromise.md)\<`T`\>

***

### validateHeaders()

> `protected` **validateHeaders**(`headers`): `void`

#### Parameters

##### headers

`Headers`

#### Returns

`void`
