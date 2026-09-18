[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [managed](../README.md) / MemoryStoresMemories

# Class: MemoryStoresMemories

## Extends

- `APIResource`

## Constructors

### Constructor

> **new MemoryStoresMemories**(`_client`): `MemoryStoresMemories`

#### Parameters

##### \_client

[`APIClient`](../../index/classes/APIClient.md)

#### Returns

`MemoryStoresMemories`

#### Inherited from

`APIResource.constructor`

## Properties

### \_client

> `protected` `readonly` **\_client**: [`APIClient`](../../index/classes/APIClient.md)

#### Inherited from

`APIResource._client`

## Methods

### create()

> **create**(`memoryStoreID`, `params`, `options?`): [`APIPromise`](../../index/classes/APIPromise.md)\<[`ManagedAgentsMemory`](../interfaces/ManagedAgentsMemory.md)\>

Create a memory

#### Parameters

##### memoryStoreID

`string`

##### params

[`MemoryStoreMemoryNewParams`](../interfaces/MemoryStoreMemoryNewParams.md)

##### options?

[`RequestOptions`](../../index/interfaces/RequestOptions.md)

#### Returns

[`APIPromise`](../../index/classes/APIPromise.md)\<[`ManagedAgentsMemory`](../interfaces/ManagedAgentsMemory.md)\>

***

### delete()

> **delete**(`memoryID`, `params`, `options?`): [`APIPromise`](../../index/classes/APIPromise.md)\<[`ManagedAgentsDeletedMemory`](../interfaces/ManagedAgentsDeletedMemory.md)\>

Delete a memory

#### Parameters

##### memoryID

`string`

##### params

[`MemoryStoreMemoryDeleteParams`](../interfaces/MemoryStoreMemoryDeleteParams.md)

##### options?

[`RequestOptions`](../../index/interfaces/RequestOptions.md)

#### Returns

[`APIPromise`](../../index/classes/APIPromise.md)\<[`ManagedAgentsDeletedMemory`](../interfaces/ManagedAgentsDeletedMemory.md)\>

***

### list()

> **list**(`memoryStoreID`, `params?`, `options?`): [`PagePromise`](../../index/classes/PagePromise.md)\<[`ManagedAgentsMemoryListItemUnion`](../type-aliases/ManagedAgentsMemoryListItemUnion.md)\>

List memories

#### Parameters

##### memoryStoreID

`string`

##### params?

[`MemoryStoreMemoryListParams`](../interfaces/MemoryStoreMemoryListParams.md) \| `null` \| `undefined`

##### options?

[`RequestOptions`](../../index/interfaces/RequestOptions.md)

#### Returns

[`PagePromise`](../../index/classes/PagePromise.md)\<[`ManagedAgentsMemoryListItemUnion`](../type-aliases/ManagedAgentsMemoryListItemUnion.md)\>

***

### retrieve()

> **retrieve**(`memoryID`, `params`, `options?`): [`APIPromise`](../../index/classes/APIPromise.md)\<[`ManagedAgentsMemory`](../interfaces/ManagedAgentsMemory.md)\>

Retrieve a memory

#### Parameters

##### memoryID

`string`

##### params

[`MemoryStoreMemoryGetParams`](../interfaces/MemoryStoreMemoryGetParams.md)

##### options?

[`RequestOptions`](../../index/interfaces/RequestOptions.md)

#### Returns

[`APIPromise`](../../index/classes/APIPromise.md)\<[`ManagedAgentsMemory`](../interfaces/ManagedAgentsMemory.md)\>

***

### update()

> **update**(`memoryID`, `params`, `options?`): [`APIPromise`](../../index/classes/APIPromise.md)\<[`ManagedAgentsMemory`](../interfaces/ManagedAgentsMemory.md)\>

Update a memory

#### Parameters

##### memoryID

`string`

##### params

[`MemoryStoreMemoryUpdateParams`](../interfaces/MemoryStoreMemoryUpdateParams.md)

##### options?

[`RequestOptions`](../../index/interfaces/RequestOptions.md)

#### Returns

[`APIPromise`](../../index/classes/APIPromise.md)\<[`ManagedAgentsMemory`](../interfaces/ManagedAgentsMemory.md)\>
