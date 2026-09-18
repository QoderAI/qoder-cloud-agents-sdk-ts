[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [managed](../README.md) / ManagedAgentsDeploymentUserDefineOutcomeEvent

# Interface: ManagedAgentsDeploymentUserDefineOutcomeEvent

An outcome the agent should work toward. The agent begins work on receipt.

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

> **rubric**: [`ManagedAgentsDeploymentUserDefineOutcomeEventRubricUnion`](../type-aliases/ManagedAgentsDeploymentUserDefineOutcomeEventRubricUnion.md)

Rubric for grading the quality of an outcome.

***

### type

> **type**: `"user.define_outcome"`

Any of "user.define_outcome".
