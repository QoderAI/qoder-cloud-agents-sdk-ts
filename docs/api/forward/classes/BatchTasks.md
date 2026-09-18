[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [forward](../README.md) / BatchTasks

# Class: BatchTasks

## Extends

- `APIResource`

## Constructors

### Constructor

> **new BatchTasks**(`_client`): `BatchTasks`

#### Parameters

##### \_client

[`APIClient`](../../index/classes/APIClient.md)

#### Returns

`BatchTasks`

#### Inherited from

`APIResource.constructor`

## Properties

### \_client

> `protected` `readonly` **\_client**: [`APIClient`](../../index/classes/APIClient.md)

#### Inherited from

`APIResource._client`

## Methods

### list()

> **list**(`batchID`, `params?`, `options?`): [`PagePromise`](../../index/classes/PagePromise.md)\<[`BatchTask`](../interfaces/BatchTask.md)\>

查询 Batch 子任务.

#### Parameters

##### batchID

`string`

##### params?

[`BatchTaskListParams`](../interfaces/BatchTaskListParams.md) = `{}`

##### options?

[`RequestOptions`](../../index/interfaces/RequestOptions.md)

#### Returns

[`PagePromise`](../../index/classes/PagePromise.md)\<[`BatchTask`](../interfaces/BatchTask.md)\>

#### Operation

listBatchTasks
