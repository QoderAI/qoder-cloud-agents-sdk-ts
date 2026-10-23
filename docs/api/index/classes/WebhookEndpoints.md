[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [index](../README.md) / WebhookEndpoints

# Class: WebhookEndpoints

## Extends

- `APIResource`

## Constructors

### Constructor

> **new WebhookEndpoints**(`_client`): `WebhookEndpoints`

#### Parameters

##### \_client

[`APIClient`](APIClient.md)

#### Returns

`WebhookEndpoints`

#### Inherited from

`APIResource.constructor`

## Properties

### \_client

> `protected` `readonly` **\_client**: [`APIClient`](APIClient.md)

#### Inherited from

`APIResource._client`

## Methods

### create()

> **create**(`params`, `options?`): [`APIPromise`](APIPromise.md)\<[`WebhookEndpointCreateResponse`](../interfaces/WebhookEndpointCreateResponse.md)\>

Create webhook endpoints.

#### Parameters

##### params

[`WebhookEndpointCreateParams`](../interfaces/WebhookEndpointCreateParams.md)

##### options?

[`RequestOptions`](../interfaces/RequestOptions.md)

#### Returns

[`APIPromise`](APIPromise.md)\<[`WebhookEndpointCreateResponse`](../interfaces/WebhookEndpointCreateResponse.md)\>

#### Operation

createWebhookEndpoint

***

### delete()

> **delete**(`endpointID`, `options?`): [`APIPromise`](APIPromise.md)\<`void`\>

Delete webhook endpoints.

#### Parameters

##### endpointID

`string`

##### options?

[`RequestOptions`](../interfaces/RequestOptions.md)

#### Returns

[`APIPromise`](APIPromise.md)\<`void`\>

#### Operation

deleteWebhookEndpoint

***

### disable()

> **disable**(`endpointID`, `options?`): [`APIPromise`](APIPromise.md)\<[`WebhookEndpoint`](../interfaces/WebhookEndpoint.md)\>

Disable webhook endpoints.

#### Parameters

##### endpointID

`string`

##### options?

[`RequestOptions`](../interfaces/RequestOptions.md)

#### Returns

[`APIPromise`](APIPromise.md)\<[`WebhookEndpoint`](../interfaces/WebhookEndpoint.md)\>

#### Operation

disableWebhookEndpoint

***

### enable()

> **enable**(`endpointID`, `options?`): [`APIPromise`](APIPromise.md)\<[`WebhookEndpoint`](../interfaces/WebhookEndpoint.md)\>

Enable webhook endpoints.

#### Parameters

##### endpointID

`string`

##### options?

[`RequestOptions`](../interfaces/RequestOptions.md)

#### Returns

[`APIPromise`](APIPromise.md)\<[`WebhookEndpoint`](../interfaces/WebhookEndpoint.md)\>

#### Operation

enableWebhookEndpoint

***

### list()

> **list**(`params?`, `options?`): [`PagePromise`](PagePromise.md)\<[`WebhookEndpoint`](../interfaces/WebhookEndpoint.md)\>

List webhook endpoints.

#### Parameters

##### params?

[`WebhookEndpointListParams`](../interfaces/WebhookEndpointListParams.md) = `{}`

##### options?

[`RequestOptions`](../interfaces/RequestOptions.md)

#### Returns

[`PagePromise`](PagePromise.md)\<[`WebhookEndpoint`](../interfaces/WebhookEndpoint.md)\>

#### Operation

listWebhookEndpoints

***

### retrieve()

> **retrieve**(`endpointID`, `options?`): [`APIPromise`](APIPromise.md)\<[`WebhookEndpoint`](../interfaces/WebhookEndpoint.md)\>

Retrieve webhook endpoints.

#### Parameters

##### endpointID

`string`

##### options?

[`RequestOptions`](../interfaces/RequestOptions.md)

#### Returns

[`APIPromise`](APIPromise.md)\<[`WebhookEndpoint`](../interfaces/WebhookEndpoint.md)\>

#### Operation

getWebhookEndpoint

***

### test()

> **test**(`endpointID`, `options?`): [`APIPromise`](APIPromise.md)\<[`WebhookEndpointTestResponse`](../interfaces/WebhookEndpointTestResponse.md)\>

Queue a synthetic event; acceptance does not confirm delivery.

#### Parameters

##### endpointID

`string`

##### options?

[`RequestOptions`](../interfaces/RequestOptions.md)

#### Returns

[`APIPromise`](APIPromise.md)\<[`WebhookEndpointTestResponse`](../interfaces/WebhookEndpointTestResponse.md)\>

#### Operation

testWebhookEndpoint

***

### update()

> **update**(`endpointID`, `params?`, `options?`): [`APIPromise`](APIPromise.md)\<[`WebhookEndpoint`](../interfaces/WebhookEndpoint.md)\>

Update webhook endpoints.

#### Parameters

##### endpointID

`string`

##### params?

[`WebhookEndpointUpdateParams`](../interfaces/WebhookEndpointUpdateParams.md) = `{}`

##### options?

[`RequestOptions`](../interfaces/RequestOptions.md)

#### Returns

[`APIPromise`](APIPromise.md)\<[`WebhookEndpoint`](../interfaces/WebhookEndpoint.md)\>

#### Operation

updateWebhookEndpoint
