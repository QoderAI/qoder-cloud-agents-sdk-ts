[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [index](../README.md) / PATCredential

# Class: PATCredential

## Implements

- [`Credential`](../interfaces/Credential.md)

## Constructors

### Constructor

> **new PATCredential**(`token`): `PATCredential`

#### Parameters

##### token

`string`

#### Returns

`PATCredential`

## Methods

### getToken()

> **getToken**(): `string`

#### Returns

`string`

#### Implementation of

[`Credential`](../interfaces/Credential.md).[`getToken`](../interfaces/Credential.md#gettoken)

***

### fromEnv()

> `static` **fromEnv**(`name?`): `PATCredential`

#### Parameters

##### name?

`string` = `'QODER_PAT'`

#### Returns

`PATCredential`
