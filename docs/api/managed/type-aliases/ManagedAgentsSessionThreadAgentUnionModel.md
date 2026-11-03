[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [managed](../README.md) / ManagedAgentsSessionThreadAgentUnionModel

# Type Alias: ManagedAgentsSessionThreadAgentUnionModel

> **ManagedAgentsSessionThreadAgentUnionModel** = `string` \| \{ `context_window?`: `number`; `effective_context_window?`: `number`; `effort?`: `string`; `id?`: [`ManagedAgentsModel`](ManagedAgentsModel.md); `inference_geo?`: `string`; `speed?`: [`ManagedAgentsModelConfigSpeed`](ManagedAgentsModelConfigSpeed.md); \}

## Union Members

`string`

***

### Type Literal

\{ `context_window?`: `number`; `effective_context_window?`: `number`; `effort?`: `string`; `id?`: [`ManagedAgentsModel`](ManagedAgentsModel.md); `inference_geo?`: `string`; `speed?`: [`ManagedAgentsModelConfigSpeed`](ManagedAgentsModelConfigSpeed.md); \}

#### context\_window?

> `optional` **context\_window?**: `number`

#### effective\_context\_window?

> `optional` **effective\_context\_window?**: `number`

#### effort?

> `optional` **effort?**: `string`

This field is from variant `ManagedAgentsModelConfig`.

#### id?

> `optional` **id?**: [`ManagedAgentsModel`](ManagedAgentsModel.md)

This field is from variant `ManagedAgentsModelConfig`.

#### inference\_geo?

> `optional` **inference\_geo?**: `string`

This field is from variant `ManagedAgentsModelConfig`.

#### ~~speed?~~

> `optional` **speed?**: [`ManagedAgentsModelConfigSpeed`](ManagedAgentsModelConfigSpeed.md)

##### Deprecated

Managed model configuration no longer includes speed.
