[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [managed](../README.md) / VaultsCredentials

# Class: VaultsCredentials

## Extends

- `APIResource`

## Constructors

### Constructor

> **new VaultsCredentials**(`_client`): `VaultsCredentials`

#### Parameters

##### \_client

[`APIClient`](../../index/classes/APIClient.md)

#### Returns

`VaultsCredentials`

#### Inherited from

`APIResource.constructor`

## Properties

### \_client

> `protected` `readonly` **\_client**: [`APIClient`](../../index/classes/APIClient.md)

#### Inherited from

`APIResource._client`

## Methods

### archive()

> **archive**(`credentialID`, `params`, `options?`): [`APIPromise`](../../index/classes/APIPromise.md)\<[`ManagedAgentsCredential`](../interfaces/ManagedAgentsCredential.md)\>

Archive Credential

#### Parameters

##### credentialID

`string`

##### params

[`VaultCredentialArchiveParams`](../interfaces/VaultCredentialArchiveParams.md)

##### options?

[`RequestOptions`](../../index/interfaces/RequestOptions.md)

#### Returns

[`APIPromise`](../../index/classes/APIPromise.md)\<[`ManagedAgentsCredential`](../interfaces/ManagedAgentsCredential.md)\>

***

### create()

> **create**(`vaultID`, `params`, `options?`): [`APIPromise`](../../index/classes/APIPromise.md)\<[`ManagedAgentsCredential`](../interfaces/ManagedAgentsCredential.md)\>

Create Credential

#### Parameters

##### vaultID

`string`

##### params

[`VaultCredentialNewParams`](../interfaces/VaultCredentialNewParams.md)

##### options?

[`RequestOptions`](../../index/interfaces/RequestOptions.md)

#### Returns

[`APIPromise`](../../index/classes/APIPromise.md)\<[`ManagedAgentsCredential`](../interfaces/ManagedAgentsCredential.md)\>

***

### delete()

> **delete**(`credentialID`, `params`, `options?`): [`APIPromise`](../../index/classes/APIPromise.md)\<[`ManagedAgentsDeletedCredential`](../interfaces/ManagedAgentsDeletedCredential.md)\>

Delete Credential

#### Parameters

##### credentialID

`string`

##### params

[`VaultCredentialDeleteParams`](../interfaces/VaultCredentialDeleteParams.md)

##### options?

[`RequestOptions`](../../index/interfaces/RequestOptions.md)

#### Returns

[`APIPromise`](../../index/classes/APIPromise.md)\<[`ManagedAgentsDeletedCredential`](../interfaces/ManagedAgentsDeletedCredential.md)\>

***

### list()

> **list**(`vaultID`, `params?`, `options?`): [`PagePromise`](../../index/classes/PagePromise.md)\<[`ManagedAgentsCredential`](../interfaces/ManagedAgentsCredential.md)\>

List Credentials

#### Parameters

##### vaultID

`string`

##### params?

[`VaultCredentialListParams`](../interfaces/VaultCredentialListParams.md) \| `null` \| `undefined`

##### options?

[`RequestOptions`](../../index/interfaces/RequestOptions.md)

#### Returns

[`PagePromise`](../../index/classes/PagePromise.md)\<[`ManagedAgentsCredential`](../interfaces/ManagedAgentsCredential.md)\>

***

### mcpOAuthValidate()

> **mcpOAuthValidate**(`credentialID`, `params`, `options?`): [`APIPromise`](../../index/classes/APIPromise.md)\<[`ManagedAgentsCredentialValidation`](../interfaces/ManagedAgentsCredentialValidation.md)\>

Validate Credential

#### Parameters

##### credentialID

`string`

##### params

[`VaultCredentialMCPOAuthValidateParams`](../interfaces/VaultCredentialMCPOAuthValidateParams.md)

##### options?

[`RequestOptions`](../../index/interfaces/RequestOptions.md)

#### Returns

[`APIPromise`](../../index/classes/APIPromise.md)\<[`ManagedAgentsCredentialValidation`](../interfaces/ManagedAgentsCredentialValidation.md)\>

***

### retrieve()

> **retrieve**(`credentialID`, `params`, `options?`): [`APIPromise`](../../index/classes/APIPromise.md)\<[`ManagedAgentsCredential`](../interfaces/ManagedAgentsCredential.md)\>

Get Credential

#### Parameters

##### credentialID

`string`

##### params

[`VaultCredentialGetParams`](../interfaces/VaultCredentialGetParams.md)

##### options?

[`RequestOptions`](../../index/interfaces/RequestOptions.md)

#### Returns

[`APIPromise`](../../index/classes/APIPromise.md)\<[`ManagedAgentsCredential`](../interfaces/ManagedAgentsCredential.md)\>

***

### update()

> **update**(`credentialID`, `params`, `options?`): [`APIPromise`](../../index/classes/APIPromise.md)\<[`ManagedAgentsCredential`](../interfaces/ManagedAgentsCredential.md)\>

Update Credential

#### Parameters

##### credentialID

`string`

##### params

[`VaultCredentialUpdateParams`](../interfaces/VaultCredentialUpdateParams.md)

##### options?

[`RequestOptions`](../../index/interfaces/RequestOptions.md)

#### Returns

[`APIPromise`](../../index/classes/APIPromise.md)\<[`ManagedAgentsCredential`](../interfaces/ManagedAgentsCredential.md)\>
