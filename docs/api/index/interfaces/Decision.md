[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [index](../README.md) / Decision

# Interface: Decision

## Indexable

> \[`key`: `string`\]: `unknown`

## Properties

### answers

> **answers**: [`DecisionAnswer`](DecisionAnswer.md)[]

***

### completed\_at

> **completed\_at**: `string` \| `null`

***

### context

> **context**: [`DecisionContext`](DecisionContext.md)

***

### created\_at

> **created\_at**: `string`

***

### error

> **error**: [`DecisionError`](DecisionError.md) \| `null`

***

### id

> **id**: `string`

***

### questions

> **questions**: [`DecisionQuestion`](DecisionQuestion.md)[]

***

### session\_id

> **session\_id**: `string` \| `null`

Null for explicit-state input.

***

### source

> **source**: `string`

***

### status

> **status**: `"running"` \| `"completed"` \| `"failed"`
