[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [managed](../README.md) / ManagedAgentsSessionAgent

# Interface: ManagedAgentsSessionAgent

Resolved `agent` definition for a `session`. Snapshot of the `agent` at
`session` creation time.

## Properties

### description

> **description**: `string`

***

### id

> **id**: `string`

***

### mcp\_servers

> **mcp\_servers**: [`ManagedAgentsMCPServerURLDefinition`](ManagedAgentsMCPServerURLDefinition.md)[]

***

### model

> **model**: [`ManagedAgentsModelConfig`](../type-aliases/ManagedAgentsModelConfig.md)

Model identifier and configuration.

***

### multiagent

> **multiagent**: [`ManagedAgentsSessionMultiagentCoordinator`](ManagedAgentsSessionMultiagentCoordinator.md)

Resolved coordinator topology with full agent definitions for each roster
member.

***

### name

> **name**: `string`

***

### skills

> **skills**: [`ManagedAgentsSessionAgentSkillUnion`](../type-aliases/ManagedAgentsSessionAgentSkillUnion.md)[]

***

### system

> **system**: `string`

***

### tools

> **tools**: [`ManagedAgentsSessionAgentToolUnion`](../type-aliases/ManagedAgentsSessionAgentToolUnion.md)[]

***

### type

> **type**: `"agent"`

Any of "agent".

***

### version

> **version**: `number`
