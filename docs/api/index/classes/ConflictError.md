[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [index](../README.md) / ConflictError

# Class: ConflictError

## Extends

- [`APIError`](APIError.md)

## Constructors

### Constructor

> **new ConflictError**(`status`, `error`, `message?`, `headers?`, `response?`): `ConflictError`

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

`ConflictError`

#### Inherited from

[`APIError`](APIError.md).[`constructor`](APIError.md#constructor)

## Properties

### cause?

> `optional` **cause?**: `unknown`

#### Inherited from

[`APIError`](APIError.md).[`cause`](APIError.md#cause)

***

### code?

> `readonly` `optional` **code?**: `string`

#### Inherited from

[`APIError`](APIError.md).[`code`](APIError.md#code)

***

### error

> `readonly` **error**: `unknown`

#### Inherited from

[`APIError`](APIError.md).[`error`](APIError.md#error)

***

### headers

> `readonly` **headers**: `Headers`

#### Inherited from

[`APIError`](APIError.md).[`headers`](APIError.md#headers)

***

### message

> **message**: `string`

#### Inherited from

[`APIError`](APIError.md).[`message`](APIError.md#message)

***

### name

> **name**: `string`

#### Inherited from

[`APIError`](APIError.md).[`name`](APIError.md#name)

***

### request?

> `optional` **request?**: `Request`

#### Inherited from

[`APIError`](APIError.md).[`request`](APIError.md#request)

***

### request\_id

> `readonly` **request\_id**: `string` \| `null`

#### Inherited from

[`APIError`](APIError.md).[`request_id`](APIError.md#request_id)

***

### requestID

> `readonly` **requestID**: `string` \| `null`

#### Inherited from

[`APIError`](APIError.md).[`requestID`](APIError.md#requestid)

***

### response?

> `readonly` `optional` **response?**: `Response`

#### Inherited from

[`APIError`](APIError.md).[`response`](APIError.md#response)

***

### stack?

> `optional` **stack?**: `string`

#### Inherited from

[`APIError`](APIError.md).[`stack`](APIError.md#stack)

***

### status

> `readonly` **status**: `number`

#### Inherited from

[`APIError`](APIError.md).[`status`](APIError.md#status)

***

### type?

> `readonly` `optional` **type?**: `string`

#### Inherited from

[`APIError`](APIError.md).[`type`](APIError.md#type)

## Methods

### generate()

> `static` **generate**(`status`, `error`, `message?`, `headers?`, `response?`): [`APIError`](APIError.md)

#### Parameters

##### status

`number`

##### error

`unknown`

##### message?

`string`

##### headers?

`Headers`

##### response?

`Response`

#### Returns

[`APIError`](APIError.md)

#### Inherited from

[`APIError`](APIError.md).[`generate`](APIError.md#generate)
