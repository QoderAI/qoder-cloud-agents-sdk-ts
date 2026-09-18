[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [managed](../README.md) / ManagedAgentsStreamSessionThreadEventsUnionUsage

# Interface: ManagedAgentsStreamSessionThreadEventsUnionUsage

## Properties

### active\_seconds?

> `optional` **active\_seconds?**: `number`

This field is from variant `ManagedAgentsSessionUsageSnapshot`.

***

### cache\_creation?

> `optional` **cache\_creation?**: [`ManagedAgentsCacheCreationUsage`](ManagedAgentsCacheCreationUsage.md)

This field is from variant `ManagedAgentsSessionUsageSnapshot`.

***

### cache\_creation\_input\_tokens?

> `optional` **cache\_creation\_input\_tokens?**: `number`

This field is from variant `ManagedAgentsSpanModelUsage`.

***

### cache\_read\_input\_tokens?

> `optional` **cache\_read\_input\_tokens?**: `number`

***

### input\_tokens?

> `optional` **input\_tokens?**: `number`

***

### list\_cost?

> `optional` **list\_cost?**: [`MonetaryAmount`](MonetaryAmount.md)

This field is from variant `ManagedAgentsSessionUsageSnapshot`.

***

### output\_tokens?

> `optional` **output\_tokens?**: `number`

***

### server\_tool\_use?

> `optional` **server\_tool\_use?**: [`ManagedAgentsServerToolUsage`](ManagedAgentsServerToolUsage.md)

This field is from variant `ManagedAgentsSessionUsageSnapshot`.

***

### speed?

> `optional` **speed?**: [`ManagedAgentsSpanModelUsageSpeed`](../type-aliases/ManagedAgentsSpanModelUsageSpeed.md)

This field is from variant `ManagedAgentsSpanModelUsage`.
