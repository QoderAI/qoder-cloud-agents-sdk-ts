[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [managed](../README.md) / ModelCapabilities

# Interface: ModelCapabilities

Model capability information.

## Properties

### batch

> **batch**: [`CapabilitySupport`](CapabilitySupport.md)

Whether the model supports the Batch API.

***

### citations

> **citations**: [`CapabilitySupport`](CapabilitySupport.md)

Whether the model supports citation generation.

***

### code\_execution

> **code\_execution**: [`CapabilitySupport`](CapabilitySupport.md)

Whether the model supports code execution tools.

***

### context\_management

> **context\_management**: [`ContextManagementCapability`](ContextManagementCapability.md)

Context management support and available strategies.

***

### effort

> **effort**: [`EffortCapability`](EffortCapability.md)

Effort (reasoning_effort) support and available levels.

***

### image\_input

> **image\_input**: [`CapabilitySupport`](CapabilitySupport.md)

Whether the model accepts image content blocks.

***

### pdf\_input

> **pdf\_input**: [`CapabilitySupport`](CapabilitySupport.md)

Whether the model accepts PDF content blocks.

***

### structured\_outputs

> **structured\_outputs**: [`CapabilitySupport`](CapabilitySupport.md)

Whether the model supports structured output / JSON mode / strict tool schemas.

***

### thinking

> **thinking**: [`ThinkingCapability`](ThinkingCapability.md)

Thinking capability and supported type configurations.
