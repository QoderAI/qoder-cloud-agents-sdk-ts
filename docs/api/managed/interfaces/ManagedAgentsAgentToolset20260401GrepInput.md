[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [managed](../README.md) / ManagedAgentsAgentToolset20260401GrepInput

# Interface: ManagedAgentsAgentToolset20260401GrepInput

Input payload for the `grep` tool. Searches file contents for a regular
expression, returning matching lines.

## Properties

### path?

> `optional` **path?**: `string`

Optional directory root to search under. Defaults to the runner's working
directory.

***

### pattern

> **pattern**: `string`

Regular expression to search for.
