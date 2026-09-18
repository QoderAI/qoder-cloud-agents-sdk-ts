[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [managed](../README.md) / Environments

# Class: Environments

## Extends

- `APIResource`

## Constructors

### Constructor

> **new Environments**(`_client`): `Environments`

#### Parameters

##### \_client

[`APIClient`](../../index/classes/APIClient.md)

#### Returns

`Environments`

#### Inherited from

`APIResource.constructor`

## Properties

### \_client

> `protected` `readonly` **\_client**: [`APIClient`](../../index/classes/APIClient.md)

#### Inherited from

`APIResource._client`

***

### work

> `readonly` **work**: [`EnvironmentsWork`](EnvironmentsWork.md)

## Methods

### archive()

> **archive**(`environmentID`, `params?`, `options?`): [`APIPromise`](../../index/classes/APIPromise.md)\<[`Environment`](../interfaces/Environment.md)\>

Archive an environment by ID. Archived environments cannot be used to create new
sessions.

#### Parameters

##### environmentID

`string`

##### params?

[`EnvironmentArchiveParams`](../interfaces/EnvironmentArchiveParams.md) \| `null` \| `undefined`

##### options?

[`RequestOptions`](../../index/interfaces/RequestOptions.md)

#### Returns

[`APIPromise`](../../index/classes/APIPromise.md)\<[`Environment`](../interfaces/Environment.md)\>

***

### create()

> **create**(`params`, `options?`): [`APIPromise`](../../index/classes/APIPromise.md)\<[`Environment`](../interfaces/Environment.md)\>

Create a new environment with the specified configuration.

#### Parameters

##### params

[`EnvironmentNewParams`](../interfaces/EnvironmentNewParams.md)

##### options?

[`RequestOptions`](../../index/interfaces/RequestOptions.md)

#### Returns

[`APIPromise`](../../index/classes/APIPromise.md)\<[`Environment`](../interfaces/Environment.md)\>

***

### delete()

> **delete**(`environmentID`, `params?`, `options?`): [`APIPromise`](../../index/classes/APIPromise.md)\<[`EnvironmentDeleteResponse`](../interfaces/EnvironmentDeleteResponse.md)\>

Delete an environment by ID. Returns a confirmation of the deletion.

#### Parameters

##### environmentID

`string`

##### params?

[`EnvironmentDeleteParams`](../interfaces/EnvironmentDeleteParams.md) \| `null` \| `undefined`

##### options?

[`RequestOptions`](../../index/interfaces/RequestOptions.md)

#### Returns

[`APIPromise`](../../index/classes/APIPromise.md)\<[`EnvironmentDeleteResponse`](../interfaces/EnvironmentDeleteResponse.md)\>

***

### list()

> **list**(`params?`, `options?`): [`PagePromise`](../../index/classes/PagePromise.md)\<[`Environment`](../interfaces/Environment.md)\>

List environments with pagination support.

#### Parameters

##### params?

[`EnvironmentListParams`](../interfaces/EnvironmentListParams.md) \| `null` \| `undefined`

##### options?

[`RequestOptions`](../../index/interfaces/RequestOptions.md)

#### Returns

[`PagePromise`](../../index/classes/PagePromise.md)\<[`Environment`](../interfaces/Environment.md)\>

***

### retrieve()

> **retrieve**(`environmentID`, `params?`, `options?`): [`APIPromise`](../../index/classes/APIPromise.md)\<[`Environment`](../interfaces/Environment.md)\>

Retrieve a specific environment by ID.

#### Parameters

##### environmentID

`string`

##### params?

[`EnvironmentGetParams`](../interfaces/EnvironmentGetParams.md) \| `null` \| `undefined`

##### options?

[`RequestOptions`](../../index/interfaces/RequestOptions.md)

#### Returns

[`APIPromise`](../../index/classes/APIPromise.md)\<[`Environment`](../interfaces/Environment.md)\>

***

### update()

> **update**(`environmentID`, `params?`, `options?`): [`APIPromise`](../../index/classes/APIPromise.md)\<[`Environment`](../interfaces/Environment.md)\>

Update an existing environment's configuration.

#### Parameters

##### environmentID

`string`

##### params?

[`EnvironmentUpdateParams`](../interfaces/EnvironmentUpdateParams.md) \| `null` \| `undefined`

##### options?

[`RequestOptions`](../../index/interfaces/RequestOptions.md)

#### Returns

[`APIPromise`](../../index/classes/APIPromise.md)\<[`Environment`](../interfaces/Environment.md)\>
