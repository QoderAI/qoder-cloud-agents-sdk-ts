[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [managed](../README.md) / ManagedAgentsRetryStatusRetrying

# Interface: ManagedAgentsRetryStatusRetrying

The server is retrying automatically. Client should wait; the same error type
may fire again as retrying, then once as exhausted when the retry budget runs
out.

## Properties

### type

> **type**: `"retrying"`

Any of "retrying".
