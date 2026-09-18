[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [managed](../README.md) / MemoryStoresMemoryVersions

# Class: MemoryStoresMemoryVersions

## Extends

- `APIResource`

## Constructors

### Constructor

> **new MemoryStoresMemoryVersions**(`_client`): `MemoryStoresMemoryVersions`

#### Parameters

##### \_client

[`APIClient`](../../index/classes/APIClient.md)

#### Returns

`MemoryStoresMemoryVersions`

#### Inherited from

`APIResource.constructor`

## Properties

### \_client

> `protected` `readonly` **\_client**: [`APIClient`](../../index/classes/APIClient.md)

#### Inherited from

`APIResource._client`

## Methods

### list()

> **list**(`memoryStoreID`, `params?`, `options?`): [`PagePromise`](../../index/classes/PagePromise.md)\<[`ManagedAgentsMemoryVersion`](../interfaces/ManagedAgentsMemoryVersion.md)\>

List memory versions

#### Parameters

##### memoryStoreID

`string`

##### params?

[`MemoryStoreMemoryVersionListParams`](../interfaces/MemoryStoreMemoryVersionListParams.md) \| `null` \| `undefined`

##### options?

[`RequestOptions`](../../index/interfaces/RequestOptions.md)

#### Returns

[`PagePromise`](../../index/classes/PagePromise.md)\<[`ManagedAgentsMemoryVersion`](../interfaces/ManagedAgentsMemoryVersion.md)\>

***

### redact()

> **redact**(`memoryVersionID`, `params`, `options?`): [`APIPromise`](../../index/classes/APIPromise.md)\<[`ManagedAgentsMemoryVersion`](../interfaces/ManagedAgentsMemoryVersion.md)\>

Redact a memory version

#### Parameters

##### memoryVersionID

`string`

##### params

[`MemoryStoreMemoryVersionRedactParams`](../interfaces/MemoryStoreMemoryVersionRedactParams.md)

##### options?

[`RequestOptions`](../../index/interfaces/RequestOptions.md)

#### Returns

[`APIPromise`](../../index/classes/APIPromise.md)\<[`ManagedAgentsMemoryVersion`](../interfaces/ManagedAgentsMemoryVersion.md)\>

***

### retrieve()

> **retrieve**(`memoryVersionID`, `params`, `options?`): [`APIPromise`](../../index/classes/APIPromise.md)\<[`ManagedAgentsMemoryVersion`](../interfaces/ManagedAgentsMemoryVersion.md)\>

Retrieve a memory version

#### Parameters

##### memoryVersionID

`string`

##### params

[`MemoryStoreMemoryVersionGetParams`](../interfaces/MemoryStoreMemoryVersionGetParams.md)

##### options?

[`RequestOptions`](../../index/interfaces/RequestOptions.md)

#### Returns

[`APIPromise`](../../index/classes/APIPromise.md)\<[`ManagedAgentsMemoryVersion`](../interfaces/ManagedAgentsMemoryVersion.md)\>
