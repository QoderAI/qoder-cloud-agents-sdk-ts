[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [managed](../README.md) / ManagedAgentsAgentThreadMessageReceivedEvent

# Interface: ManagedAgentsAgentThreadMessageReceivedEvent

Delivery event written to the target thread's input stream when an
agent-to-agent message arrives.

## Properties

### content

> **content**: [`ManagedAgentsAgentThreadMessageReceivedEventContentUnion`](../type-aliases/ManagedAgentsAgentThreadMessageReceivedEventContentUnion.md)[]

Message content blocks.

***

### from\_agent\_name?

> `optional` **from\_agent\_name?**: `string` \| `null`

Name of the callable agent this message came from. Absent when received from the
primary agent.

***

### from\_session\_thread\_id

> **from\_session\_thread\_id**: `string`

Public `sthr_` ID of the thread that sent the message.

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

> **type**: `"agent.thread_message_received"`

Any of "agent.thread_message_received".
