[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [managed](../README.md) / ManagedAgentsUserInterruptEvent

# Interface: ManagedAgentsUserInterruptEvent

An interrupt event that pauses agent execution and returns control to the user.

## Properties

### id

> **id**: `string`

Unique identifier for this event.

***

### processed\_at?

> `optional` **processed\_at?**: `string` \| `null`

A timestamp in RFC 3339 format

***

### session\_thread\_id?

> `optional` **session\_thread\_id?**: `string` \| `null`

If absent, interrupts every non-archived thread in a multiagent session (or the
primary alone in a single-agent session). If present, interrupts only the named
thread.

***

### type

> **type**: `"user.interrupt"`

Any of "user.interrupt".
