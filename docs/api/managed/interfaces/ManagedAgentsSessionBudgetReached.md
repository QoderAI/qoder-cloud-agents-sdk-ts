[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [managed](../README.md) / ManagedAgentsSessionBudgetReached

# Interface: ManagedAgentsSessionBudgetReached

The agent stopped because the session's tracked list cost reached its budget, or
because its usage includes a model with no list price (which the budget cannot
measure). Raise the budget to continue — or, if raising is rejected because a
model has no list price, remove the budget.

## Properties

### type

> **type**: `"budget_reached"`

Any of "budget_reached".
