[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [managed](../README.md) / ManagedAgentsBudgetLimit

# Interface: ManagedAgentsBudgetLimit

A hard spend ceiling. The session stops issuing new model requests once the
tracked list cost reaches `max_list_cost`.

## Properties

### max\_list\_cost

> **max\_list\_cost**: [`MonetaryAmount`](MonetaryAmount.md)

A monetary amount in a specific currency.

***

### type

> **type**: `"limit"`

Any of "limit".
