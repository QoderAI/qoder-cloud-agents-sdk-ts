[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [managed](../README.md) / ManagedAgentsUnknownRunError

# Interface: ManagedAgentsUnknownRunError

An unknown or unexpected error caused the run to fail. A fallback variant;
clients that do not recognize a new error type can match on message alone.

## Properties

### message

> **message**: `string`

Human-readable error description.

***

### type

> **type**: `"unknown_error"`

Any of "unknown_error".
