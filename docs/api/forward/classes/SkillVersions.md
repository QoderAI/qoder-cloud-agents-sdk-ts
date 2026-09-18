[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [forward](../README.md) / SkillVersions

# Class: SkillVersions

## Extends

- `APIResource`

## Constructors

### Constructor

> **new SkillVersions**(`_client`): `SkillVersions`

#### Parameters

##### \_client

[`APIClient`](../../index/classes/APIClient.md)

#### Returns

`SkillVersions`

#### Inherited from

`APIResource.constructor`

## Properties

### \_client

> `protected` `readonly` **\_client**: [`APIClient`](../../index/classes/APIClient.md)

#### Inherited from

`APIResource._client`

## Methods

### create()

> **create**(`id`, `params`, `options?`): [`APIPromise`](../../index/classes/APIPromise.md)\<[`SkillVersion`](../interfaces/SkillVersion.md)\>

创建 Skill 版本.

#### Parameters

##### id

`string`

##### params

[`SkillVersionNewParams`](../interfaces/SkillVersionNewParams.md)

##### options?

[`RequestOptions`](../../index/interfaces/RequestOptions.md)

#### Returns

[`APIPromise`](../../index/classes/APIPromise.md)\<[`SkillVersion`](../interfaces/SkillVersion.md)\>

#### Operation

createSkillVersion

***

### delete()

> **delete**(`id`, `version`, `options?`): [`APIPromise`](../../index/classes/APIPromise.md)\<[`DeletedSkillVersion`](../interfaces/DeletedSkillVersion.md)\>

删除 Skill 版本.

#### Parameters

##### id

`string`

##### version

`string`

##### options?

[`RequestOptions`](../../index/interfaces/RequestOptions.md)

#### Returns

[`APIPromise`](../../index/classes/APIPromise.md)\<[`DeletedSkillVersion`](../interfaces/DeletedSkillVersion.md)\>

#### Operation

deleteSkillVersion

***

### download()

> **download**(`id`, `version`, `options?`): [`APIPromise`](../../index/classes/APIPromise.md)\<`Response`\>

下载 Skill 版本内容.

#### Parameters

##### id

`string`

##### version

`string`

##### options?

[`RequestOptions`](../../index/interfaces/RequestOptions.md)

#### Returns

[`APIPromise`](../../index/classes/APIPromise.md)\<`Response`\>

#### Operation

downloadSkillVersion

***

### list()

> **list**(`id`, `params?`, `options?`): [`PagePromise`](../../index/classes/PagePromise.md)\<[`SkillVersion`](../interfaces/SkillVersion.md)\>

列出 Skill 版本.

#### Parameters

##### id

`string`

##### params?

[`SkillVersionListParams`](../interfaces/SkillVersionListParams.md) = `{}`

##### options?

[`RequestOptions`](../../index/interfaces/RequestOptions.md)

#### Returns

[`PagePromise`](../../index/classes/PagePromise.md)\<[`SkillVersion`](../interfaces/SkillVersion.md)\>

#### Operation

listSkillVersion

***

### retrieve()

> **retrieve**(`id`, `version`, `options?`): [`APIPromise`](../../index/classes/APIPromise.md)\<[`SkillVersion`](../interfaces/SkillVersion.md)\>

查询 Skill 版本.

#### Parameters

##### id

`string`

##### version

`string`

##### options?

[`RequestOptions`](../../index/interfaces/RequestOptions.md)

#### Returns

[`APIPromise`](../../index/classes/APIPromise.md)\<[`SkillVersion`](../interfaces/SkillVersion.md)\>

#### Operation

getSkillVersion
