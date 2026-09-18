[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [managed](../README.md) / AgentNewParams

# Interface: AgentNewParams

## Properties

### betas?

> `optional` **betas?**: `string`[]

Optional header to specify the beta version(s) you want to use.

***

### description?

> `optional` **description?**: `string` \| `null`

Description of what the agent does.

***

### mcp\_servers?

> `optional` **mcp\_servers?**: [`ManagedAgentsURLMCPServerParams`](ManagedAgentsURLMCPServerParams.md)[] \| `null`

MCP servers this agent connects to. Maximum 20. Names must be unique within the
array. Every server must be referenced by an `mcp_toolset` in `tools`;
unreferenced servers are rejected. See the
[MCP connector guide](https://docs.qoder.com/cloud-agents/api/agents/schemas).

***

### metadata?

> `optional` **metadata?**: `Record`\<`string`, `string`\> \| `null`

Arbitrary key-value metadata. Maximum 16 pairs, keys up to 64 chars, values up
to 512 chars.

***

### model

> **model**: [`ManagedAgentsModelConfigParams`](../type-aliases/ManagedAgentsModelConfigParams.md)

Model identifier. Accepts the
[model string](https://docs.qoder.com/cloud-agents/api/models/list),
e.g. `claude-opus-5`, or a `model_config` object for additional configuration
control

***

### multiagent?

> `optional` **multiagent?**: [`ManagedAgentsMultiagentParams`](ManagedAgentsMultiagentParams.md) \| `null`

A coordinator topology: the session's primary thread orchestrates work by
spawning session threads, each running an agent drawn from the `agents` roster.

***

### name

> **name**: `string`

Human-readable name for the agent.

***

### skills?

> `optional` **skills?**: [`ManagedAgentsSkillParamsUnion`](../type-aliases/ManagedAgentsSkillParamsUnion.md)[] \| `null`

Skills available to the agent.

***

### system?

> `optional` **system?**: `string` \| `null`

System prompt for the agent.

***

### tools?

> `optional` **tools?**: [`AgentNewParamsToolUnion`](../type-aliases/AgentNewParamsToolUnion.md)[] \| `null`

Tool configurations available to the agent. Maximum of 128 tools across all
toolsets allowed.

***

### workspace\_id?

> `optional` **workspace\_id?**: `string`
