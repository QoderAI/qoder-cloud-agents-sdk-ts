[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [managed](../README.md) / DreamModelConfig

# Interface: DreamModelConfig

Model identifier and configuration applied to every pipeline stage. Same wire
shape as the Agents API ModelConfig.

## Properties

### id

> **id**: `string`

Model identifier, e.g. "claude-opus-5". 1-256 characters.

***

### speed?

> `optional` **speed?**: [`DreamModelConfigSpeed`](../type-aliases/DreamModelConfigSpeed.md)

Inference speed mode. `fast` provides significantly faster output token
generation at premium pricing. Not all models support `fast`; invalid
combinations are rejected at create time.

Any of "standard", "fast".
