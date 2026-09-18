[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [forward](../README.md) / EffectiveConfig

# Interface: EffectiveConfig

## Indexable

> \[`key`: `string`\]: `unknown`

Additional fields are preserved verbatim by the SDK.

## Properties

### agent

> **agent**: [`EffectiveConfigAgent`](EffectiveConfigAgent.md)

编译后的 Agent 配置。

***

### agent\_effective\_hash

> **agent\_effective\_hash**: `string`

Agent 部分编译结果 hash。

***

### effective\_hash

> **effective\_hash**: `string`

完整有效配置 hash。

***

### id

> **id**: `string`

***

### identity\_id

> **identity\_id**: `string`

***

### session

> **session**: [`EffectiveConfigSession`](EffectiveConfigSession.md)

编译后的 Session 默认配置。

***

### session\_effective\_hash

> **session\_effective\_hash**: `string`

Session 部分编译结果 hash。

***

### template\_id

> **template\_id**: `string`

***

### type

> **type**: `string`

固定为 `effective_spec`。
