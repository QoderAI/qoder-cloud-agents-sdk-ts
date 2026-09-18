[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [forward](../README.md) / IdentityConfigs

# Class: IdentityConfigs

## Extends

- `APIResource`

## Constructors

### Constructor

> **new IdentityConfigs**(`_client`): `IdentityConfigs`

#### Parameters

##### \_client

[`APIClient`](../../index/classes/APIClient.md)

#### Returns

`IdentityConfigs`

#### Inherited from

`APIResource.constructor`

## Properties

### \_client

> `protected` `readonly` **\_client**: [`APIClient`](../../index/classes/APIClient.md)

#### Inherited from

`APIResource._client`

## Methods

### getEffective()

> **getEffective**(`identityID`, `templateID`, `options?`): [`APIPromise`](../../index/classes/APIPromise.md)\<[`EffectiveConfig`](../interfaces/EffectiveConfig.md)\>

获取 Effective Config.

#### Parameters

##### identityID

`string`

##### templateID

`string`

##### options?

[`RequestOptions`](../../index/interfaces/RequestOptions.md)

#### Returns

[`APIPromise`](../../index/classes/APIPromise.md)\<[`EffectiveConfig`](../interfaces/EffectiveConfig.md)\>

#### Operation

getEffectiveConfig

***

### list()

> **list**(`identityID`, `params?`, `options?`): [`PagePromise`](../../index/classes/PagePromise.md)\<[`IdentityConfig`](../interfaces/IdentityConfig.md)\>

列出 Identity Configs.

#### Parameters

##### identityID

`string`

##### params?

[`IdentityConfigListParams`](../interfaces/IdentityConfigListParams.md) = `{}`

##### options?

[`RequestOptions`](../../index/interfaces/RequestOptions.md)

#### Returns

[`PagePromise`](../../index/classes/PagePromise.md)\<[`IdentityConfig`](../interfaces/IdentityConfig.md)\>

#### Operation

listIdentityConfigs

***

### retrieve()

> **retrieve**(`identityID`, `templateID`, `options?`): [`APIPromise`](../../index/classes/APIPromise.md)\<[`IdentityConfig`](../interfaces/IdentityConfig.md)\>

获取 Identity Config.

#### Parameters

##### identityID

`string`

##### templateID

`string`

##### options?

[`RequestOptions`](../../index/interfaces/RequestOptions.md)

#### Returns

[`APIPromise`](../../index/classes/APIPromise.md)\<[`IdentityConfig`](../interfaces/IdentityConfig.md)\>

#### Operation

getIdentityConfig

***

### upsert()

> **upsert**(`identityID`, `templateID`, `params`, `options?`): [`APIPromise`](../../index/classes/APIPromise.md)\<[`IdentityConfig`](../interfaces/IdentityConfig.md)\>

创建或更新 Identity Config.

#### Parameters

##### identityID

`string`

##### templateID

`string`

##### params

[`IdentityConfigUpsertParams`](../interfaces/IdentityConfigUpsertParams.md)

##### options?

[`RequestOptions`](../../index/interfaces/RequestOptions.md)

#### Returns

[`APIPromise`](../../index/classes/APIPromise.md)\<[`IdentityConfig`](../interfaces/IdentityConfig.md)\>

#### Operation

upsertIdentityConfig
