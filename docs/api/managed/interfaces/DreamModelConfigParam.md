[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [managed](../README.md) / DreamModelConfigParam

# Interface: DreamModelConfigParam

Model identifier and configuration applied to every pipeline stage.

## Properties

### id

> **id**: `string`

Model identifier, e.g. "claude-opus-5". 1-256 characters.

***

### speed?

> `optional` **speed?**: [`DreamModelConfigParamSpeed`](../type-aliases/DreamModelConfigParamSpeed.md) \| `null`

Inference speed mode. `fast` provides significantly faster output token
generation at premium pricing. Not all models support `fast`; invalid
combinations are rejected at create time.

Any of "standard", "fast".
