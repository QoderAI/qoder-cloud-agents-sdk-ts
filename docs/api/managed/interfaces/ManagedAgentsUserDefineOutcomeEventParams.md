[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [managed](../README.md) / ManagedAgentsUserDefineOutcomeEventParams

# Interface: ManagedAgentsUserDefineOutcomeEventParams

Parameters for defining an outcome the agent should work toward. The agent
begins work on receipt.

## Properties

### description

> **description**: `string`

What the agent should produce. This is the task specification.

***

### max\_iterations?

> `optional` **max\_iterations?**: `number` \| `null`

Eval→revision cycles before giving up. Default 3, max 20.

***

### rubric

> **rubric**: [`ManagedAgentsUserDefineOutcomeEventParamsRubricUnion`](../type-aliases/ManagedAgentsUserDefineOutcomeEventParamsRubricUnion.md)

Rubric for grading the quality of an outcome.

***

### type

> **type**: `"user.define_outcome"`

Any of "user.define_outcome".
