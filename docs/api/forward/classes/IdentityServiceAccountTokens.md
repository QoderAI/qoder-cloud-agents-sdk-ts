[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [forward](../README.md) / IdentityServiceAccountTokens

# Class: IdentityServiceAccountTokens

Issues SATs bound to a Forward Identity.

## Extends

- `APIResource`

## Constructors

### Constructor

> **new IdentityServiceAccountTokens**(`_client`): `IdentityServiceAccountTokens`

#### Parameters

##### \_client

[`APIClient`](../../index/classes/APIClient.md)

#### Returns

`IdentityServiceAccountTokens`

#### Inherited from

`APIResource.constructor`

## Properties

### \_client

> `protected` `readonly` **\_client**: [`APIClient`](../../index/classes/APIClient.md)

#### Inherited from

`APIResource._client`

## Methods

### create()

> **create**(`identityID`, `params`, `options?`): [`APIPromise`](../../index/classes/APIPromise.md)\<[`ServiceAccountToken`](../interfaces/ServiceAccountToken.md)\>

Issue an Identity SAT using the explicit SA Key. Automatic retries are disabled.

#### Parameters

##### identityID

`string`

##### params

[`ServiceAccountTokenCreateParams`](../interfaces/ServiceAccountTokenCreateParams.md)

##### options?

[`RequestOptions`](../../index/interfaces/RequestOptions.md)

#### Returns

[`APIPromise`](../../index/classes/APIPromise.md)\<[`ServiceAccountToken`](../interfaces/ServiceAccountToken.md)\>
