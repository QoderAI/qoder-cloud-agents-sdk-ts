[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [managed](../README.md) / ManagedAgentsSessionThreadAgent

# Interface: ManagedAgentsSessionThreadAgent

Resolved `agent` definition for a single `session_thread`. Snapshot of the agent
at thread creation time. The multiagent roster is not repeated here; read it
from `Session.agent`.

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

### name

> **name**: `string`

***

### skills

> **skills**: [`ManagedAgentsSessionThreadAgentSkillUnion`](../type-aliases/ManagedAgentsSessionThreadAgentSkillUnion.md)[]

***

### system

> **system**: `string`

***

### tools

> **tools**: [`ManagedAgentsSessionThreadAgentToolUnion`](../type-aliases/ManagedAgentsSessionThreadAgentToolUnion.md)[]

***

### type

> **type**: `"agent"`

Any of "agent".

***

### version

> **version**: `number`
