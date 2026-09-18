[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [managed](../README.md) / ManagedAgentsUnknownError

# Interface: ManagedAgentsUnknownError

An unknown or unexpected error occurred during session execution. A fallback
variant; clients that don't recognize a new error code can match on
`retry_status` and `message` alone.

## Properties

### message

> **message**: `string`

Human-readable error description.

***

### retry\_status

> **retry\_status**: [`ManagedAgentsUnknownErrorRetryStatusUnion`](../type-aliases/ManagedAgentsUnknownErrorRetryStatusUnion.md)

What the client should do next in response to this error.

***

### type

> **type**: `"unknown_error"`

Any of "unknown_error".
