[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [managed](../README.md) / ManagedAgentsSchedule

# Interface: ManagedAgentsSchedule

5-field POSIX cron schedule with computed runtime timestamps.

## Properties

### expression

> **expression**: `string`

5-field POSIX cron expression: minute hour day-of-month month day-of-week (e.g.,
"0 9 \* \* 1-5" for weekdays at 9am). Day-of-week is 0-7 where 0 and 7 both mean
Sunday. Extended cron syntax - seconds or year fields, and the special
characters L, W, #, and ? - is not supported, nor are predefined shortcuts
(@daily).

***

### last\_run\_at?

> `optional` **last\_run\_at?**: `string` \| `null`

A timestamp in RFC 3339 format

***

### timezone

> **timezone**: `string`

IANA timezone identifier (e.g., "America/Los_Angeles", "UTC").

***

### type

> **type**: `"cron"`

Any of "cron".

***

### upcoming\_runs\_at?

> `optional` **upcoming\_runs\_at?**: `string`[]

Up to 5 timestamps of upcoming cron occurrences. Non-empty for active and paused
deployments (reflects what the schedule would do if unpaused); empty once the
deployment is archived (`archived_at` set). Each fire is offset by a small
per-schedule jitter, so a run will actually start at or shortly after its listed
time.
