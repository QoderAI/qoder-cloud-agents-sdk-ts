[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [managed](../README.md) / ManagedAgentsSessionUsageEvent

# Interface: ManagedAgentsSessionUsageEvent

Cumulative Credits emitted before session.status_idle when usage is available.

## Properties

### budget?

> `optional` **budget?**: [`ManagedAgentsBudgetLimit`](ManagedAgentsBudgetLimit.md) \| `null`

A total model and sandbox credit limit. Reaching it rejects the next user
message without interrupting the running turn.

***

### id

> **id**: `string`

Unique identifier for this event.

***

### model\_credits

> **model\_credits**: `number`

Cumulative Credits. Replace the previous snapshot instead of adding it.

***

### processed\_at

> **processed\_at**: `string`

A timestamp in RFC 3339 format

***

### sandbox\_runtime\_credits

> **sandbox\_runtime\_credits**: `number`

***

### total\_credits

> **total\_credits**: `number`

***

### type

> **type**: `"session.usage"`

Any of "session.usage".

***

### ~~usage?~~

> `optional` **usage?**: [`ManagedAgentsSessionUsageSnapshot`](ManagedAgentsSessionUsageSnapshot.md)

#### Deprecated

Legacy nested usage; current events carry Credits at the top level.
