[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [managed](../README.md) / ManagedAgentsModelConfigParams

# Type Alias: ManagedAgentsModelConfigParams

> **ManagedAgentsModelConfigParams** = `string` \| \{ `context_window?`: `number` \| `null`; `effort?`: [`ManagedAgentsModelConfigParamsEffortUnion`](ManagedAgentsModelConfigParamsEffortUnion.md) \| `null`; `id`: [`ManagedAgentsModel`](ManagedAgentsModel.md); `inference_geo?`: `string` \| `null`; `speed?`: [`ManagedAgentsModelConfigParamsSpeed`](ManagedAgentsModelConfigParamsSpeed.md) \| `null`; \}

An object that defines additional configuration control over model use

## Union Members

`string`

***

### Type Literal

\{ `context_window?`: `number` \| `null`; `effort?`: [`ManagedAgentsModelConfigParamsEffortUnion`](ManagedAgentsModelConfigParamsEffortUnion.md) \| `null`; `id`: [`ManagedAgentsModel`](ManagedAgentsModel.md); `inference_geo?`: `string` \| `null`; `speed?`: [`ManagedAgentsModelConfigParamsSpeed`](ManagedAgentsModelConfigParamsSpeed.md) \| `null`; \}

#### context\_window?

> `optional` **context\_window?**: `number` \| `null`

#### effort?

> `optional` **effort?**: [`ManagedAgentsModelConfigParamsEffortUnion`](ManagedAgentsModelConfigParamsEffortUnion.md) \| `null`

How hard Claude works on each inference call. Accepts a bare level string
(`"high"`) or `{"type": "high"}`. On create, omitting it resolves the per-model
default; on update, omitting it leaves the stored value unchanged.

#### id

> **id**: [`ManagedAgentsModel`](ManagedAgentsModel.md)

The model that will power your agent.

See [models](https://docs.qoder.com/cloud-agents/api/models/list) for additional
details and options.

#### inference\_geo?

> `optional` **inference\_geo?**: `string` \| `null`

Geographic region for model inference. When unset, requests fall through to the
workspace's default_inference_geo. On update, `model` is whole-object
replacement — omitting inference_geo clears it.

#### speed?

> `optional` **speed?**: [`ManagedAgentsModelConfigParamsSpeed`](ManagedAgentsModelConfigParamsSpeed.md) \| `null`

Inference speed mode. `fast` provides significantly faster output token
generation at premium pricing. Not all models support `fast`; invalid
combinations are rejected at create time.

Any of "standard", "fast".
