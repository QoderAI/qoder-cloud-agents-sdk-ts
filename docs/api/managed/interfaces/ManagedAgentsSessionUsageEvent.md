[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [managed](../README.md) / ManagedAgentsSessionUsageEvent

# Interface: ManagedAgentsSessionUsageEvent

Periodic snapshot of the session's cumulative usage and tracked list cost.

## Properties

### budget?

> `optional` **budget?**: [`ManagedAgentsBudgetLimit`](ManagedAgentsBudgetLimit.md) \| `null`

A hard spend ceiling. The session stops issuing new model requests once the
tracked list cost reaches `max_list_cost`.

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

> **type**: `"session.usage"`

Any of "session.usage".

***

### usage

> **usage**: [`ManagedAgentsSessionUsageSnapshot`](ManagedAgentsSessionUsageSnapshot.md)

Point-in-time snapshot of a session's cumulative usage.
