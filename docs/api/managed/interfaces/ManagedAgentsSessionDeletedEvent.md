[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [managed](../README.md) / ManagedAgentsSessionDeletedEvent

# Interface: ManagedAgentsSessionDeletedEvent

Emitted when a session has been deleted. Terminates any active event stream — no
further events will be emitted for this session.

## Properties

### id

> **id**: `string`

Unique identifier for this event.

***

### processed\_at

> **processed\_at**: `string`

A timestamp in RFC 3339 format

***

### type

> **type**: `"session.deleted"`

Any of "session.deleted".
