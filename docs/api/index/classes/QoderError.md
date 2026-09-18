[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [index](../README.md) / QoderError

# Class: QoderError

## Extends

- `Error`

## Extended by

- [`APIError`](APIError.md)
- [`APIConnectionError`](APIConnectionError.md)
- [`APIUserAbortError`](APIUserAbortError.md)

## Constructors

### Constructor

> **new QoderError**(`message`, `options?`): `QoderError`

#### Parameters

##### message

`string`

##### options?

`ErrorOptions`

#### Returns

`QoderError`

#### Overrides

`Error.constructor`

## Properties

### cause?

> `optional` **cause?**: `unknown`

#### Inherited from

`Error.cause`

***

### message

> **message**: `string`

#### Inherited from

`Error.message`

***

### name

> **name**: `string`

#### Inherited from

`Error.name`

***

### stack?

> `optional` **stack?**: `string`

#### Inherited from

`Error.stack`
