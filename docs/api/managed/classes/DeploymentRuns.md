[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [managed](../README.md) / DeploymentRuns

# Class: DeploymentRuns

## Extends

- `APIResource`

## Constructors

### Constructor

> **new DeploymentRuns**(`_client`): `DeploymentRuns`

#### Parameters

##### \_client

[`APIClient`](../../index/classes/APIClient.md)

#### Returns

`DeploymentRuns`

#### Inherited from

`APIResource.constructor`

## Properties

### \_client

> `protected` `readonly` **\_client**: [`APIClient`](../../index/classes/APIClient.md)

#### Inherited from

`APIResource._client`

## Methods

### list()

> **list**(`params?`, `options?`): [`PagePromise`](../../index/classes/PagePromise.md)\<[`ManagedAgentsDeploymentRun`](../interfaces/ManagedAgentsDeploymentRun.md)\>

List Deployment Runs

#### Parameters

##### params?

[`DeploymentRunListParams`](../interfaces/DeploymentRunListParams.md) \| `null` \| `undefined`

##### options?

[`RequestOptions`](../../index/interfaces/RequestOptions.md)

#### Returns

[`PagePromise`](../../index/classes/PagePromise.md)\<[`ManagedAgentsDeploymentRun`](../interfaces/ManagedAgentsDeploymentRun.md)\>

***

### retrieve()

> **retrieve**(`deploymentRunID`, `params?`, `options?`): [`APIPromise`](../../index/classes/APIPromise.md)\<[`ManagedAgentsDeploymentRun`](../interfaces/ManagedAgentsDeploymentRun.md)\>

Get Deployment Run

#### Parameters

##### deploymentRunID

`string`

##### params?

[`DeploymentRunGetParams`](../interfaces/DeploymentRunGetParams.md) \| `null` \| `undefined`

##### options?

[`RequestOptions`](../../index/interfaces/RequestOptions.md)

#### Returns

[`APIPromise`](../../index/classes/APIPromise.md)\<[`ManagedAgentsDeploymentRun`](../interfaces/ManagedAgentsDeploymentRun.md)\>
