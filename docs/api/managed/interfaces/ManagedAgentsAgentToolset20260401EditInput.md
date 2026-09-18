[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [managed](../README.md) / ManagedAgentsAgentToolset20260401EditInput

# Interface: ManagedAgentsAgentToolset20260401EditInput

Input payload for the `edit` tool. Performs a string replacement in the named
file; by default `old_string` must occur exactly once.

## Properties

### file\_path

> **file\_path**: `string`

Path of the file to edit.

***

### new\_string

> **new\_string**: `string`

Replacement text.

***

### old\_string

> **old\_string**: `string`

Substring to find and replace.

***

### replace\_all?

> `optional` **replace\_all?**: `boolean`

When true, replace every occurrence of `old_string` instead of requiring a
unique match.
