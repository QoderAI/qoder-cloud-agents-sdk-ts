[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [managed](../README.md) / ManagedAgentsSessionStats

# Interface: ManagedAgentsSessionStats

Timing statistics for a session.

## Properties

### active\_seconds?

> `optional` **active\_seconds?**: `number`

Cumulative time in seconds the session spent in `running` status. Excludes idle
time.

***

### duration\_seconds?

> `optional` **duration\_seconds?**: `number`

Elapsed time since session creation in seconds. For terminated sessions, frozen
at the final update.
