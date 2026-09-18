[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [managed](../README.md) / ManagedAgentsAgentToolset20260401Params

# Interface: ManagedAgentsAgentToolset20260401Params

Configuration for built-in agent tools. Use this to enable or disable groups of
tools available to the agent.

## Properties

### configs?

> `optional` **configs?**: [`ManagedAgentsAgentToolConfigParamsUnion`](../type-aliases/ManagedAgentsAgentToolConfigParamsUnion.md)[] \| `null`

Per-tool configuration overrides.

***

### default\_config?

> `optional` **default\_config?**: [`ManagedAgentsAgentToolsetDefaultConfigParams`](ManagedAgentsAgentToolsetDefaultConfigParams.md) \| `null`

Default configuration for all tools in a toolset.

***

### disallowed\_tools?

> `optional` **disallowed\_tools?**: `string`[] \| `null`

***

### enabled\_tools?

> `optional` **enabled\_tools?**: `string`[] \| `null`

***

### type

> **type**: `"agent_toolset_20260401"`

Any of "agent_toolset_20260401".
