[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [managed](../README.md) / ManagedAgentsAgentToolset20260401BashInput

# Interface: ManagedAgentsAgentToolset20260401BashInput

Input payload for the `bash` tool of the `agent_toolset_20260401` toolset. All
fields are optional; a normal invocation supplies `command`, while
`restart=true` (with no `command`) reboots the runner-side bash session.

## Properties

### command?

> `optional` **command?**: `string`

Shell command to execute. Omit only when `restart` is true.

***

### restart?

> `optional` **restart?**: `boolean`

When true, restart the persistent bash session instead of running a command.
Subsequent calls without `restart` will run against the fresh session.

***

### timeout\_ms?

> `optional` **timeout\_ms?**: `number`

Per-call timeout in milliseconds. Defaults to the runner-wide tool timeout when
omitted or zero.
