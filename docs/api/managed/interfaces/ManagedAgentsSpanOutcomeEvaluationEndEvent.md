[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [managed](../README.md) / ManagedAgentsSpanOutcomeEvaluationEndEvent

# Interface: ManagedAgentsSpanOutcomeEvaluationEndEvent

Emitted when an outcome evaluation cycle completes. Carries the verdict and
aggregate token usage. A verdict of `needs_revision` means another evaluation
cycle follows; `satisfied`, `max_iterations_reached`, `failed`, or `interrupted`
are terminal — no further evaluation cycles follow.

## Properties

### explanation

> **explanation**: `string`

Human-readable explanation of the verdict. For `needs_revision`, describes which
criteria failed and why.

***

### id

> **id**: `string`

Unique identifier for this event.

***

### iteration

> **iteration**: `number`

0-indexed revision cycle, matching the corresponding
`span.outcome_evaluation_start`.

***

### outcome\_evaluation\_start\_id

> **outcome\_evaluation\_start\_id**: `string`

The id of the corresponding `span.outcome_evaluation_start` event.

***

### outcome\_id

> **outcome\_id**: `string`

The `outc_` ID of the outcome being evaluated.

***

### processed\_at

> **processed\_at**: `string`

A timestamp in RFC 3339 format

***

### result

> **result**: `string`

Evaluation verdict. 'satisfied': criteria met, session goes idle.
'needs_revision': criteria not met, another revision cycle follows.
'max_iterations_reached': evaluation budget exhausted with criteria still unmet
— one final acknowledgment turn follows before the session goes idle, but no
further evaluation runs. 'failed': grader determined the rubric does not apply
to the deliverables. 'interrupted': user sent an interrupt while evaluation was
in progress.

***

### type

> **type**: `"span.outcome_evaluation_end"`

Any of "span.outcome_evaluation_end".

***

### usage

> **usage**: [`ManagedAgentsSpanModelUsage`](ManagedAgentsSpanModelUsage.md)

Token usage for a single model request.
