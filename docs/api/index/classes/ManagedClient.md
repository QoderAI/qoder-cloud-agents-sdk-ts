[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [index](../README.md) / ManagedClient

# Class: ManagedClient

Qoder Managed Mode API client.

## Extends

- [`APIClient`](APIClient.md)

## Constructors

### Constructor

> **new ManagedClient**(`options?`): `ManagedClient`

#### Parameters

##### options?

[`ClientOptions`](../interfaces/ClientOptions.md) = `{}`

#### Returns

`ManagedClient`

#### Overrides

[`APIClient`](APIClient.md).[`constructor`](APIClient.md#constructor)

## Properties

### agents

> `readonly` **agents**: [`Agents`](../../managed/classes/Agents.md)

***

### authMode

> `readonly` **authMode**: [`AuthMode`](../type-aliases/AuthMode.md)

#### Inherited from

[`APIClient`](APIClient.md).[`authMode`](APIClient.md#authmode)

***

### baseURL

> `readonly` **baseURL**: `string`

#### Inherited from

[`APIClient`](APIClient.md).[`baseURL`](APIClient.md#baseurl)

***

### defaultHeaders

> `readonly` **defaultHeaders**: [`HeadersLike`](../type-aliases/HeadersLike.md) \| `undefined`

#### Inherited from

[`APIClient`](APIClient.md).[`defaultHeaders`](APIClient.md#defaultheaders)

***

### deploymentRuns

> `readonly` **deploymentRuns**: [`DeploymentRuns`](../../managed/classes/DeploymentRuns.md)

***

### deployments

> `readonly` **deployments**: [`Deployments`](../../managed/classes/Deployments.md)

***

### dreams

> `readonly` **dreams**: [`Dreams`](../../managed/classes/Dreams.md)

***

### environments

> `readonly` **environments**: [`Environments`](../../managed/classes/Environments.md)

***

### files

> `readonly` **files**: [`Files`](../../managed/classes/Files.md)

***

### maxRetries

> `readonly` **maxRetries**: `number`

#### Inherited from

[`APIClient`](APIClient.md).[`maxRetries`](APIClient.md#maxretries)

***

### memoryStores

> `readonly` **memoryStores**: [`MemoryStores`](../../managed/classes/MemoryStores.md)

***

### mode

> `readonly` **mode**: `"forward"` \| `"managed"` = `'managed'`

#### Inherited from

[`APIClient`](APIClient.md).[`mode`](APIClient.md#mode)

***

### models

> `readonly` **models**: [`Models`](../../managed/classes/Models.md)

***

### oauth

> `readonly` **oauth**: [`OAuth`](../../managed/classes/OAuth.md)

***

### options

> `protected` `readonly` **options**: [`ClientOptions`](../interfaces/ClientOptions.md)

#### Inherited from

[`APIClient`](APIClient.md).[`options`](APIClient.md#options)

***

### sessions

> `readonly` **sessions**: [`Sessions`](../../managed/classes/Sessions.md)

***

### skills

> `readonly` **skills**: [`Skills`](../../managed/classes/Skills.md)

***

### timeout

> `readonly` **timeout**: `number`

#### Inherited from

[`APIClient`](APIClient.md).[`timeout`](APIClient.md#timeout)

***

### vaults

> `readonly` **vaults**: [`Vaults`](../../managed/classes/Vaults.md)

## Methods

### \_prepareRealtimeRequest()

> **\_prepareRealtimeRequest**(`options`): `Promise`\<\{ `headers`: `Headers`; `url`: `URL`; \}\>

**`Internal`**

Resolve the same public credentials for the separate Node WS transport.

#### Parameters

##### options

###### conversationId

`string`

###### headers?

[`HeadersLike`](../type-aliases/HeadersLike.md)

###### signal?

`AbortSignal` \| `null`

#### Returns

`Promise`\<\{ `headers`: `Headers`; `url`: `URL`; \}\>

#### Inherited from

[`APIClient`](APIClient.md).[`_prepareRealtimeRequest`](APIClient.md#_preparerealtimerequest)

***

### downloadFile()

> **downloadFile**(`path`, `options?`): [`APIPromise`](APIPromise.md)\<`Response`\>

Resolve the API grant, then send a separate request without API credentials or headers.

#### Parameters

##### path

`string`

##### options?

[`RequestOptions`](../interfaces/RequestOptions.md) = `{}`

#### Returns

[`APIPromise`](APIPromise.md)\<`Response`\>

#### Inherited from

[`APIClient`](APIClient.md).[`downloadFile`](APIClient.md#downloadfile)

***

### getAPIList()

> **getAPIList**\<`T`\>(`path`, `query?`, `options?`, `pagination?`): [`PagePromise`](PagePromise.md)\<`T`\>

#### Type Parameters

##### T

`T`

#### Parameters

##### path

`string`

##### query?

`object` = `{}`

##### options?

[`RequestOptions`](../interfaces/RequestOptions.md) = `{}`

##### pagination?

[`PaginationMode`](../type-aliases/PaginationMode.md) = `...`

#### Returns

[`PagePromise`](PagePromise.md)\<`T`\>

#### Inherited from

[`APIClient`](APIClient.md).[`getAPIList`](APIClient.md#getapilist)

***

### postAPIList()

> **postAPIList**\<`T`\>(`path`, `body?`, `options?`, `pagination?`, `requiredBeta?`): [`PagePromise`](PagePromise.md)\<`T`\>

**`Internal`**

POST collection whose opaque cursor belongs in the JSON body.

#### Type Parameters

##### T

`T`

#### Parameters

##### path

`string`

##### body?

`object` = `{}`

##### options?

[`RequestOptions`](../interfaces/RequestOptions.md) = `{}`

##### pagination?

[`PaginationMode`](../type-aliases/PaginationMode.md) = `'page'`

##### requiredBeta?

`string`

#### Returns

[`PagePromise`](PagePromise.md)\<`T`\>

#### Inherited from

[`APIClient`](APIClient.md).[`postAPIList`](APIClient.md#postapilist)

***

### request()

> **request**\<`T`\>(`options`): [`APIPromise`](APIPromise.md)\<`T`\>

#### Type Parameters

##### T

`T`

#### Parameters

##### options

[`APIRequestOptions`](../interfaces/APIRequestOptions.md)

#### Returns

[`APIPromise`](APIPromise.md)\<`T`\>

#### Inherited from

[`APIClient`](APIClient.md).[`request`](APIClient.md#request)

***

### validateHeaders()

> `protected` **validateHeaders**(`headers`): `void`

#### Parameters

##### headers

`Headers`

#### Returns

`void`

#### Inherited from

[`APIClient`](APIClient.md).[`validateHeaders`](APIClient.md#validateheaders)

***

### withOptions()

> **withOptions**(`options`): `this`

Create a client of the same type, replacing supplied options and retaining the rest.

#### Parameters

##### options

`Partial`\<[`ClientOptions`](../interfaces/ClientOptions.md)\>

#### Returns

`this`

#### Inherited from

[`APIClient`](APIClient.md).[`withOptions`](APIClient.md#withoptions)
