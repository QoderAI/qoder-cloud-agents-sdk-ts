[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [managed](../README.md) / ManagedAgentsSessionUpdatedEvent

# Interface: ManagedAgentsSessionUpdatedEvent

Emitted when an UpdateSession request changed at least one field. Carries only
the fields that changed; absent fields were not part of the update. The new
configuration applies from the next turn.

## Properties

### agent?

> `optional` **agent?**: [`ManagedAgentsSessionAgent`](ManagedAgentsSessionAgent.md) \| `null`

Resolved `agent` definition for a `session`. Snapshot of the `agent` at
`session` creation time.

***

### budget?

> `optional` **budget?**: [`ManagedAgentsBudgetLimit`](ManagedAgentsBudgetLimit.md) \| `null`

A hard spend ceiling. The session stops issuing new model requests once the
tracked list cost reaches `max_list_cost`.

***

### id

> **id**: `string`

Unique identifier for this event.

***

### metadata?

> `optional` **metadata?**: `Record`\<`string`, `string`\>

The session's full metadata bag after the update. Present when the update set
non-empty metadata; absent when metadata was unchanged or cleared to empty.

***

### processed\_at

> **processed\_at**: `string`

A timestamp in RFC 3339 format

***

### title?

> `optional` **title?**: `string` \| `null`

The session's new title. Present only when the update changed it.

***

### type

> **type**: `"session.updated"`

Any of "session.updated".
