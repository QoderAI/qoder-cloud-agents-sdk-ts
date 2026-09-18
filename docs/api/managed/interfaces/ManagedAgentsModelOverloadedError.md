[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [managed](../README.md) / ManagedAgentsModelOverloadedError

# Interface: ManagedAgentsModelOverloadedError

The model is currently overloaded. Emitted after automatic retries are
exhausted.

## Properties

### message

> **message**: `string`

Human-readable error description.

***

### retry\_status

> **retry\_status**: [`ManagedAgentsModelOverloadedErrorRetryStatusUnion`](../type-aliases/ManagedAgentsModelOverloadedErrorRetryStatusUnion.md)

What the client should do next in response to this error.

***

### type

> **type**: `"model_overloaded_error"`

Any of "model_overloaded_error".
