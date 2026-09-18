[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [managed](../README.md) / ManagedAgentsOutcomeEvaluationResource

# Interface: ManagedAgentsOutcomeEvaluationResource

Evaluation state for a single outcome defined via a `define_outcome` event.

## Properties

### completed\_at

> **completed\_at**: `string`

A timestamp in RFC 3339 format

***

### description

> **description**: `string`

What the agent should produce.

***

### explanation

> **explanation**: `string`

Grader's verdict text from the most recent evaluation. For `satisfied`, explains
why criteria are met; for `needs_revision` (intermediate), what's missing; for
`failed`, why unrecoverable.

***

### iteration

> **iteration**: `number`

0-indexed revision cycle the outcome is currently on.

***

### outcome\_id

> **outcome\_id**: `string`

Server-generated outc\_ ID for this outcome.

***

### result

> **result**: `string`

Current evaluation state. `pending` before the agent begins work; `running`
while producing or revising; `evaluating` while the grader scores;
`satisfied`/`max_iterations_reached`/`failed`/`interrupted` are terminal.

***

### type

> **type**: `"outcome_evaluation"`

Any of "outcome_evaluation".
