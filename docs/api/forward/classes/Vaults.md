[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [forward](../README.md) / Vaults

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

> `readonly` **credentials**: [`VaultCredentials`](VaultCredentials.md)

## Methods

### create()

> **create**(`params`, `options?`): [`APIPromise`](../../index/classes/APIPromise.md)\<[`Vault`](../interfaces/Vault.md)\>

创建 Vault.

#### Parameters

##### params

[`VaultNewParams`](../interfaces/VaultNewParams.md)

##### options?

[`RequestOptions`](../../index/interfaces/RequestOptions.md)

#### Returns

[`APIPromise`](../../index/classes/APIPromise.md)\<[`Vault`](../interfaces/Vault.md)\>

#### Operation

createVault

***

### delete()

> **delete**(`id`, `options?`): [`APIPromise`](../../index/classes/APIPromise.md)\<`void`\>

删除 Vault.

#### Parameters

##### id

`string`

##### options?

[`RequestOptions`](../../index/interfaces/RequestOptions.md)

#### Returns

[`APIPromise`](../../index/classes/APIPromise.md)\<`void`\>

#### Operation

deleteVault

***

### list()

> **list**(`params?`, `options?`): [`PagePromise`](../../index/classes/PagePromise.md)\<[`Vault`](../interfaces/Vault.md)\>

列出 Vault.

#### Parameters

##### params?

[`VaultListParams`](../interfaces/VaultListParams.md) = `{}`

##### options?

[`RequestOptions`](../../index/interfaces/RequestOptions.md)

#### Returns

[`PagePromise`](../../index/classes/PagePromise.md)\<[`Vault`](../interfaces/Vault.md)\>

#### Operation

listVault

***

### retrieve()

> **retrieve**(`id`, `options?`): [`APIPromise`](../../index/classes/APIPromise.md)\<[`Vault`](../interfaces/Vault.md)\>

查询 Vault.

#### Parameters

##### id

`string`

##### options?

[`RequestOptions`](../../index/interfaces/RequestOptions.md)

#### Returns

[`APIPromise`](../../index/classes/APIPromise.md)\<[`Vault`](../interfaces/Vault.md)\>

#### Operation

getVault
