[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [forward](../README.md) / IdentityMemoryStores

# Class: IdentityMemoryStores

## Extends

- `APIResource`

## Constructors

### Constructor

> **new IdentityMemoryStores**(`_client`): `IdentityMemoryStores`

#### Parameters

##### \_client

[`APIClient`](../../index/classes/APIClient.md)

#### Returns

`IdentityMemoryStores`

#### Inherited from

`APIResource.constructor`

## Properties

### \_client

> `protected` `readonly` **\_client**: [`APIClient`](../../index/classes/APIClient.md)

#### Inherited from

`APIResource._client`

## Methods

### detach()

> **detach**(`identityID`, `templateID`, `memoryStoreID`, `options?`): [`APIPromise`](../../index/classes/APIPromise.md)\<[`DeletedMemoryStoreMount`](../interfaces/DeletedMemoryStoreMount.md)\>

解绑 Identity 上的 Memory Store.

#### Parameters

##### identityID

`string`

##### templateID

`string`

##### memoryStoreID

`string`

##### options?

[`RequestOptions`](../../index/interfaces/RequestOptions.md)

#### Returns

[`APIPromise`](../../index/classes/APIPromise.md)\<[`DeletedMemoryStoreMount`](../interfaces/DeletedMemoryStoreMount.md)\>

#### Operation

detachMemoryStore

***

### list()

> **list**(`identityID`, `templateID`, `options?`): [`APIPromise`](../../index/classes/APIPromise.md)\<[`IdentityMemoryStoreListResponse`](../interfaces/IdentityMemoryStoreListResponse.md)\>

列出 Identity 上的 Memory Store 挂载.

#### Parameters

##### identityID

`string`

##### templateID

`string`

##### options?

[`RequestOptions`](../../index/interfaces/RequestOptions.md)

#### Returns

[`APIPromise`](../../index/classes/APIPromise.md)\<[`IdentityMemoryStoreListResponse`](../interfaces/IdentityMemoryStoreListResponse.md)\>

#### Operation

listMemoryStoreMounts

***

### mount()

> **mount**(`identityID`, `templateID`, `params`, `options?`): [`APIPromise`](../../index/classes/APIPromise.md)\<[`MemoryStoreMount`](../interfaces/MemoryStoreMount.md)\>

挂载 Memory Store 到 Identity.

#### Parameters

##### identityID

`string`

##### templateID

`string`

##### params

[`IdentityMemoryStoreMountParams`](../interfaces/IdentityMemoryStoreMountParams.md)

##### options?

[`RequestOptions`](../../index/interfaces/RequestOptions.md)

#### Returns

[`APIPromise`](../../index/classes/APIPromise.md)\<[`MemoryStoreMount`](../interfaces/MemoryStoreMount.md)\>

#### Operation

mountMemoryStore
