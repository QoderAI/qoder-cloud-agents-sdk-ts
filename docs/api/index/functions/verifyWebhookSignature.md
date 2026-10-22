[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [index](../README.md) / verifyWebhookSignature

# Function: verifyWebhookSignature()

> **verifyWebhookSignature**(`payload`, `headers`, `secret`): `Promise`\<`void`\>

Verify original body bytes before parsing JSON. Accepts any matching v1 signature
within 300 seconds. Deduplicate accepted events using Webhook-ID.

## Parameters

### payload

`Uint8Array`

### headers

`Headers` \| `Record`\<`string`, `string`\>

### secret

`string`

## Returns

`Promise`\<`void`\>
