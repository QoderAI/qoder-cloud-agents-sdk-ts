[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [index](../README.md) / APIError

# Class: APIError

## Extends

- [`QoderError`](QoderError.md)

## Extended by

- [`BadRequestError`](BadRequestError.md)
- [`AuthenticationError`](AuthenticationError.md)
- [`PermissionDeniedError`](PermissionDeniedError.md)
- [`NotFoundError`](NotFoundError.md)
- [`ConflictError`](ConflictError.md)
- [`UnprocessableEntityError`](UnprocessableEntityError.md)
- [`RateLimitError`](RateLimitError.md)
- [`InternalServerError`](InternalServerError.md)

## Constructors

### Constructor

> **new APIError**(`status`, `error`, `message?`, `headers?`, `response?`): `APIError`

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

`APIError`

#### Overrides

[`QoderError`](QoderError.md).[`constructor`](QoderError.md#constructor)

## Properties

### cause?

> `optional` **cause?**: `unknown`

#### Inherited from

[`QoderError`](QoderError.md).[`cause`](QoderError.md#cause)

***

### code?

> `readonly` `optional` **code?**: `string`

***

### error

> `readonly` **error**: `unknown`

***

### headers

> `readonly` **headers**: `Headers`

***

### message

> **message**: `string`

#### Inherited from

[`QoderError`](QoderError.md).[`message`](QoderError.md#message)

***

### name

> **name**: `string`

#### Inherited from

[`QoderError`](QoderError.md).[`name`](QoderError.md#name)

***

### request?

> `optional` **request?**: `Request`

***

### request\_id

> `readonly` **request\_id**: `string` \| `null`

***

### requestID

> `readonly` **requestID**: `string` \| `null`

***

### response?

> `readonly` `optional` **response?**: `Response`

***

### stack?

> `optional` **stack?**: `string`

#### Inherited from

[`QoderError`](QoderError.md).[`stack`](QoderError.md#stack)

***

### status

> `readonly` **status**: `number`

***

### type?

> `readonly` `optional` **type?**: `string`

## Methods

### generate()

> `static` **generate**(`status`, `error`, `message?`, `headers?`, `response?`): `APIError`

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

`APIError`
