[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [managed](../README.md) / MemoryStores

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

> `readonly` **memories**: [`MemoryStoresMemories`](MemoryStoresMemories.md)

***

### memoryVersions

> `readonly` **memoryVersions**: [`MemoryStoresMemoryVersions`](MemoryStoresMemoryVersions.md)

## Methods

### archive()

> **archive**(`memoryStoreID`, `params?`, `options?`): [`APIPromise`](../../index/classes/APIPromise.md)\<[`ManagedAgentsMemoryStore`](../interfaces/ManagedAgentsMemoryStore.md)\>

Archive a memory store

#### Parameters

##### memoryStoreID

`string`

##### params?

[`MemoryStoreArchiveParams`](../interfaces/MemoryStoreArchiveParams.md) \| `null` \| `undefined`

##### options?

[`RequestOptions`](../../index/interfaces/RequestOptions.md)

#### Returns

[`APIPromise`](../../index/classes/APIPromise.md)\<[`ManagedAgentsMemoryStore`](../interfaces/ManagedAgentsMemoryStore.md)\>

***

### create()

> **create**(`params`, `options?`): [`APIPromise`](../../index/classes/APIPromise.md)\<[`ManagedAgentsMemoryStore`](../interfaces/ManagedAgentsMemoryStore.md)\>

Create a memory store

#### Parameters

##### params

[`MemoryStoreNewParams`](../interfaces/MemoryStoreNewParams.md)

##### options?

[`RequestOptions`](../../index/interfaces/RequestOptions.md)

#### Returns

[`APIPromise`](../../index/classes/APIPromise.md)\<[`ManagedAgentsMemoryStore`](../interfaces/ManagedAgentsMemoryStore.md)\>

***

### delete()

> **delete**(`memoryStoreID`, `params?`, `options?`): [`APIPromise`](../../index/classes/APIPromise.md)\<[`ManagedAgentsDeletedMemoryStore`](../interfaces/ManagedAgentsDeletedMemoryStore.md)\>

Delete a memory store

#### Parameters

##### memoryStoreID

`string`

##### params?

[`MemoryStoreDeleteParams`](../interfaces/MemoryStoreDeleteParams.md) \| `null` \| `undefined`

##### options?

[`RequestOptions`](../../index/interfaces/RequestOptions.md)

#### Returns

[`APIPromise`](../../index/classes/APIPromise.md)\<[`ManagedAgentsDeletedMemoryStore`](../interfaces/ManagedAgentsDeletedMemoryStore.md)\>

***

### list()

> **list**(`params?`, `options?`): [`PagePromise`](../../index/classes/PagePromise.md)\<[`ManagedAgentsMemoryStore`](../interfaces/ManagedAgentsMemoryStore.md)\>

List memory stores

#### Parameters

##### params?

[`MemoryStoreListParams`](../interfaces/MemoryStoreListParams.md) \| `null` \| `undefined`

##### options?

[`RequestOptions`](../../index/interfaces/RequestOptions.md)

#### Returns

[`PagePromise`](../../index/classes/PagePromise.md)\<[`ManagedAgentsMemoryStore`](../interfaces/ManagedAgentsMemoryStore.md)\>

***

### retrieve()

> **retrieve**(`memoryStoreID`, `params?`, `options?`): [`APIPromise`](../../index/classes/APIPromise.md)\<[`ManagedAgentsMemoryStore`](../interfaces/ManagedAgentsMemoryStore.md)\>

Retrieve a memory store

#### Parameters

##### memoryStoreID

`string`

##### params?

[`MemoryStoreGetParams`](../interfaces/MemoryStoreGetParams.md) \| `null` \| `undefined`

##### options?

[`RequestOptions`](../../index/interfaces/RequestOptions.md)

#### Returns

[`APIPromise`](../../index/classes/APIPromise.md)\<[`ManagedAgentsMemoryStore`](../interfaces/ManagedAgentsMemoryStore.md)\>

***

### update()

> **update**(`memoryStoreID`, `params?`, `options?`): [`APIPromise`](../../index/classes/APIPromise.md)\<[`ManagedAgentsMemoryStore`](../interfaces/ManagedAgentsMemoryStore.md)\>

Update a memory store

#### Parameters

##### memoryStoreID

`string`

##### params?

[`MemoryStoreUpdateParams`](../interfaces/MemoryStoreUpdateParams.md) \| `null` \| `undefined`

##### options?

[`RequestOptions`](../../index/interfaces/RequestOptions.md)

#### Returns

[`APIPromise`](../../index/classes/APIPromise.md)\<[`ManagedAgentsMemoryStore`](../interfaces/ManagedAgentsMemoryStore.md)\>
