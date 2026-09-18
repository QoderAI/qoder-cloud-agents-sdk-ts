[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [managed](../README.md) / ManagedAgentsModelConfig

# Type Alias: ManagedAgentsModelConfig

> **ManagedAgentsModelConfig** = `string` \| \{ `context_window?`: `number`; `effort?`: [`ManagedAgentsModelConfigEffortUnion`](ManagedAgentsModelConfigEffortUnion.md); `id`: [`ManagedAgentsModel`](ManagedAgentsModel.md); `inference_geo?`: `string`; `speed?`: [`ManagedAgentsModelConfigSpeed`](ManagedAgentsModelConfigSpeed.md); \}

Model identifier and configuration.

## Union Members

`string`

***

### Type Literal

\{ `context_window?`: `number`; `effort?`: [`ManagedAgentsModelConfigEffortUnion`](ManagedAgentsModelConfigEffortUnion.md); `id`: [`ManagedAgentsModel`](ManagedAgentsModel.md); `inference_geo?`: `string`; `speed?`: [`ManagedAgentsModelConfigSpeed`](ManagedAgentsModelConfigSpeed.md); \}

#### context\_window?

> `optional` **context\_window?**: `number`

#### effort?

> `optional` **effort?**: [`ManagedAgentsModelConfigEffortUnion`](ManagedAgentsModelConfigEffortUnion.md)

How hard Claude works on each turn. Sets `output_config.effort` on every
Messages call the session makes.

#### id

> **id**: [`ManagedAgentsModel`](ManagedAgentsModel.md)

The model that will power your agent.

See [models](https://docs.qoder.com/cloud-agents/api/models/list) for additional
details and options.

#### inference\_geo?

> `optional` **inference\_geo?**: `string`

Geographic region for model inference. When unset, requests fall through to the
workspace's default_inference_geo.

#### speed?

> `optional` **speed?**: [`ManagedAgentsModelConfigSpeed`](ManagedAgentsModelConfigSpeed.md)

Inference speed mode. `fast` provides significantly faster output token
generation at premium pricing. Not all models support `fast`; invalid
combinations are rejected at create time.

Any of "standard", "fast".
