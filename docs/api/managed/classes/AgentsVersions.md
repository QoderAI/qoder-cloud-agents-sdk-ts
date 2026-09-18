[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [managed](../README.md) / AgentsVersions

# Class: AgentsVersions

## Extends

- `APIResource`

## Constructors

### Constructor

> **new AgentsVersions**(`_client`): `AgentsVersions`

#### Parameters

##### \_client

[`APIClient`](../../index/classes/APIClient.md)

#### Returns

`AgentsVersions`

#### Inherited from

`APIResource.constructor`

## Properties

### \_client

> `protected` `readonly` **\_client**: [`APIClient`](../../index/classes/APIClient.md)

#### Inherited from

`APIResource._client`

## Methods

### list()

> **list**(`agentID`, `params?`, `options?`): [`PagePromise`](../../index/classes/PagePromise.md)\<[`ManagedAgentsAgent`](../interfaces/ManagedAgentsAgent.md)\>

List Agent Versions

#### Parameters

##### agentID

`string`

##### params?

[`AgentVersionListParams`](../interfaces/AgentVersionListParams.md) \| `null` \| `undefined`

##### options?

[`RequestOptions`](../../index/interfaces/RequestOptions.md)

#### Returns

[`PagePromise`](../../index/classes/PagePromise.md)\<[`ManagedAgentsAgent`](../interfaces/ManagedAgentsAgent.md)\>
