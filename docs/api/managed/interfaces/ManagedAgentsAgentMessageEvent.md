[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [managed](../README.md) / ManagedAgentsAgentMessageEvent

# Interface: ManagedAgentsAgentMessageEvent

An agent response event in the session conversation.

## Properties

### content

> **content**: [`ManagedAgentsAgentMessageEventContentUnion`](../type-aliases/ManagedAgentsAgentMessageEventContentUnion.md)[]

Array of text blocks comprising the agent response.

***

### id

> **id**: `string`

Unique identifier for this event.

***

### processed\_at

> **processed\_at**: `string`

A timestamp in RFC 3339 format

***

### type

> **type**: `"agent.message"`

Any of "agent.message".
