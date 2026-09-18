[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [index](../README.md) / decodeSSE

# Function: decodeSSE()

> **decodeSSE**(`body`): `AsyncGenerator`\<[`ServerSentEvent`](../interfaces/ServerSentEvent.md)\>

Incremental SSE decoding: IDs identify events, not individual delta frames.

## Parameters

### body

`ReadableStream`\<`Uint8Array`\<`ArrayBufferLike`\>\>

## Returns

`AsyncGenerator`\<[`ServerSentEvent`](../interfaces/ServerSentEvent.md)\>
