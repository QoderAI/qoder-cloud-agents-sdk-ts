[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [forward](../README.md) / Environments

# Class: Environments

## Extends

- `APIResource`

## Constructors

### Constructor

> **new Environments**(`_client`): `Environments`

#### Parameters

##### \_client

[`APIClient`](../../index/classes/APIClient.md)

#### Returns

`Environments`

#### Inherited from

`APIResource.constructor`

## Properties

### \_client

> `protected` `readonly` **\_client**: [`APIClient`](../../index/classes/APIClient.md)

#### Inherited from

`APIResource._client`

## Methods

### archive()

> **archive**(`id`, `options?`): [`APIPromise`](../../index/classes/APIPromise.md)\<[`Environment`](../interfaces/Environment.md)\>

Archive an environment retained by historical sessions or tool calls.

#### Parameters

##### id

`string`

##### options?

[`RequestOptions`](../../index/interfaces/RequestOptions.md)

#### Returns

[`APIPromise`](../../index/classes/APIPromise.md)\<[`Environment`](../interfaces/Environment.md)\>

#### Operation

archiveEnvironment

***

### create()

> **create**(`params`, `options?`): [`APIPromise`](../../index/classes/APIPromise.md)\<[`Environment`](../interfaces/Environment.md)\>

创建 Environment.

#### Parameters

##### params

[`EnvironmentNewParams`](../interfaces/EnvironmentNewParams.md)

##### options?

[`RequestOptions`](../../index/interfaces/RequestOptions.md)

#### Returns

[`APIPromise`](../../index/classes/APIPromise.md)\<[`Environment`](../interfaces/Environment.md)\>

#### Operation

createEnvironment

***

### delete()

> **delete**(`id`, `options?`): [`APIPromise`](../../index/classes/APIPromise.md)\<`void`\>

删除 Environment.

#### Parameters

##### id

`string`

##### options?

[`RequestOptions`](../../index/interfaces/RequestOptions.md)

#### Returns

[`APIPromise`](../../index/classes/APIPromise.md)\<`void`\>

#### Operation

deleteEnvironment

***

### list()

> **list**(`params?`, `options?`): [`PagePromise`](../../index/classes/PagePromise.md)\<[`Environment`](../interfaces/Environment.md)\>

列出 Environment.

#### Parameters

##### params?

[`EnvironmentListParams`](../interfaces/EnvironmentListParams.md) = `{}`

##### options?

[`RequestOptions`](../../index/interfaces/RequestOptions.md)

#### Returns

[`PagePromise`](../../index/classes/PagePromise.md)\<[`Environment`](../interfaces/Environment.md)\>

#### Operation

listEnvironment

***

### retrieve()

> **retrieve**(`id`, `options?`): [`APIPromise`](../../index/classes/APIPromise.md)\<[`Environment`](../interfaces/Environment.md)\>

查询 Environment.

#### Parameters

##### id

`string`

##### options?

[`RequestOptions`](../../index/interfaces/RequestOptions.md)

#### Returns

[`APIPromise`](../../index/classes/APIPromise.md)\<[`Environment`](../interfaces/Environment.md)\>

#### Operation

getEnvironment

***

### update()

> **update**(`id`, `params?`, `options?`): [`APIPromise`](../../index/classes/APIPromise.md)\<[`Environment`](../interfaces/Environment.md)\>

修改 Environment.

#### Parameters

##### id

`string`

##### params?

[`EnvironmentUpdateParams`](../interfaces/EnvironmentUpdateParams.md) = `{}`

##### options?

[`RequestOptions`](../../index/interfaces/RequestOptions.md)

#### Returns

[`APIPromise`](../../index/classes/APIPromise.md)\<[`Environment`](../interfaces/Environment.md)\>

#### Operation

updateEnvironment
