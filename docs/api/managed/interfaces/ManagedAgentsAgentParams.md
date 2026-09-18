[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [managed](../README.md) / ManagedAgentsAgentParams

# Interface: ManagedAgentsAgentParams

Specification for an Agent. Provide a specific `version` or use the short-form
`agent="agent_id"` for the most recent version

## Properties

### id

> **id**: `string`

The `agent` ID.

***

### type

> **type**: `"agent"`

Any of "agent".

***

### version?

> `optional` **version?**: `number` \| `null`

The specific `agent` version to use. Omit to use the latest version. Must be at
least 1 if specified.
