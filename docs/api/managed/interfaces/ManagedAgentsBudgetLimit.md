[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [managed](../README.md) / ManagedAgentsBudgetLimit

# Interface: ManagedAgentsBudgetLimit

A total model and sandbox credit limit. Reaching it rejects the next user
message without interrupting the running turn.

## Properties

### max\_credit\_cost

> **max\_credit\_cost**: `string`

Positive decimal Credits with at most 12 integer and 2 fractional digits.

***

### type

> **type**: `"limit"`

Any of "limit".
