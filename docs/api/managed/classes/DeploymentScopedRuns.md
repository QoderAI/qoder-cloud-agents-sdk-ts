[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [managed](../README.md) / DeploymentScopedRuns

# Class: DeploymentScopedRuns

Runs belonging to a specific deployment.

## Extends

- `APIResource`

## Constructors

### Constructor

> **new DeploymentScopedRuns**(`_client`): `DeploymentScopedRuns`

#### Parameters

##### \_client

[`APIClient`](../../index/classes/APIClient.md)

#### Returns

`DeploymentScopedRuns`

#### Inherited from

`APIResource.constructor`

## Properties

### \_client

> `protected` `readonly` **\_client**: [`APIClient`](../../index/classes/APIClient.md)

#### Inherited from

`APIResource._client`

## Methods

### list()

> **list**(`params`, `options?`): [`PagePromise`](../../index/classes/PagePromise.md)\<[`ManagedAgentsDeploymentRun`](../interfaces/ManagedAgentsDeploymentRun.md)\>

#### Parameters

##### params

[`DeploymentScopedRunListParams`](../interfaces/DeploymentScopedRunListParams.md)

##### options?

[`RequestOptions`](../../index/interfaces/RequestOptions.md)

#### Returns

[`PagePromise`](../../index/classes/PagePromise.md)\<[`ManagedAgentsDeploymentRun`](../interfaces/ManagedAgentsDeploymentRun.md)\>

***

### retrieve()

> **retrieve**(`runID`, `params`, `options?`): [`APIPromise`](../../index/classes/APIPromise.md)\<[`ManagedAgentsDeploymentRun`](../interfaces/ManagedAgentsDeploymentRun.md)\>

#### Parameters

##### runID

`string`

##### params

[`DeploymentScopedRunRetrieveParams`](../interfaces/DeploymentScopedRunRetrieveParams.md)

##### options?

[`RequestOptions`](../../index/interfaces/RequestOptions.md)

#### Returns

[`APIPromise`](../../index/classes/APIPromise.md)\<[`ManagedAgentsDeploymentRun`](../interfaces/ManagedAgentsDeploymentRun.md)\>
