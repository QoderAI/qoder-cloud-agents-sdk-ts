[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [forward](../README.md) / ScheduleRuns

# Class: ScheduleRuns

## Extends

- `APIResource`

## Constructors

### Constructor

> **new ScheduleRuns**(`_client`): `ScheduleRuns`

#### Parameters

##### \_client

[`APIClient`](../../index/classes/APIClient.md)

#### Returns

`ScheduleRuns`

#### Inherited from

`APIResource.constructor`

## Properties

### \_client

> `protected` `readonly` **\_client**: [`APIClient`](../../index/classes/APIClient.md)

#### Inherited from

`APIResource._client`

## Methods

### list()

> **list**(`params`, `options?`): [`PagePromise`](../../index/classes/PagePromise.md)\<[`ScheduleRun`](../interfaces/ScheduleRun.md)\>

列出 Schedule Runs.

#### Parameters

##### params

[`ScheduleRunListParams`](../interfaces/ScheduleRunListParams.md)

##### options?

[`RequestOptions`](../../index/interfaces/RequestOptions.md)

#### Returns

[`PagePromise`](../../index/classes/PagePromise.md)\<[`ScheduleRun`](../interfaces/ScheduleRun.md)\>

#### Operation

listScheduleRuns

***

### retrieve()

> **retrieve**(`runID`, `params?`, `options?`): [`APIPromise`](../../index/classes/APIPromise.md)\<[`ScheduleRun`](../interfaces/ScheduleRun.md)\>

获取 Schedule Run.

#### Parameters

##### runID

`string`

##### params?

[`ScheduleRunGetParams`](../interfaces/ScheduleRunGetParams.md) = `{}`

##### options?

[`RequestOptions`](../../index/interfaces/RequestOptions.md)

#### Returns

[`APIPromise`](../../index/classes/APIPromise.md)\<[`ScheduleRun`](../interfaces/ScheduleRun.md)\>

#### Operation

getScheduleRun
