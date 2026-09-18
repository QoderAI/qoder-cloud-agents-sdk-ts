[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [managed](../README.md) / ManagedAgentsSessionUsage

# Interface: ManagedAgentsSessionUsage

Cumulative token usage for a session across all turns.

## Properties

### active\_seconds?

> `optional` **active\_seconds?**: `number`

Cumulative time in seconds during which the session had at least one thread in
running status. Overlapping activity from concurrent threads is counted once,
unlike `stats.active_seconds`, which sums each thread's own active time. This is
the duration the session's runtime cost is priced on.

***

### cache\_creation?

> `optional` **cache\_creation?**: [`ManagedAgentsCacheCreationUsage`](ManagedAgentsCacheCreationUsage.md)

Prompt-cache creation token usage broken down by cache lifetime.

***

### cache\_read\_input\_tokens?

> `optional` **cache\_read\_input\_tokens?**: `number`

Total tokens read from prompt cache.

***

### input\_tokens?

> `optional` **input\_tokens?**: `number`

Total input tokens consumed across all turns.

***

### list\_cost?

> `optional` **list\_cost?**: [`MonetaryAmount`](MonetaryAmount.md) \| `null`

A monetary amount in a specific currency.

***

### output\_tokens?

> `optional` **output\_tokens?**: `number`

Total output tokens generated across all turns.

***

### server\_tool\_use?

> `optional` **server\_tool\_use?**: [`ManagedAgentsServerToolUsage`](ManagedAgentsServerToolUsage.md) \| `null`

Cumulative count of server-executed tool invocations, broken down by tool.
