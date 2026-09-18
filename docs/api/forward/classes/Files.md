[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [forward](../README.md) / Files

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

> **delete**(`fileID`, `options?`): [`APIPromise`](../../index/classes/APIPromise.md)\<`void`\>

删除 File.

#### Parameters

##### fileID

`string`

##### options?

[`RequestOptions`](../../index/interfaces/RequestOptions.md)

#### Returns

[`APIPromise`](../../index/classes/APIPromise.md)\<`void`\>

#### Operation

deleteFile

***

### download()

> **download**(`fileID`, `options?`): [`APIPromise`](../../index/classes/APIPromise.md)\<`Response`\>

下载 File.

#### Parameters

##### fileID

`string`

##### options?

[`RequestOptions`](../../index/interfaces/RequestOptions.md)

#### Returns

[`APIPromise`](../../index/classes/APIPromise.md)\<`Response`\>

#### Operation

downloadFile

***

### getMetadata()

> **getMetadata**(`fileID`, `options?`): [`APIPromise`](../../index/classes/APIPromise.md)\<[`FileMetadata`](../interfaces/FileMetadata.md)\>

查询 File.

#### Parameters

##### fileID

`string`

##### options?

[`RequestOptions`](../../index/interfaces/RequestOptions.md)

#### Returns

[`APIPromise`](../../index/classes/APIPromise.md)\<[`FileMetadata`](../interfaces/FileMetadata.md)\>

#### Operation

getFile

***

### list()

> **list**(`params?`, `options?`): [`PagePromise`](../../index/classes/PagePromise.md)\<[`FileMetadata`](../interfaces/FileMetadata.md)\>

列出 File.

#### Parameters

##### params?

[`FileListParams`](../interfaces/FileListParams.md) = `{}`

##### options?

[`RequestOptions`](../../index/interfaces/RequestOptions.md)

#### Returns

[`PagePromise`](../../index/classes/PagePromise.md)\<[`FileMetadata`](../interfaces/FileMetadata.md)\>

#### Operation

listFile

***

### upload()

> **upload**(`params`, `options?`): [`APIPromise`](../../index/classes/APIPromise.md)\<[`FileMetadata`](../interfaces/FileMetadata.md)\>

上传 File.

#### Parameters

##### params

[`FileUploadParams`](../interfaces/FileUploadParams.md)

##### options?

[`RequestOptions`](../../index/interfaces/RequestOptions.md)

#### Returns

[`APIPromise`](../../index/classes/APIPromise.md)\<[`FileMetadata`](../interfaces/FileMetadata.md)\>

#### Operation

uploadFile
