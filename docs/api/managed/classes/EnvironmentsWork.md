[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [managed](../README.md) / EnvironmentsWork

# Class: EnvironmentsWork

## Extends

- `APIResource`

## Constructors

### Constructor

> **new EnvironmentsWork**(`_client`): `EnvironmentsWork`

#### Parameters

##### \_client

[`APIClient`](../../index/classes/APIClient.md)

#### Returns

`EnvironmentsWork`

#### Inherited from

`APIResource.constructor`

## Properties

### \_client

> `protected` `readonly` **\_client**: [`APIClient`](../../index/classes/APIClient.md)

#### Inherited from

`APIResource._client`

## Methods

### ack()

> **ack**(`workID`, `params`, `options?`): [`APIPromise`](../../index/classes/APIPromise.md)\<[`SelfHostedWork`](../interfaces/SelfHostedWork.md)\>

Note: these endpoints are called automatically by the pre-built environment
worker provided in the SDKs and CLI, for orchestrating sessions with self-hosted
sandbox environments. They are included here as a reference; you do not need to
invoke them directly.

Acknowledge receipt of a work item, transitioning it from 'queued' to 'starting'
and removing it from the queue.

#### Parameters

##### workID

`string`

##### params

[`EnvironmentWorkAckParams`](../interfaces/EnvironmentWorkAckParams.md)

##### options?

[`RequestOptions`](../../index/interfaces/RequestOptions.md)

#### Returns

[`APIPromise`](../../index/classes/APIPromise.md)\<[`SelfHostedWork`](../interfaces/SelfHostedWork.md)\>

***

### heartbeat()

> **heartbeat**(`workID`, `params`, `options?`): [`APIPromise`](../../index/classes/APIPromise.md)\<[`SelfHostedWorkHeartbeatResponse`](../interfaces/SelfHostedWorkHeartbeatResponse.md)\>

Note: these endpoints are called automatically by the pre-built environment
worker provided in the SDKs and CLI, for orchestrating sessions with self-hosted
sandbox environments. They are included here as a reference; you do not need to
invoke them directly.

Record a heartbeat for a work item to maintain the lease.

#### Parameters

##### workID

`string`

##### params

[`EnvironmentWorkHeartbeatParams`](../interfaces/EnvironmentWorkHeartbeatParams.md)

##### options?

[`RequestOptions`](../../index/interfaces/RequestOptions.md)

#### Returns

[`APIPromise`](../../index/classes/APIPromise.md)\<[`SelfHostedWorkHeartbeatResponse`](../interfaces/SelfHostedWorkHeartbeatResponse.md)\>

***

### list()

> **list**(`environmentID`, `params?`, `options?`): [`PagePromise`](../../index/classes/PagePromise.md)\<[`SelfHostedWork`](../interfaces/SelfHostedWork.md)\>

Note: these endpoints are called automatically by the pre-built environment
worker provided in the SDKs and CLI, for orchestrating sessions with self-hosted
sandbox environments. They are included here as a reference; you do not need to
invoke them directly.

List work items in an environment.

#### Parameters

##### environmentID

`string`

##### params?

[`EnvironmentWorkListParams`](../interfaces/EnvironmentWorkListParams.md) \| `null` \| `undefined`

##### options?

[`RequestOptions`](../../index/interfaces/RequestOptions.md)

#### Returns

[`PagePromise`](../../index/classes/PagePromise.md)\<[`SelfHostedWork`](../interfaces/SelfHostedWork.md)\>

***

### poll()

> **poll**(`environmentID`, `params?`, `options?`): [`APIPromise`](../../index/classes/APIPromise.md)\<[`SelfHostedWork`](../interfaces/SelfHostedWork.md)\>

Note: these endpoints are called automatically by the pre-built environment
worker provided in the SDKs and CLI, for orchestrating sessions with self-hosted
sandbox environments. They are included here as a reference; you do not need to
invoke them directly.

Long poll for work items in the queue.

#### Parameters

##### environmentID

`string`

##### params?

[`EnvironmentWorkPollParams`](../interfaces/EnvironmentWorkPollParams.md) \| `null` \| `undefined`

##### options?

[`RequestOptions`](../../index/interfaces/RequestOptions.md)

#### Returns

[`APIPromise`](../../index/classes/APIPromise.md)\<[`SelfHostedWork`](../interfaces/SelfHostedWork.md)\>

***

### retrieve()

> **retrieve**(`workID`, `params`, `options?`): [`APIPromise`](../../index/classes/APIPromise.md)\<[`SelfHostedWork`](../interfaces/SelfHostedWork.md)\>

Note: these endpoints are called automatically by the pre-built environment
worker provided in the SDKs and CLI, for orchestrating sessions with self-hosted
sandbox environments. They are included here as a reference; you do not need to
invoke them directly.

Retrieve detailed information about a specific work item.

#### Parameters

##### workID

`string`

##### params

[`EnvironmentWorkGetParams`](../interfaces/EnvironmentWorkGetParams.md)

##### options?

[`RequestOptions`](../../index/interfaces/RequestOptions.md)

#### Returns

[`APIPromise`](../../index/classes/APIPromise.md)\<[`SelfHostedWork`](../interfaces/SelfHostedWork.md)\>

***

### stats()

> **stats**(`environmentID`, `params?`, `options?`): [`APIPromise`](../../index/classes/APIPromise.md)\<[`SelfHostedWorkQueueStats`](../interfaces/SelfHostedWorkQueueStats.md)\>

Get statistics about the work queue for an environment.

#### Parameters

##### environmentID

`string`

##### params?

[`EnvironmentWorkStatsParams`](../interfaces/EnvironmentWorkStatsParams.md) \| `null` \| `undefined`

##### options?

[`RequestOptions`](../../index/interfaces/RequestOptions.md)

#### Returns

[`APIPromise`](../../index/classes/APIPromise.md)\<[`SelfHostedWorkQueueStats`](../interfaces/SelfHostedWorkQueueStats.md)\>

***

### stop()

> **stop**(`workID`, `params`, `options?`): [`APIPromise`](../../index/classes/APIPromise.md)\<[`SelfHostedWork`](../interfaces/SelfHostedWork.md)\>

Note: these endpoints are called automatically by the pre-built environment
worker provided in the SDKs and CLI, for orchestrating sessions with self-hosted
sandbox environments. They are included here as a reference; you do not need to
invoke them directly.

Stop a work item, initiating graceful or forced shutdown.

#### Parameters

##### workID

`string`

##### params

[`EnvironmentWorkStopParams`](../interfaces/EnvironmentWorkStopParams.md)

##### options?

[`RequestOptions`](../../index/interfaces/RequestOptions.md)

#### Returns

[`APIPromise`](../../index/classes/APIPromise.md)\<[`SelfHostedWork`](../interfaces/SelfHostedWork.md)\>

***

### update()

> **update**(`workID`, `params`, `options?`): [`APIPromise`](../../index/classes/APIPromise.md)\<[`SelfHostedWork`](../interfaces/SelfHostedWork.md)\>

Note: these endpoints are called automatically by the pre-built environment
worker provided in the SDKs and CLI, for orchestrating sessions with self-hosted
sandbox environments. They are included here as a reference; you do not need to
invoke them directly.

Update work item metadata with merge semantics.

#### Parameters

##### workID

`string`

##### params

[`EnvironmentWorkUpdateParams`](../interfaces/EnvironmentWorkUpdateParams.md)

##### options?

[`RequestOptions`](../../index/interfaces/RequestOptions.md)

#### Returns

[`APIPromise`](../../index/classes/APIPromise.md)\<[`SelfHostedWork`](../interfaces/SelfHostedWork.md)\>
