[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [managed](../README.md) / ManagedAgentsSessionErrorEvent

# Interface: ManagedAgentsSessionErrorEvent

An error event indicating a problem occurred during session execution.

## Properties

### error

> **error**: [`ManagedAgentsSessionErrorEventErrorUnion`](../type-aliases/ManagedAgentsSessionErrorEventErrorUnion.md)

An unknown or unexpected error occurred during session execution. A fallback
variant; clients that don't recognize a new error code can match on
`retry_status` and `message` alone.

***

### id

> **id**: `string`

Unique identifier for this event.

***

### processed\_at

> **processed\_at**: `string`

A timestamp in RFC 3339 format

***

### type

> **type**: `"session.error"`

Any of "session.error".
