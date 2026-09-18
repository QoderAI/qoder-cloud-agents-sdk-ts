[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [forward](../README.md) / Skills

# Class: Skills

## Extends

- `APIResource`

## Constructors

### Constructor

> **new Skills**(`_client`): `Skills`

#### Parameters

##### \_client

[`APIClient`](../../index/classes/APIClient.md)

#### Returns

`Skills`

#### Inherited from

`APIResource.constructor`

## Properties

### \_client

> `protected` `readonly` **\_client**: [`APIClient`](../../index/classes/APIClient.md)

#### Inherited from

`APIResource._client`

***

### versions

> `readonly` **versions**: [`SkillVersions`](SkillVersions.md)

## Methods

### create()

> **create**(`params?`, `options?`): [`APIPromise`](../../index/classes/APIPromise.md)\<[`Skill`](../interfaces/Skill.md)\>

创建 Skill.

#### Parameters

##### params?

[`SkillNewParams`](../interfaces/SkillNewParams.md) = `{}`

##### options?

[`RequestOptions`](../../index/interfaces/RequestOptions.md)

#### Returns

[`APIPromise`](../../index/classes/APIPromise.md)\<[`Skill`](../interfaces/Skill.md)\>

#### Operation

createSkill

***

### delete()

> **delete**(`id`, `options?`): [`APIPromise`](../../index/classes/APIPromise.md)\<`void`\>

删除 Skill.

#### Parameters

##### id

`string`

##### options?

[`RequestOptions`](../../index/interfaces/RequestOptions.md)

#### Returns

[`APIPromise`](../../index/classes/APIPromise.md)\<`void`\>

#### Operation

deleteSkill

***

### list()

> **list**(`params?`, `options?`): [`PagePromise`](../../index/classes/PagePromise.md)\<[`Skill`](../interfaces/Skill.md)\>

列出 Skill.

#### Parameters

##### params?

[`SkillListParams`](../interfaces/SkillListParams.md) = `{}`

##### options?

[`RequestOptions`](../../index/interfaces/RequestOptions.md)

#### Returns

[`PagePromise`](../../index/classes/PagePromise.md)\<[`Skill`](../interfaces/Skill.md)\>

#### Operation

listSkill

***

### retrieve()

> **retrieve**(`id`, `params?`, `options?`): [`APIPromise`](../../index/classes/APIPromise.md)\<[`Skill`](../interfaces/Skill.md)\>

查询 Skill.

#### Parameters

##### id

`string`

##### params?

[`SkillGetParams`](../interfaces/SkillGetParams.md) = `{}`

##### options?

[`RequestOptions`](../../index/interfaces/RequestOptions.md)

#### Returns

[`APIPromise`](../../index/classes/APIPromise.md)\<[`Skill`](../interfaces/Skill.md)\>

#### Operation

getSkill

***

### update()

> **update**(`id`, `params?`, `options?`): [`APIPromise`](../../index/classes/APIPromise.md)\<[`Skill`](../interfaces/Skill.md)\>

修改 Skill.

#### Parameters

##### id

`string`

##### params?

[`SkillUpdateParams`](../interfaces/SkillUpdateParams.md) = `{}`

##### options?

[`RequestOptions`](../../index/interfaces/RequestOptions.md)

#### Returns

[`APIPromise`](../../index/classes/APIPromise.md)\<[`Skill`](../interfaces/Skill.md)\>

#### Operation

updateSkill
