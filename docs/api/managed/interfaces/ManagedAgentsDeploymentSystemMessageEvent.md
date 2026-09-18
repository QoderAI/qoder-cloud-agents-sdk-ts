[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [managed](../README.md) / ManagedAgentsDeploymentSystemMessageEvent

# Interface: ManagedAgentsDeploymentSystemMessageEvent

Privileged context for the accompanying turn and all subsequent turns, appended
to the session's system context as a `role: "system"` turn rather than replacing
the top-level system prompt.

## Properties

### content

> **content**: [`ManagedAgentsSystemContentBlock`](ManagedAgentsSystemContentBlock.md)[]

System content blocks to append. Text-only.

***

### type

> **type**: `"system.message"`

Any of "system.message".
