[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [managed](../README.md) / ManagedAgentsSessionThread

# Interface: ManagedAgentsSessionThread

An execution thread within a `session`. Each session has one primary thread plus
zero or more child threads spawned by the coordinator.

## Properties

### agent

> **agent**: [`ManagedAgentsSessionThreadAgentUnion`](../type-aliases/ManagedAgentsSessionThreadAgentUnion.md)

The resolved agent a session thread runs: a saved-agent snapshot, the platform
advisor entry, or an inline-defined (ephemeral) agent snapshot.

***

### archived\_at

> **archived\_at**: `string` \| `null`

A timestamp in RFC 3339 format

***

### created\_at

> **created\_at**: `string`

A timestamp in RFC 3339 format

***

### id

> **id**: `string`

Unique identifier for this thread.

***

### parent\_thread\_id

> **parent\_thread\_id**: `string` \| `null`

Parent thread that spawned this thread. Null for the primary thread.

***

### session\_id

> **session\_id**: `string`

The session this thread belongs to.

***

### stats

> **stats**: [`ManagedAgentsSessionThreadStats`](ManagedAgentsSessionThreadStats.md) \| `null`

Timing statistics for a session thread.

***

### status

> **status**: [`ManagedAgentsSessionThreadStatus`](../type-aliases/ManagedAgentsSessionThreadStatus.md)

SessionThreadStatus enum

Any of "running", "idle", "rescheduling", "terminated".

***

### type

> **type**: `"session_thread"`

Any of "session_thread".

***

### updated\_at

> **updated\_at**: `string`

A timestamp in RFC 3339 format

***

### usage

> **usage**: [`ManagedAgentsSessionThreadUsage`](ManagedAgentsSessionThreadUsage.md)

Cumulative token usage for a session thread across all turns.
