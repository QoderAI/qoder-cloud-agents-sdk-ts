[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [forward](../README.md) / Schedules

# Class: Schedules

## Extends

- `APIResource`

## Constructors

### Constructor

> **new Schedules**(`_client`): `Schedules`

#### Parameters

##### \_client

[`APIClient`](../../index/classes/APIClient.md)

#### Returns

`Schedules`

#### Inherited from

`APIResource.constructor`

## Properties

### \_client

> `protected` `readonly` **\_client**: [`APIClient`](../../index/classes/APIClient.md)

#### Inherited from

`APIResource._client`

## Methods

### archive()

> **archive**(`scheduleID`, `params?`, `options?`): [`APIPromise`](../../index/classes/APIPromise.md)\<[`Schedule`](../interfaces/Schedule.md)\>

归档 Schedule.

#### Parameters

##### scheduleID

`string`

##### params?

[`ScheduleArchiveParams`](../interfaces/ScheduleArchiveParams.md) = `{}`

##### options?

[`RequestOptions`](../../index/interfaces/RequestOptions.md)

#### Returns

[`APIPromise`](../../index/classes/APIPromise.md)\<[`Schedule`](../interfaces/Schedule.md)\>

#### Operation

archiveSchedule

***

### archiveMany()

> **archiveMany**(`params`, `options?`): [`APIPromise`](../../index/classes/APIPromise.md)\<[`ScheduleArchiveManyResponse`](../interfaces/ScheduleArchiveManyResponse.md)\>

批量归档 Schedules.

#### Parameters

##### params

[`ScheduleArchiveManyParams`](../interfaces/ScheduleArchiveManyParams.md)

##### options?

[`RequestOptions`](../../index/interfaces/RequestOptions.md)

#### Returns

[`APIPromise`](../../index/classes/APIPromise.md)\<[`ScheduleArchiveManyResponse`](../interfaces/ScheduleArchiveManyResponse.md)\>

#### Operation

archiveSchedules

***

### create()

> **create**(`params`, `options?`): [`APIPromise`](../../index/classes/APIPromise.md)\<[`Schedule`](../interfaces/Schedule.md)\>

创建 Schedule.

#### Parameters

##### params

[`ScheduleNewParams`](../interfaces/ScheduleNewParams.md)

##### options?

[`RequestOptions`](../../index/interfaces/RequestOptions.md)

#### Returns

[`APIPromise`](../../index/classes/APIPromise.md)\<[`Schedule`](../interfaces/Schedule.md)\>

#### Operation

createSchedule

***

### list()

> **list**(`params?`, `options?`): [`PagePromise`](../../index/classes/PagePromise.md)\<[`Schedule`](../interfaces/Schedule.md)\>

列出 Schedules.

#### Parameters

##### params?

[`ScheduleListParams`](../interfaces/ScheduleListParams.md) = `{}`

##### options?

[`RequestOptions`](../../index/interfaces/RequestOptions.md)

#### Returns

[`PagePromise`](../../index/classes/PagePromise.md)\<[`Schedule`](../interfaces/Schedule.md)\>

#### Operation

listSchedules

***

### pause()

> **pause**(`scheduleID`, `params?`, `options?`): [`APIPromise`](../../index/classes/APIPromise.md)\<[`Schedule`](../interfaces/Schedule.md)\>

暂停 Schedule.

#### Parameters

##### scheduleID

`string`

##### params?

[`SchedulePauseParams`](../interfaces/SchedulePauseParams.md) = `{}`

##### options?

[`RequestOptions`](../../index/interfaces/RequestOptions.md)

#### Returns

[`APIPromise`](../../index/classes/APIPromise.md)\<[`Schedule`](../interfaces/Schedule.md)\>

#### Operation

pauseSchedule

***

### retrieve()

> **retrieve**(`scheduleID`, `options?`): [`APIPromise`](../../index/classes/APIPromise.md)\<[`Schedule`](../interfaces/Schedule.md)\>

获取 Schedule.

#### Parameters

##### scheduleID

`string`

##### options?

[`RequestOptions`](../../index/interfaces/RequestOptions.md)

#### Returns

[`APIPromise`](../../index/classes/APIPromise.md)\<[`Schedule`](../interfaces/Schedule.md)\>

#### Operation

getSchedule

***

### run()

> **run**(`scheduleID`, `params?`, `options?`): [`APIPromise`](../../index/classes/APIPromise.md)\<[`ScheduleRun`](../interfaces/ScheduleRun.md)\>

运行 Schedule.

#### Parameters

##### scheduleID

`string`

##### params?

[`ScheduleRunParams`](../interfaces/ScheduleRunParams.md) = `{}`

##### options?

[`RequestOptions`](../../index/interfaces/RequestOptions.md)

#### Returns

[`APIPromise`](../../index/classes/APIPromise.md)\<[`ScheduleRun`](../interfaces/ScheduleRun.md)\>

#### Operation

runSchedule

***

### unpause()

> **unpause**(`scheduleID`, `params?`, `options?`): [`APIPromise`](../../index/classes/APIPromise.md)\<[`Schedule`](../interfaces/Schedule.md)\>

恢复 Schedule.

#### Parameters

##### scheduleID

`string`

##### params?

[`ScheduleUnpauseParams`](../interfaces/ScheduleUnpauseParams.md) = `{}`

##### options?

[`RequestOptions`](../../index/interfaces/RequestOptions.md)

#### Returns

[`APIPromise`](../../index/classes/APIPromise.md)\<[`Schedule`](../interfaces/Schedule.md)\>

#### Operation

unpauseSchedule

***

### update()

> **update**(`scheduleID`, `params?`, `options?`): [`APIPromise`](../../index/classes/APIPromise.md)\<[`Schedule`](../interfaces/Schedule.md)\>

更新 Schedule.

#### Parameters

##### scheduleID

`string`

##### params?

[`ScheduleUpdateParams`](../interfaces/ScheduleUpdateParams.md) = `{}`

##### options?

[`RequestOptions`](../../index/interfaces/RequestOptions.md)

#### Returns

[`APIPromise`](../../index/classes/APIPromise.md)\<[`Schedule`](../interfaces/Schedule.md)\>

#### Operation

updateSchedule
