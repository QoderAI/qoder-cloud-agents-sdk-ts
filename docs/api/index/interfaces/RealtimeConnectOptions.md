[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [index](../README.md) / RealtimeConnectOptions

# Interface: RealtimeConnectOptions

## Properties

### closeTimeout?

> `optional` **closeTimeout?**: `number`

***

### conversationId

> **conversationId**: `string`

***

### handshakeTimeout?

> `optional` **handshakeTimeout?**: `number`

***

### headers?

> `optional` **headers?**: [`HeadersLike`](../type-aliases/HeadersLike.md)

***

### maxQueueBytes?

> `optional` **maxQueueBytes?**: `number`

***

### maxQueuedEvents?

> `optional` **maxQueuedEvents?**: `number`

***

### maxReceiveBytes?

> `optional` **maxReceiveBytes?**: `number`

***

### readyTimeout?

> `optional` **readyTimeout?**: `number`

***

### sendTimeout?

> `optional` **sendTimeout?**: `number`

***

### signal?

> `optional` **signal?**: `AbortSignal` \| `null`

Cancelling this signal releases the entire connection, including ready waits.

***

### transport?

> `optional` **transport?**: `object`

Node agent (including proxy agents) and TLS settings; fetch/middleware do not apply to WS.

#### agent?

> `optional` **agent?**: `object`

#### ca?

> `optional` **ca?**: `string` \| `Uint8Array`\<`ArrayBufferLike`\> \| (`string` \| `Uint8Array`\<`ArrayBufferLike`\>)[]

#### cert?

> `optional` **cert?**: `string` \| `Uint8Array`\<`ArrayBufferLike`\>

#### key?

> `optional` **key?**: `string` \| `Uint8Array`\<`ArrayBufferLike`\>

#### rejectUnauthorized?

> `optional` **rejectUnauthorized?**: `boolean`

#### servername?

> `optional` **servername?**: `string`
