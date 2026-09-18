[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [managed](../README.md) / ManagedAgentsUserDefineOutcomeEvent

# Interface: ManagedAgentsUserDefineOutcomeEvent

Echo of a `user.define_outcome` input event. Carries the server-generated
`outcome_id` that subsequent `span.outcome_evaluation_*` events reference.

## Properties

### description

> **description**: `string`

What the agent should produce. Copied from the input event.

***

### id

> **id**: `string`

Unique identifier for this event.

***

### max\_iterations

> **max\_iterations**: `number`

Evaluate-then-revise cycles before giving up. Default 3, max 20.

***

### outcome\_id

> **outcome\_id**: `string`

Server-generated `outc_` ID for this outcome. Referenced by
`span.outcome_evaluation_*` events and the session's `outcome_evaluations` list.

***

### processed\_at

> **processed\_at**: `string`

A timestamp in RFC 3339 format

***

### rubric

> **rubric**: [`ManagedAgentsUserDefineOutcomeEventRubricUnion`](../type-aliases/ManagedAgentsUserDefineOutcomeEventRubricUnion.md)

Rubric for grading the quality of an outcome.

***

### type

> **type**: `"user.define_outcome"`

Any of "user.define_outcome".
