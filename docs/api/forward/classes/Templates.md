[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [forward](../README.md) / Templates

# Class: Templates

## Extends

- `APIResource`

## Constructors

### Constructor

> **new Templates**(`_client`): `Templates`

#### Parameters

##### \_client

[`APIClient`](../../index/classes/APIClient.md)

#### Returns

`Templates`

#### Inherited from

`APIResource.constructor`

## Properties

### \_client

> `protected` `readonly` **\_client**: [`APIClient`](../../index/classes/APIClient.md)

#### Inherited from

`APIResource._client`

## Methods

### archive()

> **archive**(`templateID`, `params?`, `options?`): [`APIPromise`](../../index/classes/APIPromise.md)\<[`Template`](../interfaces/Template.md)\>

归档 Template.

#### Parameters

##### templateID

`string`

##### params?

[`TemplateArchiveParams`](../interfaces/TemplateArchiveParams.md) = `{}`

##### options?

[`RequestOptions`](../../index/interfaces/RequestOptions.md)

#### Returns

[`APIPromise`](../../index/classes/APIPromise.md)\<[`Template`](../interfaces/Template.md)\>

#### Operation

archiveTemplate

***

### clone()

> **clone**(`templateID`, `params?`, `options?`): [`APIPromise`](../../index/classes/APIPromise.md)\<[`Template`](../interfaces/Template.md)\>

克隆 Template.

#### Parameters

##### templateID

`string`

##### params?

[`TemplateCloneParams`](../interfaces/TemplateCloneParams.md) = `{}`

##### options?

[`RequestOptions`](../../index/interfaces/RequestOptions.md)

#### Returns

[`APIPromise`](../../index/classes/APIPromise.md)\<[`Template`](../interfaces/Template.md)\>

#### Operation

cloneTemplate

***

### create()

> **create**(`params`, `options?`): [`APIPromise`](../../index/classes/APIPromise.md)\<[`Template`](../interfaces/Template.md)\>

创建 Template.

#### Parameters

##### params

[`TemplateNewParams`](../interfaces/TemplateNewParams.md)

##### options?

[`RequestOptions`](../../index/interfaces/RequestOptions.md)

#### Returns

[`APIPromise`](../../index/classes/APIPromise.md)\<[`Template`](../interfaces/Template.md)\>

#### Operation

createTemplate

***

### list()

> **list**(`params?`, `options?`): [`PagePromise`](../../index/classes/PagePromise.md)\<[`Template`](../interfaces/Template.md)\>

列出 Templates.

#### Parameters

##### params?

[`TemplateListParams`](../interfaces/TemplateListParams.md) = `{}`

##### options?

[`RequestOptions`](../../index/interfaces/RequestOptions.md)

#### Returns

[`PagePromise`](../../index/classes/PagePromise.md)\<[`Template`](../interfaces/Template.md)\>

#### Operation

listTemplates

***

### retrieve()

> **retrieve**(`templateID`, `options?`): [`APIPromise`](../../index/classes/APIPromise.md)\<[`Template`](../interfaces/Template.md)\>

获取 Template.

#### Parameters

##### templateID

`string`

##### options?

[`RequestOptions`](../../index/interfaces/RequestOptions.md)

#### Returns

[`APIPromise`](../../index/classes/APIPromise.md)\<[`Template`](../interfaces/Template.md)\>

#### Operation

getTemplate

***

### update()

> **update**(`templateID`, `params?`, `options?`): [`APIPromise`](../../index/classes/APIPromise.md)\<[`Template`](../interfaces/Template.md)\>

更新 Template.

#### Parameters

##### templateID

`string`

##### params?

[`TemplateUpdateParams`](../interfaces/TemplateUpdateParams.md) = `{}`

##### options?

[`RequestOptions`](../../index/interfaces/RequestOptions.md)

#### Returns

[`APIPromise`](../../index/classes/APIPromise.md)\<[`Template`](../interfaces/Template.md)\>

#### Operation

updateTemplate
