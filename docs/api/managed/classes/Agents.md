[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [managed](../README.md) / Agents

# Class: Agents

## Extends

- `APIResource`

## Constructors

### Constructor

> **new Agents**(`_client`): `Agents`

#### Parameters

##### \_client

[`APIClient`](../../index/classes/APIClient.md)

#### Returns

`Agents`

#### Inherited from

`APIResource.constructor`

## Properties

### \_client

> `protected` `readonly` **\_client**: [`APIClient`](../../index/classes/APIClient.md)

#### Inherited from

`APIResource._client`

***

### versions

> `readonly` **versions**: [`AgentsVersions`](AgentsVersions.md)

## Methods

### archive()

> **archive**(`agentID`, `params?`, `options?`): [`APIPromise`](../../index/classes/APIPromise.md)\<[`ManagedAgentsAgent`](../interfaces/ManagedAgentsAgent.md)\>

Archive Agent

#### Parameters

##### agentID

`string`

##### params?

[`AgentArchiveParams`](../interfaces/AgentArchiveParams.md) \| `null` \| `undefined`

##### options?

[`RequestOptions`](../../index/interfaces/RequestOptions.md)

#### Returns

[`APIPromise`](../../index/classes/APIPromise.md)\<[`ManagedAgentsAgent`](../interfaces/ManagedAgentsAgent.md)\>

***

### create()

> **create**(`params`, `options?`): [`APIPromise`](../../index/classes/APIPromise.md)\<[`ManagedAgentsAgent`](../interfaces/ManagedAgentsAgent.md)\>

Create Agent

#### Parameters

##### params

[`AgentNewParams`](../interfaces/AgentNewParams.md)

##### options?

[`RequestOptions`](../../index/interfaces/RequestOptions.md)

#### Returns

[`APIPromise`](../../index/classes/APIPromise.md)\<[`ManagedAgentsAgent`](../interfaces/ManagedAgentsAgent.md)\>

***

### list()

> **list**(`params?`, `options?`): [`PagePromise`](../../index/classes/PagePromise.md)\<[`ManagedAgentsAgent`](../interfaces/ManagedAgentsAgent.md)\>

List Agents

#### Parameters

##### params?

[`AgentListParams`](../interfaces/AgentListParams.md) \| `null` \| `undefined`

##### options?

[`RequestOptions`](../../index/interfaces/RequestOptions.md)

#### Returns

[`PagePromise`](../../index/classes/PagePromise.md)\<[`ManagedAgentsAgent`](../interfaces/ManagedAgentsAgent.md)\>

***

### retrieve()

> **retrieve**(`agentID`, `params?`, `options?`): [`APIPromise`](../../index/classes/APIPromise.md)\<[`ManagedAgentsAgent`](../interfaces/ManagedAgentsAgent.md)\>

Get Agent

#### Parameters

##### agentID

`string`

##### params?

[`AgentGetParams`](../interfaces/AgentGetParams.md) \| `null` \| `undefined`

##### options?

[`RequestOptions`](../../index/interfaces/RequestOptions.md)

#### Returns

[`APIPromise`](../../index/classes/APIPromise.md)\<[`ManagedAgentsAgent`](../interfaces/ManagedAgentsAgent.md)\>

***

### update()

> **update**(`agentID`, `params?`, `options?`): [`APIPromise`](../../index/classes/APIPromise.md)\<[`ManagedAgentsAgent`](../interfaces/ManagedAgentsAgent.md)\>

Update Agent

#### Parameters

##### agentID

`string`

##### params?

[`AgentUpdateParams`](../interfaces/AgentUpdateParams.md) \| `null` \| `undefined`

##### options?

[`RequestOptions`](../../index/interfaces/RequestOptions.md)

#### Returns

[`APIPromise`](../../index/classes/APIPromise.md)\<[`ManagedAgentsAgent`](../interfaces/ManagedAgentsAgent.md)\>
