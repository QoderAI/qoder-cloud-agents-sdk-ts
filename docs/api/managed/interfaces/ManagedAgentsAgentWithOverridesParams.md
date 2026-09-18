[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [managed](../README.md) / ManagedAgentsAgentWithOverridesParams

# Interface: ManagedAgentsAgentWithOverridesParams

Reference to an `agent` plus optional configuration overrides. Each provided
field replaces the agent's value for the caller's use; the agent resource is
unchanged.

## Properties

### id

> **id**: `string`

The `agent` ID.

***

### mcp\_servers?

> `optional` **mcp\_servers?**: [`ManagedAgentsURLMCPServerParams`](ManagedAgentsURLMCPServerParams.md)[] \| `null`

Replacement MCP server list. Full replacement: the provided array becomes the
MCP servers. Send an empty array to clear; omit to preserve the agent's servers.

***

### model?

> `optional` **model?**: [`ManagedAgentsModelConfigParams`](../type-aliases/ManagedAgentsModelConfigParams.md) \| `null`

Replacement model. Accepts the model string, e.g. `claude-opus-5`, or a
`model_config` object. Omit to use the agent's model.

***

### skills?

> `optional` **skills?**: [`ManagedAgentsSkillParamsUnion`](../type-aliases/ManagedAgentsSkillParamsUnion.md)[] \| `null`

Replacement skill list. Full replacement: the provided array becomes the skills.
Send an empty array to clear; omit to preserve the agent's skills.

***

### system?

> `optional` **system?**: `string` \| `null`

Replacement system prompt. Up to 100,000 characters. Set to null to clear the
agent's system prompt; omit to preserve it.

***

### tools?

> `optional` **tools?**: [`ManagedAgentsAgentWithOverridesParamsToolUnion`](../type-aliases/ManagedAgentsAgentWithOverridesParamsToolUnion.md)[] \| `null`

Replacement tool list. Full replacement: the provided array becomes the tool
configuration. Send an empty array to clear; omit to preserve the agent's tools.

***

### type

> **type**: `"agent_with_overrides"`

Any of "agent_with_overrides".

***

### version?

> `optional` **version?**: `number` \| `null`

The specific `agent` version to use. Omit to use the latest version.
