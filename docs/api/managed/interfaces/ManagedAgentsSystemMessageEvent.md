[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [managed](../README.md) / ManagedAgentsSystemMessageEvent

# Interface: ManagedAgentsSystemMessageEvent

A mid-conversation system message event. Carries system-role content that is
appended to the session as a `role: "system"` turn.

## Properties

### content

> **content**: [`ManagedAgentsSystemContentBlock`](ManagedAgentsSystemContentBlock.md)[]

System content blocks. Text-only.

***

### id

> **id**: `string`

Unique identifier for this event.

***

### processed\_at?

> `optional` **processed\_at?**: `string` \| `null`

A timestamp in RFC 3339 format

***

### type

> **type**: `"system.message"`

Any of "system.message".
