[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [managed](../README.md) / ManagedAgentsUserInterruptEventParams

# Interface: ManagedAgentsUserInterruptEventParams

Parameters for sending an interrupt to pause the agent.

## Properties

### session\_thread\_id?

> `optional` **session\_thread\_id?**: `string` \| `null`

If absent, interrupts every non-archived thread in a multiagent session (or the
primary alone in a single-agent session). If present, interrupts only the named
thread.

***

### type

> **type**: `"user.interrupt"`

Any of "user.interrupt".
