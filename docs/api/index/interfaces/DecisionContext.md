[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [index](../README.md) / DecisionContext

# Interface: DecisionContext

Session fields and preparation metadata may be absent on running/failed records.

## Indexable

> \[`key`: `string`\]: `unknown`

## Properties

### anchor\_event\_id?

> `optional` **anchor\_event\_id?**: `string`

***

### estimated\_input\_tokens?

> `optional` **estimated\_input\_tokens?**: `number`

Estimate of the full model request, separate from billed usage.

***

### first\_event\_id?

> `optional` **first\_event\_id?**: `string`

***

### included\_event\_count?

> `optional` **included\_event\_count?**: `number`

***

### included\_segment\_count?

> `optional` **included\_segment\_count?**: `number`

***

### last\_event\_id?

> `optional` **last\_event\_id?**: `string`

***

### max\_input\_tokens?

> `optional` **max\_input\_tokens?**: `number`

***

### mode

> **mode**: `"session"` \| `"state"`

***

### policy\_version?

> `optional` **policy\_version?**: `string`

***

### scan\_limited?

> `optional` **scan\_limited?**: `boolean`

***

### snapshot\_at?

> `optional` **snapshot\_at?**: `string`

***

### token\_estimator?

> `optional` **token\_estimator?**: `string`

***

### truncated?

> `optional` **truncated?**: `boolean`

***

### truncation\_reasons?

> `optional` **truncation\_reasons?**: `string`[]
