[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [forward](../README.md) / MemoryStoreMemories

# Class: MemoryStoreMemories

## Extends

- `APIResource`

## Constructors

### Constructor

> **new MemoryStoreMemories**(`_client`): `MemoryStoreMemories`

#### Parameters

##### \_client

[`APIClient`](../../index/classes/APIClient.md)

#### Returns

`MemoryStoreMemories`

#### Inherited from

`APIResource.constructor`

## Properties

### \_client

> `protected` `readonly` **\_client**: [`APIClient`](../../index/classes/APIClient.md)

#### Inherited from

`APIResource._client`

## Methods

### create()

> **create**(`memoryStoreID`, `params`, `options?`): [`APIPromise`](../../index/classes/APIPromise.md)\<[`Memory`](../interfaces/Memory.md)\>

创建 Memory.

#### Parameters

##### memoryStoreID

`string`

##### params

[`MemoryStoreMemoryNewParams`](../interfaces/MemoryStoreMemoryNewParams.md)

##### options?

[`RequestOptions`](../../index/interfaces/RequestOptions.md)

#### Returns

[`APIPromise`](../../index/classes/APIPromise.md)\<[`Memory`](../interfaces/Memory.md)\>

#### Operation

createMemoryStoreMemory

***

### delete()

> **delete**(`memoryStoreID`, `memoryID`, `options?`): [`APIPromise`](../../index/classes/APIPromise.md)\<[`DeletedMemory`](../interfaces/DeletedMemory.md)\>

删除 Memory.

#### Parameters

##### memoryStoreID

`string`

##### memoryID

`string`

##### options?

[`RequestOptions`](../../index/interfaces/RequestOptions.md)

#### Returns

[`APIPromise`](../../index/classes/APIPromise.md)\<[`DeletedMemory`](../interfaces/DeletedMemory.md)\>

#### Operation

deleteMemoryStoreMemory

***

### list()

> **list**(`memoryStoreID`, `params?`, `options?`): [`PagePromise`](../../index/classes/PagePromise.md)\<[`Memory`](../interfaces/Memory.md)\>

列出 Memory.

#### Parameters

##### memoryStoreID

`string`

##### params?

[`MemoryStoreMemoryListParams`](../interfaces/MemoryStoreMemoryListParams.md) = `{}`

##### options?

[`RequestOptions`](../../index/interfaces/RequestOptions.md)

#### Returns

[`PagePromise`](../../index/classes/PagePromise.md)\<[`Memory`](../interfaces/Memory.md)\>

#### Operation

listMemoryStoreMemoryMemories

***

### retrieve()

> **retrieve**(`memoryStoreID`, `memoryID`, `options?`): [`APIPromise`](../../index/classes/APIPromise.md)\<[`Memory`](../interfaces/Memory.md)\>

查询 Memory.

#### Parameters

##### memoryStoreID

`string`

##### memoryID

`string`

##### options?

[`RequestOptions`](../../index/interfaces/RequestOptions.md)

#### Returns

[`APIPromise`](../../index/classes/APIPromise.md)\<[`Memory`](../interfaces/Memory.md)\>

#### Operation

getMemoryStoreMemory

***

### update()

> **update**(`memoryStoreID`, `memoryID`, `params`, `options?`): [`APIPromise`](../../index/classes/APIPromise.md)\<[`Memory`](../interfaces/Memory.md)\>

更新 Memory.

#### Parameters

##### memoryStoreID

`string`

##### memoryID

`string`

##### params

[`MemoryStoreMemoryUpdateParams`](../interfaces/MemoryStoreMemoryUpdateParams.md)

##### options?

[`RequestOptions`](../../index/interfaces/RequestOptions.md)

#### Returns

[`APIPromise`](../../index/classes/APIPromise.md)\<[`Memory`](../interfaces/Memory.md)\>

#### Operation

updateMemoryStoreMemory
