[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [forward](../README.md) / MemoryStores

# Class: MemoryStores

## Extends

- `APIResource`

## Constructors

### Constructor

> **new MemoryStores**(`_client`): `MemoryStores`

#### Parameters

##### \_client

[`APIClient`](../../index/classes/APIClient.md)

#### Returns

`MemoryStores`

#### Inherited from

`APIResource.constructor`

## Properties

### \_client

> `protected` `readonly` **\_client**: [`APIClient`](../../index/classes/APIClient.md)

#### Inherited from

`APIResource._client`

***

### memories

> `readonly` **memories**: [`MemoryStoreMemories`](MemoryStoreMemories.md)

***

### memoryVersions

> `readonly` **memoryVersions**: [`MemoryStoreMemoryVersions`](MemoryStoreMemoryVersions.md)

## Methods

### archive()

> **archive**(`memoryStoreID`, `options?`): [`APIPromise`](../../index/classes/APIPromise.md)\<[`MemoryStore`](../interfaces/MemoryStore.md)\>

归档 Memory Store.

#### Parameters

##### memoryStoreID

`string`

##### options?

[`RequestOptions`](../../index/interfaces/RequestOptions.md)

#### Returns

[`APIPromise`](../../index/classes/APIPromise.md)\<[`MemoryStore`](../interfaces/MemoryStore.md)\>

#### Operation

archiveMemoryStore

***

### create()

> **create**(`params`, `options?`): [`APIPromise`](../../index/classes/APIPromise.md)\<[`MemoryStore`](../interfaces/MemoryStore.md)\>

创建 Memory Store.

#### Parameters

##### params

[`MemoryStoreNewParams`](../interfaces/MemoryStoreNewParams.md)

##### options?

[`RequestOptions`](../../index/interfaces/RequestOptions.md)

#### Returns

[`APIPromise`](../../index/classes/APIPromise.md)\<[`MemoryStore`](../interfaces/MemoryStore.md)\>

#### Operation

createMemoryStore

***

### delete()

> **delete**(`memoryStoreID`, `options?`): [`APIPromise`](../../index/classes/APIPromise.md)\<[`DeletedMemoryStore`](../interfaces/DeletedMemoryStore.md)\>

删除 Memory Store.

#### Parameters

##### memoryStoreID

`string`

##### options?

[`RequestOptions`](../../index/interfaces/RequestOptions.md)

#### Returns

[`APIPromise`](../../index/classes/APIPromise.md)\<[`DeletedMemoryStore`](../interfaces/DeletedMemoryStore.md)\>

#### Operation

deleteMemoryStore

***

### list()

> **list**(`params?`, `options?`): [`PagePromise`](../../index/classes/PagePromise.md)\<[`MemoryStore`](../interfaces/MemoryStore.md)\>

列出 Memory Store.

#### Parameters

##### params?

[`MemoryStoreListParams`](../interfaces/MemoryStoreListParams.md) = `{}`

##### options?

[`RequestOptions`](../../index/interfaces/RequestOptions.md)

#### Returns

[`PagePromise`](../../index/classes/PagePromise.md)\<[`MemoryStore`](../interfaces/MemoryStore.md)\>

#### Operation

listMemoryStore

***

### retrieve()

> **retrieve**(`memoryStoreID`, `options?`): [`APIPromise`](../../index/classes/APIPromise.md)\<[`MemoryStore`](../interfaces/MemoryStore.md)\>

查询 Memory Store.

#### Parameters

##### memoryStoreID

`string`

##### options?

[`RequestOptions`](../../index/interfaces/RequestOptions.md)

#### Returns

[`APIPromise`](../../index/classes/APIPromise.md)\<[`MemoryStore`](../interfaces/MemoryStore.md)\>

#### Operation

getMemoryStore

***

### update()

> **update**(`memoryStoreID`, `params?`, `options?`): [`APIPromise`](../../index/classes/APIPromise.md)\<[`MemoryStore`](../interfaces/MemoryStore.md)\>

更新 Memory Store.

#### Parameters

##### memoryStoreID

`string`

##### params?

[`MemoryStoreUpdateParams`](../interfaces/MemoryStoreUpdateParams.md) = `{}`

##### options?

[`RequestOptions`](../../index/interfaces/RequestOptions.md)

#### Returns

[`APIPromise`](../../index/classes/APIPromise.md)\<[`MemoryStore`](../interfaces/MemoryStore.md)\>

#### Operation

updateMemoryStore
