[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [index](../README.md) / ServiceAccountCredential

# Class: ServiceAccountCredential

Lazy, instance-owned SAT cache. Share an instance between clients in the same region.

## Implements

- [`Credential`](../interfaces/Credential.md)

## Constructors

### Constructor

> **new ServiceAccountCredential**(`options`): `ServiceAccountCredential`

#### Parameters

##### options

[`ServiceAccountCredentialOptions`](../interfaces/ServiceAccountCredentialOptions.md)

#### Returns

`ServiceAccountCredential`

## Properties

### region

> `readonly` **region**: `"cn"` \| `"global"`

## Methods

### getToken()

> **getToken**(): `Promise`\<`string`\>

#### Returns

`Promise`\<`string`\>

#### Implementation of

[`Credential`](../interfaces/Credential.md).[`getToken`](../interfaces/Credential.md#gettoken)

***

### validateRegion()

> **validateRegion**(`host`): `void`

#### Parameters

##### host

`string`

#### Returns

`void`

***

### fromEnv()

> `static` **fromEnv**(`options`): `ServiceAccountCredential`

#### Parameters

##### options

`Omit`\<[`ServiceAccountCredentialOptions`](../interfaces/ServiceAccountCredentialOptions.md), `"saKey"`\>

#### Returns

`ServiceAccountCredential`
