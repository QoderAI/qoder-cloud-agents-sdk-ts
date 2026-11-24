[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [forward](../README.md) / AgentCard

# Interface: AgentCard

A2A discovery only. Returned URLs are metadata and are never fetched automatically.

## Indexable

> \[`key`: `string`\]: `unknown`

## Properties

### defaultInputModes

> **defaultInputModes**: `string`[]

***

### defaultOutputModes

> **defaultOutputModes**: `string`[]

***

### description

> **description**: `string`

***

### name

> **name**: `string`

***

### skills

> **skills**: [`TemplateA2ASkill`](TemplateA2ASkill.md)[]

***

### supportedInterfaces?

> `optional` **supportedInterfaces?**: [`AgentCardSupportedInterface`](AgentCardSupportedInterface.md)[]

A2A 1.0 invocation interfaces.

***

### url?

> `optional` **url?**: `string`

A2A 0.3 invocation endpoint.

***

### version

> **version**: `string`
