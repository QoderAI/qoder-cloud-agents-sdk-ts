[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [forward](../README.md) / ServiceAccountTokens

# Class: ServiceAccountTokens

Forward SAT issuance and revocation require an explicit SA Key per call.

## Extends

- `APIResource`

## Constructors

### Constructor

> **new ServiceAccountTokens**(`_client`): `ServiceAccountTokens`

#### Parameters

##### \_client

[`APIClient`](../../index/classes/APIClient.md)

#### Returns

`ServiceAccountTokens`

#### Inherited from

`APIResource.constructor`

## Properties

### \_client

> `protected` `readonly` **\_client**: [`APIClient`](../../index/classes/APIClient.md)

#### Inherited from

`APIResource._client`

## Methods

### create()

> **create**(`params`, `options?`): [`APIPromise`](../../index/classes/APIPromise.md)\<[`ServiceAccountToken`](../interfaces/ServiceAccountToken.md)\>

Issue an admin SAT. Automatic retries are disabled to avoid duplicate issuance.

#### Parameters

##### params

[`ServiceAccountTokenCreateParams`](../interfaces/ServiceAccountTokenCreateParams.md)

##### options?

[`RequestOptions`](../../index/interfaces/RequestOptions.md)

#### Returns

[`APIPromise`](../../index/classes/APIPromise.md)\<[`ServiceAccountToken`](../interfaces/ServiceAccountToken.md)\>

***

### revoke()

> **revoke**(`authTokenID`, `params`, `options?`): [`APIPromise`](../../index/classes/APIPromise.md)\<[`ServiceAccountTokenRevokeResponse`](../interfaces/ServiceAccountTokenRevokeResponse.md)\>

Revoke a Forward SAT binding from the same SA. Creation metadata disambiguates the target.

#### Parameters

##### authTokenID

`string`

##### params

[`ServiceAccountTokenRevokeParams`](../interfaces/ServiceAccountTokenRevokeParams.md)

##### options?

[`RequestOptions`](../../index/interfaces/RequestOptions.md)

#### Returns

[`APIPromise`](../../index/classes/APIPromise.md)\<[`ServiceAccountTokenRevokeResponse`](../interfaces/ServiceAccountTokenRevokeResponse.md)\>
