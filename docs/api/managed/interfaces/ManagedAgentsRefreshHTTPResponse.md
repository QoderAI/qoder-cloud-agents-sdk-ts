[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [managed](../README.md) / ManagedAgentsRefreshHTTPResponse

# Interface: ManagedAgentsRefreshHTTPResponse

An HTTP response captured during a credential validation probe.

## Properties

### body

> **body**: `string`

Response body. May be truncated and has sensitive values scrubbed.

***

### body\_truncated

> **body\_truncated**: `boolean`

Whether `body` was truncated.

***

### content\_type

> **content\_type**: `string`

Value of the `Content-Type` response header.

***

### status\_code

> **status\_code**: `number`

HTTP status code.
