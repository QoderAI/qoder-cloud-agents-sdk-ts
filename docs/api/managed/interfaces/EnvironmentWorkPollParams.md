[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [managed](../README.md) / EnvironmentWorkPollParams

# Interface: EnvironmentWorkPollParams

## Properties

### betas?

> `optional` **betas?**: `string`[]

Optional header to specify the beta version(s) you want to use.

***

### block\_ms?

> `optional` **block\_ms?**: `number`

How long to wait for work to arrive before returning. Must be 1-999 in
milliseconds. Defaults to non-blocking (returns immediately if no work is
available).

***

### qoder\_worker\_id?

> `optional` **qoder\_worker\_id?**: `string`

Unique identifier for the specific worker polling, used to track aggregated
environment-level work metrics in Console

***

### reclaim\_older\_than\_ms?

> `optional` **reclaim\_older\_than\_ms?**: `number`

Reclaim unacknowledged work items older than this many milliseconds. If omitted,
uses the default (5000ms).
