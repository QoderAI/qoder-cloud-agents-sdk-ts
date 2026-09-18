[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [forward](../README.md) / VaultCredentials

# Class: VaultCredentials

## Extends

- `APIResource`

## Constructors

### Constructor

> **new VaultCredentials**(`_client`): `VaultCredentials`

#### Parameters

##### \_client

[`APIClient`](../../index/classes/APIClient.md)

#### Returns

`VaultCredentials`

#### Inherited from

`APIResource.constructor`

## Properties

### \_client

> `protected` `readonly` **\_client**: [`APIClient`](../../index/classes/APIClient.md)

#### Inherited from

`APIResource._client`

## Methods

### create()

> **create**(`id`, `params`, `options?`): [`APIPromise`](../../index/classes/APIPromise.md)\<[`VaultCredential`](../interfaces/VaultCredential.md)\>

创建 Credential.

#### Parameters

##### id

`string`

##### params

[`VaultCredentialNewParams`](../interfaces/VaultCredentialNewParams.md)

##### options?

[`RequestOptions`](../../index/interfaces/RequestOptions.md)

#### Returns

[`APIPromise`](../../index/classes/APIPromise.md)\<[`VaultCredential`](../interfaces/VaultCredential.md)\>

#### Operation

createVaultCredential

***

### delete()

> **delete**(`id`, `credID`, `options?`): [`APIPromise`](../../index/classes/APIPromise.md)\<`void`\>

删除 Credential.

#### Parameters

##### id

`string`

##### credID

`string`

##### options?

[`RequestOptions`](../../index/interfaces/RequestOptions.md)

#### Returns

[`APIPromise`](../../index/classes/APIPromise.md)\<`void`\>

#### Operation

deleteVaultCredential

***

### list()

> **list**(`id`, `params?`, `options?`): [`PagePromise`](../../index/classes/PagePromise.md)\<[`VaultCredential`](../interfaces/VaultCredential.md)\>

列出 Credential.

#### Parameters

##### id

`string`

##### params?

[`VaultCredentialListParams`](../interfaces/VaultCredentialListParams.md) = `{}`

##### options?

[`RequestOptions`](../../index/interfaces/RequestOptions.md)

#### Returns

[`PagePromise`](../../index/classes/PagePromise.md)\<[`VaultCredential`](../interfaces/VaultCredential.md)\>

#### Operation

listVaultCredential

***

### retrieve()

> **retrieve**(`id`, `credID`, `options?`): [`APIPromise`](../../index/classes/APIPromise.md)\<[`VaultCredential`](../interfaces/VaultCredential.md)\>

查询 Credential.

#### Parameters

##### id

`string`

##### credID

`string`

##### options?

[`RequestOptions`](../../index/interfaces/RequestOptions.md)

#### Returns

[`APIPromise`](../../index/classes/APIPromise.md)\<[`VaultCredential`](../interfaces/VaultCredential.md)\>

#### Operation

getVaultCredential
