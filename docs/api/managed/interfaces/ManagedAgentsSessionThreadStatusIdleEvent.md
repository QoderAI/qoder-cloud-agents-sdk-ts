[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [managed](../README.md) / ManagedAgentsSessionThreadStatusIdleEvent

# Interface: ManagedAgentsSessionThreadStatusIdleEvent

A session thread has yielded and is awaiting input. Emitted on the thread's own
stream and cross-posted to the primary stream for child threads.

## Properties

### agent\_name

> **agent\_name**: `string`

Name of the agent the thread runs.

***

### id

> **id**: `string`

Unique identifier for this event.

***

### processed\_at

> **processed\_at**: `string`

A timestamp in RFC 3339 format

***

### session\_thread\_id

> **session\_thread\_id**: `string`

Public sthr\_ ID of the thread that went idle.

***

### stop\_reason

> **stop\_reason**: [`ManagedAgentsSessionThreadStatusIdleEventStopReasonUnion`](../type-aliases/ManagedAgentsSessionThreadStatusIdleEventStopReasonUnion.md)

The agent completed its turn naturally and is ready for the next user message.

***

### type

> **type**: `"session.thread_status_idle"`

Any of "session.thread_status_idle".
