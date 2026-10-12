[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [index](../README.md) / ServiceAccountCredentialOptions

# Interface: ServiceAccountCredentialOptions

## Properties

### fetch?

> `optional` **fetch?**: (`input`, `init?`) => `Promise`\<`Response`\>

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Window/fetch)

#### Parameters

##### input

`RequestInfo` \| `URL`

##### init?

`RequestInit`

#### Returns

`Promise`\<`Response`\>

***

### region

> **region**: `"cn"` \| `"global"`

***

### saKey

> **saKey**: `string`

***

### scopes

> **scopes**: readonly `string`[]

***

### timeout?

> `optional` **timeout?**: `number`

Exchange timeout in milliseconds, including response body reading.

***

### ttlSeconds?

> `optional` **ttlSeconds?**: `number`
