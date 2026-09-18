[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [managed](../README.md) / DreamNewParams

# Interface: DreamNewParams

## Properties

### betas?

> `optional` **betas?**: `string`[]

Optional header to specify the beta version(s) you want to use.

***

### inputs

> **inputs**: [`DreamInputUnionParam`](../type-aliases/DreamInputUnionParam.md)[]

***

### instructions?

> `optional` **instructions?**: `string` \| `null`

***

### model

> **model**: [`DreamNewParamsModelUnion`](../type-aliases/DreamNewParamsModelUnion.md)

Model identifier and configuration applied to every pipeline stage.

***

### output\_behavior?

> `optional` **output\_behavior?**: [`OutputBehaviorUnionParam`](../type-aliases/OutputBehaviorUnionParam.md) \| `null`

The default destination: the job creates a new output memory store as a clone of
the memory_store input and writes the consolidated memories into it. The input
store is never mutated.

***

### workspace\_id?

> `optional` **workspace\_id?**: `string`
