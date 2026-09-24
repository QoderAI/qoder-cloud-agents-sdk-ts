[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [index](../README.md) / APIConnectionTimeoutError

# Class: APIConnectionTimeoutError

## Extends

- [`APIConnectionError`](APIConnectionError.md)

## Constructors

### Constructor

> **new APIConnectionTimeoutError**(`message`, `options?`): `APIConnectionTimeoutError`

#### Parameters

##### message

`string`

##### options?

`ErrorOptions`

#### Returns

`APIConnectionTimeoutError`

#### Inherited from

[`APIConnectionError`](APIConnectionError.md).[`constructor`](APIConnectionError.md#constructor)

## Properties

### cause?

> `optional` **cause?**: `unknown`

#### Inherited from

[`APIConnectionError`](APIConnectionError.md).[`cause`](APIConnectionError.md#cause)

***

### code?

> `readonly` `optional` **code?**: `string`

#### Inherited from

[`APIConnectionError`](APIConnectionError.md).[`code`](APIConnectionError.md#code)

***

### error

> `readonly` **error**: `undefined`

#### Inherited from

[`APIConnectionError`](APIConnectionError.md).[`error`](APIConnectionError.md#error)

***

### headers

> `readonly` **headers**: `undefined`

#### Inherited from

[`APIConnectionError`](APIConnectionError.md).[`headers`](APIConnectionError.md#headers)

***

### message

> **message**: `string`

#### Inherited from

[`APIConnectionError`](APIConnectionError.md).[`message`](APIConnectionError.md#message)

***

### name

> **name**: `string`

#### Inherited from

[`APIConnectionError`](APIConnectionError.md).[`name`](APIConnectionError.md#name)

***

### request?

> `optional` **request?**: `Request`

#### Inherited from

[`APIConnectionError`](APIConnectionError.md).[`request`](APIConnectionError.md#request)

***

### request\_id

> `readonly` **request\_id**: `string` \| `null`

#### Inherited from

[`APIConnectionError`](APIConnectionError.md).[`request_id`](APIConnectionError.md#request_id)

***

### requestID

> `readonly` **requestID**: `string` \| `null`

#### Inherited from

[`APIConnectionError`](APIConnectionError.md).[`requestID`](APIConnectionError.md#requestid)

***

### response?

> `readonly` `optional` **response?**: `Response`

#### Inherited from

[`APIConnectionError`](APIConnectionError.md).[`response`](APIConnectionError.md#response)

***

### stack?

> `optional` **stack?**: `string`

#### Inherited from

[`APIConnectionError`](APIConnectionError.md).[`stack`](APIConnectionError.md#stack)

***

### status

> `readonly` **status**: `undefined`

#### Inherited from

[`APIConnectionError`](APIConnectionError.md).[`status`](APIConnectionError.md#status)

***

### type?

> `readonly` `optional` **type?**: `string`

#### Inherited from

[`APIConnectionError`](APIConnectionError.md).[`type`](APIConnectionError.md#type)

## Methods

### generate()

> `static` **generate**(`status`, `error`, `message?`, `headers?`, `response?`): [`APIError`](APIError.md)\<`number`, `Headers`\>

#### Parameters

##### status

`number`

##### error

`unknown`

##### message?

`string`

##### headers?

`Headers` = `...`

##### response?

`Response`

#### Returns

[`APIError`](APIError.md)\<`number`, `Headers`\>

#### Inherited from

[`APIConnectionError`](APIConnectionError.md).[`generate`](APIConnectionError.md#generate)
