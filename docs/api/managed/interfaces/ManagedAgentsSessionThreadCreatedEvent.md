[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [managed](../README.md) / ManagedAgentsSessionThreadCreatedEvent

# Interface: ManagedAgentsSessionThreadCreatedEvent

Emitted when a subagent is spawned as a new thread. Written to the parent
thread's output stream so clients observing the session see child creation.

## Properties

### agent\_name

> **agent\_name**: `string`

Name of the callable agent the thread runs.

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

Public `sthr_` ID of the newly created thread.

***

### type

> **type**: `"session.thread_created"`

Any of "session.thread_created".
