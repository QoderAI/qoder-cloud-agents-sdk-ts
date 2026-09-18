[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [managed](../README.md) / ManagedAgentsSystemMessageEventParams

# Interface: ManagedAgentsSystemMessageEventParams

Privileged context for the accompanying turn and all subsequent turns, appended
to the session's system context as a `role: "system"` turn rather than replacing
the top-level system prompt. At most one per request: it must be the final event
and immediately follow the `user.message`, `user.tool_result`, or
`user.custom_tool_result` it accompanies. Only supported on models that accept
mid-conversation system messages.

## Properties

### content

> **content**: [`ManagedAgentsSystemContentBlockParam`](ManagedAgentsSystemContentBlockParam.md)[]

System content blocks to append. Text-only.

***

### type

> **type**: `"system.message"`

Any of "system.message".
