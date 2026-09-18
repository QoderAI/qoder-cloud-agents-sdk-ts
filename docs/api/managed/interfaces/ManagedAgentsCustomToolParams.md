[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [managed](../README.md) / ManagedAgentsCustomToolParams

# Interface: ManagedAgentsCustomToolParams

A custom tool that is executed by the API client rather than the agent. When the
agent calls this tool, an `agent.custom_tool_use` event is emitted and the
session goes idle, waiting for the client to provide the result via a
`user.custom_tool_result` event.

## Properties

### description

> **description**: `string`

Description of what the tool does, shown to the agent to help it decide when to
use the tool.

***

### input\_schema

> **input\_schema**: [`ManagedAgentsCustomToolInputSchemaParam`](ManagedAgentsCustomToolInputSchemaParam.md)

JSON Schema for custom tool input parameters.

***

### name

> **name**: `string`

Unique name for the tool. 1-128 characters; letters, digits, underscores, and
hyphens.

***

### type

> **type**: `"custom"`

Any of "custom".
