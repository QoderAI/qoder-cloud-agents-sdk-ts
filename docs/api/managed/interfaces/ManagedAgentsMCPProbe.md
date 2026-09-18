[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [managed](../README.md) / ManagedAgentsMCPProbe

# Interface: ManagedAgentsMCPProbe

The failing step of an MCP validation probe.

## Properties

### http\_response

> **http\_response**: [`ManagedAgentsRefreshHTTPResponse`](ManagedAgentsRefreshHTTPResponse.md)

An HTTP response captured during a credential validation probe.

***

### method

> **method**: `string`

The MCP method that failed (for example `initialize` or `tools/list`).
