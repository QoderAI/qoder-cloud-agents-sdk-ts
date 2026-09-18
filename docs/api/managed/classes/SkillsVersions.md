[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [managed](../README.md) / SkillsVersions

# Class: SkillsVersions

## Extends

- `APIResource`

## Constructors

### Constructor

> **new SkillsVersions**(`_client`): `SkillsVersions`

#### Parameters

##### \_client

[`APIClient`](../../index/classes/APIClient.md)

#### Returns

`SkillsVersions`

#### Inherited from

`APIResource.constructor`

## Properties

### \_client

> `protected` `readonly` **\_client**: [`APIClient`](../../index/classes/APIClient.md)

#### Inherited from

`APIResource._client`

## Methods

### create()

> **create**(`skillID`, `params`, `options?`): [`APIPromise`](../../index/classes/APIPromise.md)\<[`SkillVersion`](../interfaces/SkillVersion.md)\>

Create Skill Version

#### Parameters

##### skillID

`string`

##### params

[`SkillVersionNewParams`](../interfaces/SkillVersionNewParams.md)

##### options?

[`RequestOptions`](../../index/interfaces/RequestOptions.md)

#### Returns

[`APIPromise`](../../index/classes/APIPromise.md)\<[`SkillVersion`](../interfaces/SkillVersion.md)\>

***

### delete()

> **delete**(`version`, `params`, `options?`): [`APIPromise`](../../index/classes/APIPromise.md)\<[`DeletedSkillVersion`](../interfaces/DeletedSkillVersion.md)\>

Delete Skill Version

#### Parameters

##### version

`string`

##### params

[`SkillVersionDeleteParams`](../interfaces/SkillVersionDeleteParams.md)

##### options?

[`RequestOptions`](../../index/interfaces/RequestOptions.md)

#### Returns

[`APIPromise`](../../index/classes/APIPromise.md)\<[`DeletedSkillVersion`](../interfaces/DeletedSkillVersion.md)\>

***

### download()

> **download**(`version`, `params`, `options?`): [`APIPromise`](../../index/classes/APIPromise.md)\<`Response`\>

Download a skill version's content as a zip archive.

#### Parameters

##### version

`string`

##### params

[`SkillVersionDownloadParams`](../interfaces/SkillVersionDownloadParams.md)

##### options?

[`RequestOptions`](../../index/interfaces/RequestOptions.md)

#### Returns

[`APIPromise`](../../index/classes/APIPromise.md)\<`Response`\>

***

### list()

> **list**(`skillID`, `params?`, `options?`): [`PagePromise`](../../index/classes/PagePromise.md)\<[`SkillVersion`](../interfaces/SkillVersion.md)\>

List Skill Versions

#### Parameters

##### skillID

`string`

##### params?

[`SkillVersionListParams`](../interfaces/SkillVersionListParams.md) \| `null` \| `undefined`

##### options?

[`RequestOptions`](../../index/interfaces/RequestOptions.md)

#### Returns

[`PagePromise`](../../index/classes/PagePromise.md)\<[`SkillVersion`](../interfaces/SkillVersion.md)\>

***

### retrieve()

> **retrieve**(`version`, `params`, `options?`): [`APIPromise`](../../index/classes/APIPromise.md)\<[`SkillVersion`](../interfaces/SkillVersion.md)\>

Get Skill Version

#### Parameters

##### version

`string`

##### params

[`SkillVersionGetParams`](../interfaces/SkillVersionGetParams.md)

##### options?

[`RequestOptions`](../../index/interfaces/RequestOptions.md)

#### Returns

[`APIPromise`](../../index/classes/APIPromise.md)\<[`SkillVersion`](../interfaces/SkillVersion.md)\>
