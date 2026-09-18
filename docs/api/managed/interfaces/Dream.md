[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [managed](../README.md) / Dream

# Interface: Dream

An asynchronous memory-consolidation job that reads a memory store plus a set of
session transcripts and writes consolidated memories into an output memory store
— a new store by default, or an existing store chosen via output_behavior. The
Dreams API is in research preview: the request and response shapes are volatile
and may change without the deprecation period that applies to
generally-available endpoints.

## Properties

### archived\_at

> **archived\_at**: `string` \| `null`

A timestamp in RFC 3339 format

***

### created\_at

> **created\_at**: `string`

A timestamp in RFC 3339 format

***

### ended\_at

> **ended\_at**: `string` \| `null`

A timestamp in RFC 3339 format

***

### error

> **error**: [`DreamError`](DreamError.md) \| `null`

Failure detail for a Dream whose `status` is `failed`.

***

### id

> **id**: `string`

***

### inputs

> **inputs**: [`DreamInputUnion`](../type-aliases/DreamInputUnion.md)[]

***

### instructions

> **instructions**: `string`

***

### model

> **model**: [`DreamModelConfig`](DreamModelConfig.md)

Model identifier and configuration applied to every pipeline stage. Same wire
shape as the Agents API ModelConfig.

***

### output\_behavior

> **output\_behavior**: [`OutputBehaviorUnion`](../type-aliases/OutputBehaviorUnion.md)

The default destination: the job creates a new output memory store as a clone of
the memory_store input and writes the consolidated memories into it. The input
store is never mutated.

***

### outputs

> **outputs**: [`DreamOutput`](DreamOutput.md)[]

***

### session\_id

> **session\_id**: `string` \| `null`

***

### status

> **status**: [`DreamStatus`](../type-aliases/DreamStatus.md)

Lifecycle status of a Dream.

Any of "pending", "running", "completed", "failed", "canceled".

***

### type

> **type**: `"dream"`

Any of "dream".

***

### usage

> **usage**: [`DreamUsage`](DreamUsage.md)

Cumulative token usage for the dream across every pipeline stage.
