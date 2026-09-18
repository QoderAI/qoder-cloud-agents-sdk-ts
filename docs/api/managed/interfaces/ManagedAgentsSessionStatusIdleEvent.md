[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [managed](../README.md) / ManagedAgentsSessionStatusIdleEvent

# Interface: ManagedAgentsSessionStatusIdleEvent

Indicates the agent has paused and is awaiting user input.

## Properties

### id

> **id**: `string`

Unique identifier for this event.

***

### processed\_at

> **processed\_at**: `string`

A timestamp in RFC 3339 format

***

### stop\_reason

> **stop\_reason**: [`ManagedAgentsSessionStatusIdleEventStopReasonUnion`](../type-aliases/ManagedAgentsSessionStatusIdleEventStopReasonUnion.md)

The agent completed its turn naturally and is ready for the next user message.

***

### type

> **type**: `"session.status_idle"`

Any of "session.status_idle".
