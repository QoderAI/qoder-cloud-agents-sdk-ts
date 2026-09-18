[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [forward](../README.md) / MemoryStoreMemoryVersions

# Class: MemoryStoreMemoryVersions

## Extends

- `APIResource`

## Constructors

### Constructor

> **new MemoryStoreMemoryVersions**(`_client`): `MemoryStoreMemoryVersions`

#### Parameters

##### \_client

[`APIClient`](../../index/classes/APIClient.md)

#### Returns

`MemoryStoreMemoryVersions`

#### Inherited from

`APIResource.constructor`

## Properties

### \_client

> `protected` `readonly` **\_client**: [`APIClient`](../../index/classes/APIClient.md)

#### Inherited from

`APIResource._client`

## Methods

### list()

> **list**(`memoryStoreID`, `params?`, `options?`): [`PagePromise`](../../index/classes/PagePromise.md)\<[`MemoryVersion`](../interfaces/MemoryVersion.md)\>

列出 Memory 版本.

#### Parameters

##### memoryStoreID

`string`

##### params?

[`MemoryStoreMemoryVersionListParams`](../interfaces/MemoryStoreMemoryVersionListParams.md) = `{}`

##### options?

[`RequestOptions`](../../index/interfaces/RequestOptions.md)

#### Returns

[`PagePromise`](../../index/classes/PagePromise.md)\<[`MemoryVersion`](../interfaces/MemoryVersion.md)\>

#### Operation

listMemoryStoreMemoryVersion

***

### redact()

> **redact**(`memoryStoreID`, `memoryVersionID`, `options?`): [`APIPromise`](../../index/classes/APIPromise.md)\<[`MemoryVersion`](../interfaces/MemoryVersion.md)\>

Redact Memory 版本.

#### Parameters

##### memoryStoreID

`string`

##### memoryVersionID

`string`

##### options?

[`RequestOptions`](../../index/interfaces/RequestOptions.md)

#### Returns

[`APIPromise`](../../index/classes/APIPromise.md)\<[`MemoryVersion`](../interfaces/MemoryVersion.md)\>

#### Operation

redactMemoryStoreMemoryVersion

***

### retrieve()

> **retrieve**(`memoryStoreID`, `memoryVersionID`, `options?`): [`APIPromise`](../../index/classes/APIPromise.md)\<[`MemoryVersion`](../interfaces/MemoryVersion.md)\>

查询 Memory 版本.

#### Parameters

##### memoryStoreID

`string`

##### memoryVersionID

`string`

##### options?

[`RequestOptions`](../../index/interfaces/RequestOptions.md)

#### Returns

[`APIPromise`](../../index/classes/APIPromise.md)\<[`MemoryVersion`](../interfaces/MemoryVersion.md)\>

#### Operation

getMemoryStoreMemoryVersion
