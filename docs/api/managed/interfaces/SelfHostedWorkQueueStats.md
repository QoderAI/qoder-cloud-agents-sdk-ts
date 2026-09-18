[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [managed](../README.md) / SelfHostedWorkQueueStats

# Interface: SelfHostedWorkQueueStats

Statistics about the work queue for an environment.

Uses Redis Stream consumer group metrics for O(1) queries.

## Properties

### depth

> **depth**: `number`

Number of work items waiting to be picked up (lag from consumer group)

***

### oldest\_queued\_at

> **oldest\_queued\_at**: `string`

RFC 3339 timestamp of oldest item in the work stream (includes both queued and
pending items), null if stream empty

***

### pending

> **pending**: `number`

Number of work items being processed (polled but not acknowledged)

***

### type?

> `optional` **type?**: `"work_queue_stats"`

The type of object

***

### workers\_polling

> **workers\_polling**: `number`

Number of workers that have polled for work in the last 30 seconds. Requires
worker_id to be sent with poll requests.
