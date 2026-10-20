[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [managed](../README.md) / ManagedAgentsBillingError

# Interface: ManagedAgentsBillingError

The caller's organization or workspace cannot make model requests — out of
credits or spend limit reached. Retrying with the same credentials will not
succeed; the caller must resolve the billing state.

## Properties

### message

> **message**: `string`

Human-readable error description.

***

### qoder\_error\_code?

> `optional` **qoder\_error\_code?**: `string`

Diagnostic only; use retry_status to determine retry behavior.

***

### retry\_status

> **retry\_status**: [`ManagedAgentsBillingErrorRetryStatusUnion`](../type-aliases/ManagedAgentsBillingErrorRetryStatusUnion.md)

What the client should do next in response to this error.

***

### type

> **type**: `"billing_error"`

Any of "billing_error".
