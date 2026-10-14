[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [forward](../README.md) / Drives

# Class: Drives

Persistent Identity files (Beta). Identity SATs also require identity_id.

## Extends

- `APIResource`

## Constructors

### Constructor

> **new Drives**(`_client`): `Drives`

#### Parameters

##### \_client

[`APIClient`](../../index/classes/APIClient.md)

#### Returns

`Drives`

#### Inherited from

`APIResource.constructor`

## Properties

### \_client

> `protected` `readonly` **\_client**: [`APIClient`](../../index/classes/APIClient.md)

#### Inherited from

`APIResource._client`

## Methods

### clear()

> **clear**(`params`, `options?`): [`APIPromise`](../../index/classes/APIPromise.md)\<[`DriveClearResponse`](../interfaces/DriveClearResponse.md)\>

Clear the selected Identity Drive. All its files are deleted.

#### Parameters

##### params

[`DriveClearParams`](../interfaces/DriveClearParams.md)

##### options?

[`RequestOptions`](../../index/interfaces/RequestOptions.md)

#### Returns

[`APIPromise`](../../index/classes/APIPromise.md)\<[`DriveClearResponse`](../interfaces/DriveClearResponse.md)\>

***

### createDownloadUrl()

> **createDownloadUrl**(`params`, `options?`): [`APIPromise`](../../index/classes/APIPromise.md)\<[`DriveDownloadURL`](../interfaces/DriveDownloadURL.md)\>

Request a GET URL. Use a new Idempotency-Key or omit it to refresh expiry.

#### Parameters

##### params

[`DriveCreateDownloadURLParams`](../interfaces/DriveCreateDownloadURLParams.md)

##### options?

[`RequestOptions`](../../index/interfaces/RequestOptions.md)

#### Returns

[`APIPromise`](../../index/classes/APIPromise.md)\<[`DriveDownloadURL`](../interfaces/DriveDownloadURL.md)\>

***

### createUploadUrl()

> **createUploadUrl**(`params`, `options?`): [`APIPromise`](../../index/classes/APIPromise.md)\<[`DriveUploadURL`](../interfaces/DriveUploadURL.md)\>

Request a PUT URL. Only its returned headers belong on the storage request.
Replaying an Idempotency-Key does not renew the URL's expiry.

#### Parameters

##### params

[`DriveCreateUploadURLParams`](../interfaces/DriveCreateUploadURLParams.md)

##### options?

[`RequestOptions`](../../index/interfaces/RequestOptions.md)

#### Returns

[`APIPromise`](../../index/classes/APIPromise.md)\<[`DriveUploadURL`](../interfaces/DriveUploadURL.md)\>

***

### deleteEntry()

> **deleteEntry**(`params`, `options?`): [`APIPromise`](../../index/classes/APIPromise.md)\<[`DriveDeleteEntryResponse`](../interfaces/DriveDeleteEntryResponse.md)\>

Delete a file or directory. Nonempty directories require recursive: true.
Partial failures preserve error.deleted_count in the API error body.

#### Parameters

##### params

[`DriveDeleteEntryParams`](../interfaces/DriveDeleteEntryParams.md)

##### options?

[`RequestOptions`](../../index/interfaces/RequestOptions.md)

#### Returns

[`APIPromise`](../../index/classes/APIPromise.md)\<[`DriveDeleteEntryResponse`](../interfaces/DriveDeleteEntryResponse.md)\>

***

### listEntries()

> **listEntries**(`params`, `options?`): [`APIPromise`](../../index/classes/APIPromise.md)\<[`DriveListEntriesResponse`](../interfaces/DriveListEntriesResponse.md)\>

One page in service order. Pass next_page_token unchanged to page_token.

#### Parameters

##### params

[`DriveListEntriesParams`](../interfaces/DriveListEntriesParams.md)

##### options?

[`RequestOptions`](../../index/interfaces/RequestOptions.md)

#### Returns

[`APIPromise`](../../index/classes/APIPromise.md)\<[`DriveListEntriesResponse`](../interfaces/DriveListEntriesResponse.md)\>
