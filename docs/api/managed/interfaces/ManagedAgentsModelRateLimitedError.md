[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [managed](../README.md) / ManagedAgentsModelRateLimitedError

# Interface: ManagedAgentsModelRateLimitedError

The model request was rate-limited.

## Properties

### message

> **message**: `string`

Human-readable error description.

***

### retry\_status

> **retry\_status**: [`ManagedAgentsModelRateLimitedErrorRetryStatusUnion`](../type-aliases/ManagedAgentsModelRateLimitedErrorRetryStatusUnion.md)

What the client should do next in response to this error.

***

### type

> **type**: `"model_rate_limited_error"`

Any of "model_rate_limited_error".
