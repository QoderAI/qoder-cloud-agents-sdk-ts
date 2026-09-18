[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [managed](../README.md) / ManagedAgentsSpanOutcomeEvaluationStartEvent

# Interface: ManagedAgentsSpanOutcomeEvaluationStartEvent

Emitted when an outcome evaluation cycle begins.

## Properties

### id

> **id**: `string`

Unique identifier for this event.

***

### iteration

> **iteration**: `number`

0-indexed revision cycle. 0 is the first evaluation; 1 is the re-evaluation
after the first revision; etc.

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

> **type**: `"span.outcome_evaluation_start"`

Any of "span.outcome_evaluation_start".
