[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [managed](../README.md) / ManagedAgentsUserMessageEvent

# Interface: ManagedAgentsUserMessageEvent

A user message event in the session conversation.

## Properties

### content

> **content**: [`ManagedAgentsUserMessageEventContentUnion`](../type-aliases/ManagedAgentsUserMessageEventContentUnion.md)[]

Array of content blocks comprising the user message.

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

> **type**: `"user.message"`

Any of "user.message".
