[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [forward](../README.md) / Batches

# Class: Batches

## Extends

- `APIResource`

## Constructors

### Constructor

> **new Batches**(`_client`): `Batches`

#### Parameters

##### \_client

[`APIClient`](../../index/classes/APIClient.md)

#### Returns

`Batches`

#### Inherited from

`APIResource.constructor`

## Properties

### \_client

> `protected` `readonly` **\_client**: [`APIClient`](../../index/classes/APIClient.md)

#### Inherited from

`APIResource._client`

***

### tasks

> `readonly` **tasks**: [`BatchTasks`](BatchTasks.md)

## Methods

### cancel()

> **cancel**(`batchID`, `params?`, `options?`): [`APIPromise`](../../index/classes/APIPromise.md)\<[`Batch`](../interfaces/Batch.md)\>

取消 Batch.

#### Parameters

##### batchID

`string`

##### params?

[`BatchCancelParams`](../interfaces/BatchCancelParams.md) = `{}`

##### options?

[`RequestOptions`](../../index/interfaces/RequestOptions.md)

#### Returns

[`APIPromise`](../../index/classes/APIPromise.md)\<[`Batch`](../interfaces/Batch.md)\>

#### Operation

cancelBatch

***

### create()

> **create**(`params`, `options?`): [`APIPromise`](../../index/classes/APIPromise.md)\<[`Batch`](../interfaces/Batch.md)\>

创建 Batch.

#### Parameters

##### params

[`BatchNewParams`](../interfaces/BatchNewParams.md)

##### options?

[`RequestOptions`](../../index/interfaces/RequestOptions.md)

#### Returns

[`APIPromise`](../../index/classes/APIPromise.md)\<[`Batch`](../interfaces/Batch.md)\>

#### Operation

createBatch

***

### getError()

> **getError**(`batchID`, `options?`): [`APIPromise`](../../index/classes/APIPromise.md)\<[`BatchFile`](../interfaces/BatchFile.md)\>

获取错误文件.

#### Parameters

##### batchID

`string`

##### options?

[`RequestOptions`](../../index/interfaces/RequestOptions.md)

#### Returns

[`APIPromise`](../../index/classes/APIPromise.md)\<[`BatchFile`](../interfaces/BatchFile.md)\>

#### Operation

getBatchError

***

### getOutput()

> **getOutput**(`batchID`, `options?`): [`APIPromise`](../../index/classes/APIPromise.md)\<[`BatchFile`](../interfaces/BatchFile.md)\>

获取输出文件.

#### Parameters

##### batchID

`string`

##### options?

[`RequestOptions`](../../index/interfaces/RequestOptions.md)

#### Returns

[`APIPromise`](../../index/classes/APIPromise.md)\<[`BatchFile`](../interfaces/BatchFile.md)\>

#### Operation

getBatchOutput

***

### list()

> **list**(`params?`, `options?`): [`PagePromise`](../../index/classes/PagePromise.md)\<[`Batch`](../interfaces/Batch.md)\>

列出 Batches.

#### Parameters

##### params?

[`BatchListParams`](../interfaces/BatchListParams.md) = `{}`

##### options?

[`RequestOptions`](../../index/interfaces/RequestOptions.md)

#### Returns

[`PagePromise`](../../index/classes/PagePromise.md)\<[`Batch`](../interfaces/Batch.md)\>

#### Operation

listBatches

***

### retrieve()

> **retrieve**(`batchID`, `options?`): [`APIPromise`](../../index/classes/APIPromise.md)\<[`Batch`](../interfaces/Batch.md)\>

查询 Batch 详情.

#### Parameters

##### batchID

`string`

##### options?

[`RequestOptions`](../../index/interfaces/RequestOptions.md)

#### Returns

[`APIPromise`](../../index/classes/APIPromise.md)\<[`Batch`](../interfaces/Batch.md)\>

#### Operation

getBatch
