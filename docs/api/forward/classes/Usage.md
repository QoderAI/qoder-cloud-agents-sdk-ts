[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [forward](../README.md) / Usage

# Class: Usage

Identity/Template aggregates over an hourly Asia/Shanghai window. PAT or Admin SAT required.

## Extends

- `APIResource`

## Constructors

### Constructor

> **new Usage**(`_client`): `Usage`

#### Parameters

##### \_client

[`APIClient`](../../index/classes/APIClient.md)

#### Returns

`Usage`

#### Inherited from

`APIResource.constructor`

## Properties

### \_client

> `protected` `readonly` **\_client**: [`APIClient`](../../index/classes/APIClient.md)

#### Inherited from

`APIResource._client`

## Methods

### listIdentities()

> **listIdentities**(`params`, `options?`): [`PagePromise`](../../index/classes/PagePromise.md)\<[`IdentityUsage`](../interfaces/IdentityUsage.md)\>

#### Parameters

##### params

[`UsageListParams`](../interfaces/UsageListParams.md)

##### options?

[`RequestOptions`](../../index/interfaces/RequestOptions.md)

#### Returns

[`PagePromise`](../../index/classes/PagePromise.md)\<[`IdentityUsage`](../interfaces/IdentityUsage.md)\>

***

### listTemplates()

> **listTemplates**(`params`, `options?`): [`PagePromise`](../../index/classes/PagePromise.md)\<[`TemplateUsage`](../interfaces/TemplateUsage.md)\>

#### Parameters

##### params

[`UsageListParams`](../interfaces/UsageListParams.md)

##### options?

[`RequestOptions`](../../index/interfaces/RequestOptions.md)

#### Returns

[`PagePromise`](../../index/classes/PagePromise.md)\<[`TemplateUsage`](../interfaces/TemplateUsage.md)\>
