[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [index](../README.md) / ClientOptions

# Interface: ClientOptions

## Properties

### baseURL?

> `optional` **baseURL?**: `string`

***

### credential?

> `optional` **credential?**: [`Credential`](Credential.md)

***

### defaultHeaders?

> `optional` **defaultHeaders?**: [`HeadersLike`](../type-aliases/HeadersLike.md)

***

### defaultQuery?

> `optional` **defaultQuery?**: `Record`\<`string`, `unknown`\>

***

### fetch?

> `optional` **fetch?**: (`input`, `init?`) => `Promise`\<`Response`\>

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Window/fetch)

#### Parameters

##### input

`URL` \| `RequestInfo`

##### init?

`RequestInit`

#### Returns

`Promise`\<`Response`\>

***

### maxRetries?

> `optional` **maxRetries?**: `number`

***

### middleware?

> `optional` **middleware?**: [`Middleware`](../type-aliases/Middleware.md)[]

***

### pat?

> `optional` **pat?**: `string` \| (() => `string` \| `Promise`\<`string`\>)

***

### timeout?

> `optional` **timeout?**: `number`
