[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [managed](../README.md) / ManagedAgentsSessionThreadStats

# Interface: ManagedAgentsSessionThreadStats

Timing statistics for a session thread.

## Properties

### active\_seconds?

> `optional` **active\_seconds?**: `number`

Cumulative time in seconds the thread spent actively running. Excludes idle
time.

***

### duration\_seconds?

> `optional` **duration\_seconds?**: `number`

Elapsed time since thread creation in seconds. For archived threads, frozen at
the final update.

***

### startup\_seconds?

> `optional` **startup\_seconds?**: `number`

Time in seconds for the thread to begin running. Zero for child threads, which
start immediately.
