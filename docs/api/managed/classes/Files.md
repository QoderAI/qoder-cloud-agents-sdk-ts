[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [managed](../README.md) / Files

# Class: Files

## Extends

- `APIResource`

## Constructors

### Constructor

> **new Files**(`_client`): `Files`

#### Parameters

##### \_client

[`APIClient`](../../index/classes/APIClient.md)

#### Returns

`Files`

#### Inherited from

`APIResource.constructor`

## Properties

### \_client

> `protected` `readonly` **\_client**: [`APIClient`](../../index/classes/APIClient.md)

#### Inherited from

`APIResource._client`

## Methods

### delete()

> **delete**(`fileID`, `params?`, `options?`): [`APIPromise`](../../index/classes/APIPromise.md)\<[`DeletedFile`](../interfaces/DeletedFile.md)\>

Delete File

#### Parameters

##### fileID

`string`

##### params?

[`FileDeleteParams`](../interfaces/FileDeleteParams.md) \| `null` \| `undefined`

##### options?

[`RequestOptions`](../../index/interfaces/RequestOptions.md)

#### Returns

[`APIPromise`](../../index/classes/APIPromise.md)\<[`DeletedFile`](../interfaces/DeletedFile.md)\>

***

### download()

> **download**(`fileID`, `params?`, `options?`): [`APIPromise`](../../index/classes/APIPromise.md)\<`Response`\>

Download File

#### Parameters

##### fileID

`string`

##### params?

[`FileDownloadParams`](../interfaces/FileDownloadParams.md) \| `null` \| `undefined`

##### options?

[`RequestOptions`](../../index/interfaces/RequestOptions.md)

#### Returns

[`APIPromise`](../../index/classes/APIPromise.md)\<`Response`\>

***

### getMetadata()

> **getMetadata**(`fileID`, `params?`, `options?`): [`APIPromise`](../../index/classes/APIPromise.md)\<[`FileMetadata`](../interfaces/FileMetadata.md)\>

Get File Metadata

#### Parameters

##### fileID

`string`

##### params?

[`FileGetMetadataParams`](../interfaces/FileGetMetadataParams.md) \| `null` \| `undefined`

##### options?

[`RequestOptions`](../../index/interfaces/RequestOptions.md)

#### Returns

[`APIPromise`](../../index/classes/APIPromise.md)\<[`FileMetadata`](../interfaces/FileMetadata.md)\>

***

### list()

> **list**(`params?`, `options?`): [`PagePromise`](../../index/classes/PagePromise.md)\<[`FileMetadata`](../interfaces/FileMetadata.md)\>

List Files

#### Parameters

##### params?

[`FileListParams`](../interfaces/FileListParams.md) \| `null` \| `undefined`

##### options?

[`RequestOptions`](../../index/interfaces/RequestOptions.md)

#### Returns

[`PagePromise`](../../index/classes/PagePromise.md)\<[`FileMetadata`](../interfaces/FileMetadata.md)\>

***

### upload()

> **upload**(`params`, `options?`): [`APIPromise`](../../index/classes/APIPromise.md)\<[`FileMetadata`](../interfaces/FileMetadata.md)\>

Upload File

#### Parameters

##### params

[`FileUploadParams`](../interfaces/FileUploadParams.md)

##### options?

[`RequestOptions`](../../index/interfaces/RequestOptions.md)

#### Returns

[`APIPromise`](../../index/classes/APIPromise.md)\<[`FileMetadata`](../interfaces/FileMetadata.md)\>
