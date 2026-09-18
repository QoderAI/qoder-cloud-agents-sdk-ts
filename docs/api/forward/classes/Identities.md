[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [forward](../README.md) / Identities

# Class: Identities

## Extends

- `APIResource`

## Constructors

### Constructor

> **new Identities**(`_client`): `Identities`

#### Parameters

##### \_client

[`APIClient`](../../index/classes/APIClient.md)

#### Returns

`Identities`

#### Inherited from

`APIResource.constructor`

## Properties

### \_client

> `protected` `readonly` **\_client**: [`APIClient`](../../index/classes/APIClient.md)

#### Inherited from

`APIResource._client`

***

### configs

> `readonly` **configs**: [`IdentityConfigs`](IdentityConfigs.md)

***

### memoryStores

> `readonly` **memoryStores**: [`IdentityMemoryStores`](IdentityMemoryStores.md)

## Methods

### clear()

> **clear**(`identityID`, `params?`, `options?`): [`APIPromise`](../../index/classes/APIPromise.md)\<[`IdentityClearResponse`](../interfaces/IdentityClearResponse.md)\>

清理 Identity.

#### Parameters

##### identityID

`string`

##### params?

[`IdentityClearParams`](../interfaces/IdentityClearParams.md) = `{}`

##### options?

[`RequestOptions`](../../index/interfaces/RequestOptions.md)

#### Returns

[`APIPromise`](../../index/classes/APIPromise.md)\<[`IdentityClearResponse`](../interfaces/IdentityClearResponse.md)\>

#### Operation

clearIdentity

***

### create()

> **create**(`params`, `options?`): [`APIPromise`](../../index/classes/APIPromise.md)\<[`Identity`](../interfaces/Identity.md)\>

创建 Identity.

#### Parameters

##### params

[`IdentityNewParams`](../interfaces/IdentityNewParams.md)

##### options?

[`RequestOptions`](../../index/interfaces/RequestOptions.md)

#### Returns

[`APIPromise`](../../index/classes/APIPromise.md)\<[`Identity`](../interfaces/Identity.md)\>

#### Operation

createIdentity

***

### delete()

> **delete**(`identityID`, `options?`): [`APIPromise`](../../index/classes/APIPromise.md)\<[`DeletedIdentity`](../interfaces/DeletedIdentity.md)\>

删除 Identity.

#### Parameters

##### identityID

`string`

##### options?

[`RequestOptions`](../../index/interfaces/RequestOptions.md)

#### Returns

[`APIPromise`](../../index/classes/APIPromise.md)\<[`DeletedIdentity`](../interfaces/DeletedIdentity.md)\>

#### Operation

deleteIdentity

***

### disable()

> **disable**(`identityID`, `options?`): [`APIPromise`](../../index/classes/APIPromise.md)\<[`Identity`](../interfaces/Identity.md)\>

停用 Identity.

#### Parameters

##### identityID

`string`

##### options?

[`RequestOptions`](../../index/interfaces/RequestOptions.md)

#### Returns

[`APIPromise`](../../index/classes/APIPromise.md)\<[`Identity`](../interfaces/Identity.md)\>

#### Operation

disableIdentity

***

### enable()

> **enable**(`identityID`, `options?`): [`APIPromise`](../../index/classes/APIPromise.md)\<[`Identity`](../interfaces/Identity.md)\>

启用 Identity.

#### Parameters

##### identityID

`string`

##### options?

[`RequestOptions`](../../index/interfaces/RequestOptions.md)

#### Returns

[`APIPromise`](../../index/classes/APIPromise.md)\<[`Identity`](../interfaces/Identity.md)\>

#### Operation

enableIdentity

***

### ensureAdmin()

> **ensureAdmin**(`options?`): [`APIPromise`](../../index/classes/APIPromise.md)\<[`Identity`](../interfaces/Identity.md)\>

确保管理员 Identity.

#### Parameters

##### options?

[`RequestOptions`](../../index/interfaces/RequestOptions.md)

#### Returns

[`APIPromise`](../../index/classes/APIPromise.md)\<[`Identity`](../interfaces/Identity.md)\>

#### Operation

ensureAdminIdentity

***

### list()

> **list**(`params?`, `options?`): [`PagePromise`](../../index/classes/PagePromise.md)\<[`Identity`](../interfaces/Identity.md)\>

列出 Identities.

#### Parameters

##### params?

[`IdentityListParams`](../interfaces/IdentityListParams.md) = `{}`

##### options?

[`RequestOptions`](../../index/interfaces/RequestOptions.md)

#### Returns

[`PagePromise`](../../index/classes/PagePromise.md)\<[`Identity`](../interfaces/Identity.md)\>

#### Operation

listIdentities

***

### listTemplates()

> **listTemplates**(`identityID`, `options?`): [`APIPromise`](../../index/classes/APIPromise.md)\<[`IdentityListTemplatesResponse`](../interfaces/IdentityListTemplatesResponse.md)\>

列出 Identity 使用的 Template.

#### Parameters

##### identityID

`string`

##### options?

[`RequestOptions`](../../index/interfaces/RequestOptions.md)

#### Returns

[`APIPromise`](../../index/classes/APIPromise.md)\<[`IdentityListTemplatesResponse`](../interfaces/IdentityListTemplatesResponse.md)\>

#### Operation

listIdentityAgents

***

### retrieve()

> **retrieve**(`identityID`, `options?`): [`APIPromise`](../../index/classes/APIPromise.md)\<[`Identity`](../interfaces/Identity.md)\>

获取 Identity.

#### Parameters

##### identityID

`string`

##### options?

[`RequestOptions`](../../index/interfaces/RequestOptions.md)

#### Returns

[`APIPromise`](../../index/classes/APIPromise.md)\<[`Identity`](../interfaces/Identity.md)\>

#### Operation

getIdentity

***

### stats()

> **stats**(`options?`): [`APIPromise`](../../index/classes/APIPromise.md)\<[`IdentityStats`](../interfaces/IdentityStats.md)\>

获取 Identity 统计.

#### Parameters

##### options?

[`RequestOptions`](../../index/interfaces/RequestOptions.md)

#### Returns

[`APIPromise`](../../index/classes/APIPromise.md)\<[`IdentityStats`](../interfaces/IdentityStats.md)\>

#### Operation

getIdentityStats

***

### update()

> **update**(`identityID`, `params?`, `options?`): [`APIPromise`](../../index/classes/APIPromise.md)\<[`Identity`](../interfaces/Identity.md)\>

更新 Identity.

#### Parameters

##### identityID

`string`

##### params?

[`IdentityUpdateParams`](../interfaces/IdentityUpdateParams.md) = `{}`

##### options?

[`RequestOptions`](../../index/interfaces/RequestOptions.md)

#### Returns

[`APIPromise`](../../index/classes/APIPromise.md)\<[`Identity`](../interfaces/Identity.md)\>

#### Operation

updateIdentity
