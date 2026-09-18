[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [managed](../README.md) / Deployments

# Class: Deployments

## Extends

- `APIResource`

## Constructors

### Constructor

> **new Deployments**(`_client`): `Deployments`

#### Parameters

##### \_client

[`APIClient`](../../index/classes/APIClient.md)

#### Returns

`Deployments`

#### Inherited from

`APIResource.constructor`

## Properties

### \_client

> `protected` `readonly` **\_client**: [`APIClient`](../../index/classes/APIClient.md)

#### Inherited from

`APIResource._client`

## Methods

### archive()

> **archive**(`deploymentID`, `params?`, `options?`): [`APIPromise`](../../index/classes/APIPromise.md)\<[`ManagedAgentsDeployment`](../interfaces/ManagedAgentsDeployment.md)\>

Archive Deployment

#### Parameters

##### deploymentID

`string`

##### params?

[`DeploymentArchiveParams`](../interfaces/DeploymentArchiveParams.md) \| `null` \| `undefined`

##### options?

[`RequestOptions`](../../index/interfaces/RequestOptions.md)

#### Returns

[`APIPromise`](../../index/classes/APIPromise.md)\<[`ManagedAgentsDeployment`](../interfaces/ManagedAgentsDeployment.md)\>

***

### create()

> **create**(`params`, `options?`): [`APIPromise`](../../index/classes/APIPromise.md)\<[`ManagedAgentsDeployment`](../interfaces/ManagedAgentsDeployment.md)\>

Create Deployment

#### Parameters

##### params

[`DeploymentNewParams`](../interfaces/DeploymentNewParams.md)

##### options?

[`RequestOptions`](../../index/interfaces/RequestOptions.md)

#### Returns

[`APIPromise`](../../index/classes/APIPromise.md)\<[`ManagedAgentsDeployment`](../interfaces/ManagedAgentsDeployment.md)\>

***

### list()

> **list**(`params?`, `options?`): [`PagePromise`](../../index/classes/PagePromise.md)\<[`ManagedAgentsDeployment`](../interfaces/ManagedAgentsDeployment.md)\>

List Deployments

#### Parameters

##### params?

[`DeploymentListParams`](../interfaces/DeploymentListParams.md) \| `null` \| `undefined`

##### options?

[`RequestOptions`](../../index/interfaces/RequestOptions.md)

#### Returns

[`PagePromise`](../../index/classes/PagePromise.md)\<[`ManagedAgentsDeployment`](../interfaces/ManagedAgentsDeployment.md)\>

***

### pause()

> **pause**(`deploymentID`, `params?`, `options?`): [`APIPromise`](../../index/classes/APIPromise.md)\<[`ManagedAgentsDeployment`](../interfaces/ManagedAgentsDeployment.md)\>

Pause Deployment

#### Parameters

##### deploymentID

`string`

##### params?

[`DeploymentPauseParams`](../interfaces/DeploymentPauseParams.md) \| `null` \| `undefined`

##### options?

[`RequestOptions`](../../index/interfaces/RequestOptions.md)

#### Returns

[`APIPromise`](../../index/classes/APIPromise.md)\<[`ManagedAgentsDeployment`](../interfaces/ManagedAgentsDeployment.md)\>

***

### retrieve()

> **retrieve**(`deploymentID`, `params?`, `options?`): [`APIPromise`](../../index/classes/APIPromise.md)\<[`ManagedAgentsDeployment`](../interfaces/ManagedAgentsDeployment.md)\>

Get Deployment

#### Parameters

##### deploymentID

`string`

##### params?

[`DeploymentGetParams`](../interfaces/DeploymentGetParams.md) \| `null` \| `undefined`

##### options?

[`RequestOptions`](../../index/interfaces/RequestOptions.md)

#### Returns

[`APIPromise`](../../index/classes/APIPromise.md)\<[`ManagedAgentsDeployment`](../interfaces/ManagedAgentsDeployment.md)\>

***

### run()

> **run**(`deploymentID`, `params?`, `options?`): [`APIPromise`](../../index/classes/APIPromise.md)\<[`ManagedAgentsDeploymentRun`](../interfaces/ManagedAgentsDeploymentRun.md)\>

Run Deployment Now

#### Parameters

##### deploymentID

`string`

##### params?

[`DeploymentRunParams`](../interfaces/DeploymentRunParams.md) \| `null` \| `undefined`

##### options?

[`RequestOptions`](../../index/interfaces/RequestOptions.md)

#### Returns

[`APIPromise`](../../index/classes/APIPromise.md)\<[`ManagedAgentsDeploymentRun`](../interfaces/ManagedAgentsDeploymentRun.md)\>

***

### unpause()

> **unpause**(`deploymentID`, `params?`, `options?`): [`APIPromise`](../../index/classes/APIPromise.md)\<[`ManagedAgentsDeployment`](../interfaces/ManagedAgentsDeployment.md)\>

Unpause Deployment

#### Parameters

##### deploymentID

`string`

##### params?

[`DeploymentUnpauseParams`](../interfaces/DeploymentUnpauseParams.md) \| `null` \| `undefined`

##### options?

[`RequestOptions`](../../index/interfaces/RequestOptions.md)

#### Returns

[`APIPromise`](../../index/classes/APIPromise.md)\<[`ManagedAgentsDeployment`](../interfaces/ManagedAgentsDeployment.md)\>

***

### update()

> **update**(`deploymentID`, `params?`, `options?`): [`APIPromise`](../../index/classes/APIPromise.md)\<[`ManagedAgentsDeployment`](../interfaces/ManagedAgentsDeployment.md)\>

Update Deployment

#### Parameters

##### deploymentID

`string`

##### params?

[`DeploymentUpdateParams`](../interfaces/DeploymentUpdateParams.md) \| `null` \| `undefined`

##### options?

[`RequestOptions`](../../index/interfaces/RequestOptions.md)

#### Returns

[`APIPromise`](../../index/classes/APIPromise.md)\<[`ManagedAgentsDeployment`](../interfaces/ManagedAgentsDeployment.md)\>
