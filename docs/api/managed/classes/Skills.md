[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [managed](../README.md) / Skills

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

> `readonly` **versions**: [`SkillsVersions`](SkillsVersions.md)

## Methods

### create()

> **create**(`params`, `options?`): [`APIPromise`](../../index/classes/APIPromise.md)\<[`Skill`](../interfaces/Skill.md)\>

Create Skill

#### Parameters

##### params

[`SkillNewParams`](../interfaces/SkillNewParams.md)

##### options?

[`RequestOptions`](../../index/interfaces/RequestOptions.md)

#### Returns

[`APIPromise`](../../index/classes/APIPromise.md)\<[`Skill`](../interfaces/Skill.md)\>

***

### delete()

> **delete**(`skillID`, `params?`, `options?`): [`APIPromise`](../../index/classes/APIPromise.md)\<[`DeletedSkill`](../interfaces/DeletedSkill.md)\>

Delete Skill

#### Parameters

##### skillID

`string`

##### params?

[`SkillDeleteParams`](../interfaces/SkillDeleteParams.md) \| `null` \| `undefined`

##### options?

[`RequestOptions`](../../index/interfaces/RequestOptions.md)

#### Returns

[`APIPromise`](../../index/classes/APIPromise.md)\<[`DeletedSkill`](../interfaces/DeletedSkill.md)\>

***

### list()

> **list**(`params?`, `options?`): [`PagePromise`](../../index/classes/PagePromise.md)\<[`Skill`](../interfaces/Skill.md)\>

List Skills

#### Parameters

##### params?

[`SkillListParams`](../interfaces/SkillListParams.md) \| `null` \| `undefined`

##### options?

[`RequestOptions`](../../index/interfaces/RequestOptions.md)

#### Returns

[`PagePromise`](../../index/classes/PagePromise.md)\<[`Skill`](../interfaces/Skill.md)\>

***

### retrieve()

> **retrieve**(`skillID`, `params?`, `options?`): [`APIPromise`](../../index/classes/APIPromise.md)\<[`Skill`](../interfaces/Skill.md)\>

Get Skill

#### Parameters

##### skillID

`string`

##### params?

[`SkillGetParams`](../interfaces/SkillGetParams.md) \| `null` \| `undefined`

##### options?

[`RequestOptions`](../../index/interfaces/RequestOptions.md)

#### Returns

[`APIPromise`](../../index/classes/APIPromise.md)\<[`Skill`](../interfaces/Skill.md)\>
