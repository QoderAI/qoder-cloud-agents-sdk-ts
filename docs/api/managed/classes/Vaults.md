[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [managed](../README.md) / Vaults

# Class: Vaults

## Extends

- `APIResource`

## Constructors

### Constructor

> **new Vaults**(`_client`): `Vaults`

#### Parameters

##### \_client

[`APIClient`](../../index/classes/APIClient.md)

#### Returns

`Vaults`

#### Inherited from

`APIResource.constructor`

## Properties

### \_client

> `protected` `readonly` **\_client**: [`APIClient`](../../index/classes/APIClient.md)

#### Inherited from

`APIResource._client`

***

### credentials

> `readonly` **credentials**: [`VaultsCredentials`](VaultsCredentials.md)

## Methods

### archive()

> **archive**(`vaultID`, `params?`, `options?`): [`APIPromise`](../../index/classes/APIPromise.md)\<[`ManagedAgentsVault`](../interfaces/ManagedAgentsVault.md)\>

Archive Vault

#### Parameters

##### vaultID

`string`

##### params?

[`VaultArchiveParams`](../interfaces/VaultArchiveParams.md) \| `null` \| `undefined`

##### options?

[`RequestOptions`](../../index/interfaces/RequestOptions.md)

#### Returns

[`APIPromise`](../../index/classes/APIPromise.md)\<[`ManagedAgentsVault`](../interfaces/ManagedAgentsVault.md)\>

***

### create()

> **create**(`params`, `options?`): [`APIPromise`](../../index/classes/APIPromise.md)\<[`ManagedAgentsVault`](../interfaces/ManagedAgentsVault.md)\>

Create Vault

#### Parameters

##### params

[`VaultNewParams`](../interfaces/VaultNewParams.md)

##### options?

[`RequestOptions`](../../index/interfaces/RequestOptions.md)

#### Returns

[`APIPromise`](../../index/classes/APIPromise.md)\<[`ManagedAgentsVault`](../interfaces/ManagedAgentsVault.md)\>

***

### delete()

> **delete**(`vaultID`, `params?`, `options?`): [`APIPromise`](../../index/classes/APIPromise.md)\<[`ManagedAgentsDeletedVault`](../interfaces/ManagedAgentsDeletedVault.md)\>

Delete Vault

#### Parameters

##### vaultID

`string`

##### params?

[`VaultDeleteParams`](../interfaces/VaultDeleteParams.md) \| `null` \| `undefined`

##### options?

[`RequestOptions`](../../index/interfaces/RequestOptions.md)

#### Returns

[`APIPromise`](../../index/classes/APIPromise.md)\<[`ManagedAgentsDeletedVault`](../interfaces/ManagedAgentsDeletedVault.md)\>

***

### list()

> **list**(`params?`, `options?`): [`PagePromise`](../../index/classes/PagePromise.md)\<[`ManagedAgentsVault`](../interfaces/ManagedAgentsVault.md)\>

List Vaults

#### Parameters

##### params?

[`VaultListParams`](../interfaces/VaultListParams.md) \| `null` \| `undefined`

##### options?

[`RequestOptions`](../../index/interfaces/RequestOptions.md)

#### Returns

[`PagePromise`](../../index/classes/PagePromise.md)\<[`ManagedAgentsVault`](../interfaces/ManagedAgentsVault.md)\>

***

### retrieve()

> **retrieve**(`vaultID`, `params?`, `options?`): [`APIPromise`](../../index/classes/APIPromise.md)\<[`ManagedAgentsVault`](../interfaces/ManagedAgentsVault.md)\>

Get Vault

#### Parameters

##### vaultID

`string`

##### params?

[`VaultGetParams`](../interfaces/VaultGetParams.md) \| `null` \| `undefined`

##### options?

[`RequestOptions`](../../index/interfaces/RequestOptions.md)

#### Returns

[`APIPromise`](../../index/classes/APIPromise.md)\<[`ManagedAgentsVault`](../interfaces/ManagedAgentsVault.md)\>
