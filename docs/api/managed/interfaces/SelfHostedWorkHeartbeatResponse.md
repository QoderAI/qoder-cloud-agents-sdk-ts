[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [managed](../README.md) / SelfHostedWorkHeartbeatResponse

# Interface: SelfHostedWorkHeartbeatResponse

Response after recording a heartbeat for a work item.

## Properties

### last\_heartbeat

> **last\_heartbeat**: `string`

RFC 3339 timestamp of the actual heartbeat from DB

***

### lease\_extended

> **lease\_extended**: `boolean`

Whether the heartbeat succeeded in extending the lease

***

### state

> **state**: [`SelfHostedWorkHeartbeatResponseState`](../type-aliases/SelfHostedWorkHeartbeatResponseState.md)

Current state of the work item (active/stopping/stopped)

Any of "queued", "starting", "active", "stopping", "stopped".

***

### ttl\_seconds

> **ttl\_seconds**: `number`

Effective TTL applied to the lease

***

### type?

> `optional` **type?**: `"work_heartbeat"`

The type of response
