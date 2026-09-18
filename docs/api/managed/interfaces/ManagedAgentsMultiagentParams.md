[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [managed](../README.md) / ManagedAgentsMultiagentParams

# Interface: ManagedAgentsMultiagentParams

A coordinator topology: the session's primary thread orchestrates work by
spawning session threads, each running an agent drawn from the `agents` roster.

## Properties

### agents

> **agents**: [`ManagedAgentsMultiagentRosterEntryParamsUnion`](../type-aliases/ManagedAgentsMultiagentRosterEntryParamsUnion.md)[]

Agents the coordinator may spawn as session threads. 1–20 entries. Each entry is
an agent ID string, a versioned `{"type":"agent","id","version"}` reference, or
`{"type":"self"}` to allow recursive self-invocation. Entries must reference
distinct agents (after resolving `self` and string forms); at most one `self`.
Referenced agents must exist, must not be archived, and must not themselves have
`multiagent` set (depth limit 1).

***

### type

> **type**: `"coordinator"`

Any of "coordinator".
