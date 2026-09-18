[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [managed](../README.md) / ManagedAgentsAgentThreadMessageSentEvent

# Interface: ManagedAgentsAgentThreadMessageSentEvent

Observability event emitted to the sender's output stream when an agent-to-agent
message is sent.

## Properties

### content

> **content**: [`ManagedAgentsAgentThreadMessageSentEventContentUnion`](../type-aliases/ManagedAgentsAgentThreadMessageSentEventContentUnion.md)[]

Message content blocks.

***

### id

> **id**: `string`

Unique identifier for this event.

***

### processed\_at

> **processed\_at**: `string`

A timestamp in RFC 3339 format

***

### to\_agent\_name?

> `optional` **to\_agent\_name?**: `string` \| `null`

Name of the callable agent this message was sent to. Absent when sent to the
primary agent.

***

### to\_session\_thread\_id

> **to\_session\_thread\_id**: `string`

Public `sthr_` ID of the thread the message was sent to.

***

### type

> **type**: `"agent.thread_message_sent"`

Any of "agent.thread_message_sent".
