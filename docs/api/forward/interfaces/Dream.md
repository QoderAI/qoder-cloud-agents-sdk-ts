[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [forward](../README.md) / Dream

# Interface: Dream

## Indexable

> \[`key`: `string`\]: `unknown`

## Properties

### archived\_at

> **archived\_at**: `string` \| `null`

***

### created\_at

> **created\_at**: `string`

***

### ended\_at

> **ended\_at**: `string` \| `null`

***

### error

> **error**: [`DreamError`](DreamError.md) \| `null`

***

### id

> **id**: `string`

***

### inputs

> **inputs**: [`DreamInput`](../type-aliases/DreamInput.md)[]

***

### instructions

> **instructions**: `string`

***

### model

> **model**: [`DreamModelConfig`](DreamModelConfig.md)

***

### outputs

> **outputs**: [`DreamOutput`](DreamOutput.md)[]

***

### status

> **status**: `"pending"` \| `"running"` \| `"completed"` \| `"failed"` \| `"canceled"` \| `string` & `object`

***

### type

> **type**: `"dream"`

***

### usage

> **usage**: [`DreamUsage`](DreamUsage.md)
