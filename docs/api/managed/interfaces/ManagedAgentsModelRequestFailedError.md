[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [managed](../README.md) / ManagedAgentsModelRequestFailedError

# Interface: ManagedAgentsModelRequestFailedError

A model request failed for a reason other than overload or rate-limiting.

## Properties

### message

> **message**: `string`

Human-readable error description.

***

### retry\_status

> **retry\_status**: [`ManagedAgentsModelRequestFailedErrorRetryStatusUnion`](../type-aliases/ManagedAgentsModelRequestFailedErrorRetryStatusUnion.md)

What the client should do next in response to this error.

***

### type

> **type**: `"model_request_failed_error"`

Any of "model_request_failed_error".
