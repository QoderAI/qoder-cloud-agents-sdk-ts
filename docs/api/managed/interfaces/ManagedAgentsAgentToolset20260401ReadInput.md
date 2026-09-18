[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [managed](../README.md) / ManagedAgentsAgentToolset20260401ReadInput

# Interface: ManagedAgentsAgentToolset20260401ReadInput

Input payload for the `read` tool. Reads file contents relative to the runner's
working directory (or absolute when the runner permits).

## Properties

### file\_path

> **file\_path**: `string`

Path of the file to read.

***

### view\_range?

> `optional` **view\_range?**: `number`[]

Optional ``start_line, end_line`` 1-indexed inclusive range. When omitted the
entire file is returned. `end_line` of 0 or negative means "to end of file".
