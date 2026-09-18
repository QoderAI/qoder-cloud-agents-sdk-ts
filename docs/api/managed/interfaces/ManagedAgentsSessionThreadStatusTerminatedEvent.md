[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [managed](../README.md) / ManagedAgentsSessionThreadStatusTerminatedEvent

# Interface: ManagedAgentsSessionThreadStatusTerminatedEvent

A session thread has terminated and will accept no further input. Emitted on the
thread's own stream and cross-posted to the primary stream for child threads.

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

Public sthr\_ ID of the thread that terminated.

***

### type

> **type**: `"session.thread_status_terminated"`

Any of "session.thread_status_terminated".
