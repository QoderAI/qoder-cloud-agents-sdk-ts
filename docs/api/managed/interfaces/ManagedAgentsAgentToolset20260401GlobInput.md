[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [managed](../README.md) / ManagedAgentsAgentToolset20260401GlobInput

# Interface: ManagedAgentsAgentToolset20260401GlobInput

Input payload for the `glob` tool. Returns paths matching a doublestar glob
pattern, newest first.

## Properties

### path?

> `optional` **path?**: `string`

Optional directory root to search under. Defaults to the runner's working
directory.

***

### pattern

> **pattern**: `string`

Doublestar glob pattern (e.g. `** /*.go`). Absolute patterns are only permitted
when the runner is configured to allow them.
