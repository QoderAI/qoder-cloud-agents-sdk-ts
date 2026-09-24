[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [index](../README.md) / APIError

# Class: APIError\<TStatus, THeaders, TError\>

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
- [`APIConnectionError`](APIConnectionError.md)
- [`APIUserAbortError`](APIUserAbortError.md)

## Type Parameters

### TStatus

`TStatus` *extends* `number` \| `undefined` = `number` \| `undefined`

### THeaders

`THeaders` *extends* `Headers` \| `undefined` = `Headers` \| `undefined`

### TError

`TError` = `unknown`

## Constructors

### Constructor

> **new APIError**\<`TStatus`, `THeaders`, `TError`\>(`status`, `error`, `message?`, `headers?`, `response?`, `options?`): `APIError`\<`TStatus`, `THeaders`, `TError`\>

#### Parameters

##### status

`TStatus`

##### error

`TError`

##### message?

`string`

##### headers?

`THeaders` = `...`

##### response?

`Response`

##### options?

`ErrorOptions`

#### Returns

`APIError`\<`TStatus`, `THeaders`, `TError`\>

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

> `readonly` **error**: `TError`

***

### headers

> `readonly` **headers**: `THeaders`

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

> `readonly` **status**: `TStatus`

***

### type?

> `readonly` `optional` **type?**: `string`

## Methods

### generate()

> `static` **generate**(`status`, `error`, `message?`, `headers?`, `response?`): `APIError`\<`number`, `Headers`\>

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

`APIError`\<`number`, `Headers`\>
