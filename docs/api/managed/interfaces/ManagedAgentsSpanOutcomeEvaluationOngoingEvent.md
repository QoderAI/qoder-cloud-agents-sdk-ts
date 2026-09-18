[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [managed](../README.md) / ManagedAgentsSpanOutcomeEvaluationOngoingEvent

# Interface: ManagedAgentsSpanOutcomeEvaluationOngoingEvent

Periodic heartbeat emitted while an outcome evaluation cycle is in progress.
Distinguishes 'evaluation is actively running' from 'evaluation is stuck'
between the corresponding `span.outcome_evaluation_start` and
`span.outcome_evaluation_end` events.

## Properties

### id

> **id**: `string`

Unique identifier for this event.

***

### iteration

> **iteration**: `number`

0-indexed revision cycle, matching the corresponding
`span.outcome_evaluation_start`.

***

### outcome\_id

> **outcome\_id**: `string`

The `outc_` ID of the outcome being evaluated.

***

### processed\_at

> **processed\_at**: `string`

A timestamp in RFC 3339 format

***

### type

> **type**: `"span.outcome_evaluation_ongoing"`

Any of "span.outcome_evaluation_ongoing".
