[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [managed](../README.md) / ManagedAgentsRefreshObject

# Interface: ManagedAgentsRefreshObject

Outcome of a refresh-token exchange attempted during credential validation.

## Properties

### http\_response

> **http\_response**: [`ManagedAgentsRefreshHTTPResponse`](ManagedAgentsRefreshHTTPResponse.md) \| `null`

An HTTP response captured during a credential validation probe.

***

### status

> **status**: [`ManagedAgentsRefreshObjectStatus`](../type-aliases/ManagedAgentsRefreshObjectStatus.md)

Outcome of a refresh-token exchange attempted during credential validation.

Any of "succeeded", "failed", "connect_error", "no_refresh_token".
