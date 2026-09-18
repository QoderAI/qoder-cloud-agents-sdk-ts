[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [managed](../README.md) / DreamUsage

# Interface: DreamUsage

Cumulative token usage for the dream across every pipeline stage.

## Properties

### cache\_creation\_input\_tokens

> **cache\_creation\_input\_tokens**: `number`

Total tokens used to create prompt-cache entries (sum of all TTL tiers).

***

### cache\_read\_input\_tokens

> **cache\_read\_input\_tokens**: `number`

Total tokens read from prompt cache.

***

### input\_tokens

> **input\_tokens**: `number`

Total uncached input tokens consumed across every pipeline stage.

***

### output\_tokens

> **output\_tokens**: `number`

Total output tokens generated across every pipeline stage.
