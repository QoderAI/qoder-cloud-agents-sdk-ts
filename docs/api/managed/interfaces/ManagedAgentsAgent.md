[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [managed](../README.md) / ManagedAgentsAgent

# Interface: ManagedAgentsAgent

A Managed Agents `agent`.

## Properties

### archived\_at

> **archived\_at**: `string` \| `null`

A timestamp in RFC 3339 format

***

### created\_at

> **created\_at**: `string`

A timestamp in RFC 3339 format

***

### description

> **description**: `string`

***

### id

> **id**: `string`

***

### mcp\_servers

> **mcp\_servers**: [`ManagedAgentsMCPServerURLDefinition`](ManagedAgentsMCPServerURLDefinition.md)[]

***

### metadata

> **metadata**: `Record`\<`string`, `string`\>

***

### model

> **model**: [`ManagedAgentsModelConfig`](../type-aliases/ManagedAgentsModelConfig.md)

Model identifier and configuration.

***

### multiagent

> **multiagent**: [`ManagedAgentsMultiagent`](ManagedAgentsMultiagent.md) \| `null`

Resolved coordinator topology with a concrete agent roster.

***

### name

> **name**: `string`

***

### skills

> **skills**: [`ManagedAgentsAgentSkillUnion`](../type-aliases/ManagedAgentsAgentSkillUnion.md)[]

***

### system

> **system**: `string`

***

### tools

> **tools**: [`ManagedAgentsAgentToolUnion`](../type-aliases/ManagedAgentsAgentToolUnion.md)[]

***

### type

> **type**: `"agent"`

Any of "agent".

***

### updated\_at

> **updated\_at**: `string`

A timestamp in RFC 3339 format

***

### version

> **version**: `number`

The agent's current version. Starts at 1 and increments when the agent is
modified.
