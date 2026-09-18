[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [managed](../README.md) / ManagedAgentsSessionAgentUpdateParam

# Interface: ManagedAgentsSessionAgentUpdateParam

Mid-session agent configuration update. Only `tools` and `mcp_servers` are
updatable. Full replacement: the provided array becomes the new value. To
preserve existing entries, GET the session, modify the array, and POST it back.

## Properties

### mcp\_servers?

> `optional` **mcp\_servers?**: [`ManagedAgentsURLMCPServerParams`](ManagedAgentsURLMCPServerParams.md)[] \| `null`

Replacement MCP server list. Full replacement: the provided array becomes the
new value. Send an empty array to clear; omit to preserve.

***

### model?

> `optional` **model?**: [`ManagedAgentsModelConfigParams`](../type-aliases/ManagedAgentsModelConfigParams.md) \| `null`

***

### skills?

> `optional` **skills?**: [`ManagedAgentsSkillParamsUnion`](../type-aliases/ManagedAgentsSkillParamsUnion.md)[] \| `null`

***

### system?

> `optional` **system?**: `string` \| `null`

***

### tools?

> `optional` **tools?**: [`ManagedAgentsSessionAgentUpdateToolUnionParam`](../type-aliases/ManagedAgentsSessionAgentUpdateToolUnionParam.md)[] \| `null`

Replacement tool list. Full replacement: the provided array becomes the new
value. Send an empty array to clear; omit to preserve.
