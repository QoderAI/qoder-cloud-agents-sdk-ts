[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [managed](../README.md) / AgentUpdateParams

# Interface: AgentUpdateParams

## Properties

### betas?

> `optional` **betas?**: `string`[]

Optional header to specify the beta version(s) you want to use.

***

### description?

> `optional` **description?**: `string` \| `null`

Description. Omit to preserve; send empty string or null to clear.

***

### mcp\_servers?

> `optional` **mcp\_servers?**: [`ManagedAgentsURLMCPServerParams`](ManagedAgentsURLMCPServerParams.md)[] \| `null`

MCP servers. Full replacement. Omit to preserve; send empty array or `null` to
clear. Names must be unique. Maximum 20. Every server must be referenced by an
`mcp_toolset` in the agent's resulting `tools`; unreferenced servers are
rejected. See the
[MCP connector guide](https://docs.qoder.com/cloud-agents/api/agents/schemas).

***

### metadata?

> `optional` **metadata?**: `Record`\<`string`, `unknown`\> \| `null`

Metadata patch. Set a key to a string to upsert it, or to null to delete it.
Omit the field to preserve. The stored bag is limited to 16 keys (up to 64 chars
each) with values up to 512 chars.

***

### model?

> `optional` **model?**: [`ManagedAgentsModelConfigParams`](../type-aliases/ManagedAgentsModelConfigParams.md)

Model identifier. Accepts the
[model string](https://docs.qoder.com/cloud-agents/api/models/list),
e.g. `claude-opus-5`, or a `model_config` object for additional configuration
control. Omit to preserve. Cannot be cleared.

***

### multiagent?

> `optional` **multiagent?**: [`ManagedAgentsMultiagentParams`](ManagedAgentsMultiagentParams.md) \| `null`

A coordinator topology: the session's primary thread orchestrates work by
spawning session threads, each running an agent drawn from the `agents` roster.

***

### name?

> `optional` **name?**: `string`

Human-readable name. Must be non-empty. Omit to preserve. Cannot be cleared.

***

### skills?

> `optional` **skills?**: [`ManagedAgentsSkillParamsUnion`](../type-aliases/ManagedAgentsSkillParamsUnion.md)[] \| `null`

Skills. Full replacement. Omit to preserve; send empty array or null to clear.

***

### system?

> `optional` **system?**: `string` \| `null`

System prompt. Omit to preserve; send empty string or null to clear.

***

### tools?

> `optional` **tools?**: [`AgentUpdateParamsToolUnion`](../type-aliases/AgentUpdateParamsToolUnion.md)[] \| `null`

Tool configurations available to the agent. Full replacement. Omit to preserve;
send empty array or null to clear. Maximum of 128 tools across all toolsets
allowed.

***

### version?

> `optional` **version?**: `number` \| `null`

The agent's current version, used to prevent concurrent overwrites. Obtain this
value from a create or retrieve response. Must be at least 1 if specified. When
supplied, the request fails if it does not match the server's current version;
omit to apply the update unconditionally.

***

### workspace\_id?

> `optional` **workspace\_id?**: `string`
