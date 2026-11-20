[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [managed](../README.md) / ManagedAgentsMultiagent

# Interface: ManagedAgentsMultiagent

Resolved coordinator topology with a concrete agent roster.

## Properties

### agents

> **agents**: [`ManagedAgentsMultiagentAgentUnion`](../type-aliases/ManagedAgentsMultiagentAgentUnion.md)[]

Agents the coordinator may spawn as session threads. Child Agent references keep
their saved version, which can be `"latest"`.

***

### type

> **type**: `"coordinator"`

Any of "coordinator".
