[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [managed](../README.md) / ManagedAgentsScheduleParams

# Interface: ManagedAgentsScheduleParams

5-field POSIX cron schedule. Literal wall-clock matching in the configured
timezone.

## Properties

### expression

> **expression**: `string`

5-field POSIX cron expression: minute hour day-of-month month day-of-week (e.g.,
"0 9 \* \* 1-5" for weekdays at 9am). Day-of-week is 0-7 where 0 and 7 both mean
Sunday. Extended cron syntax - seconds or year fields, and the special
characters L, W, #, and ? - is not supported, nor are predefined shortcuts
(@daily).

***

### timezone

> **timezone**: `string`

Required. IANA timezone identifier (e.g., "America/Los_Angeles", "UTC").
Validated against the IANA timezone database.

***

### type

> **type**: `"cron"`

Any of "cron".
