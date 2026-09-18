[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [managed](../README.md) / ManagedAgentsMemoryStoreResourceConfig

# Interface: ManagedAgentsMemoryStoreResourceConfig

A memory store attached to each session created from this deployment.

## Properties

### access?

> `optional` **access?**: [`ManagedAgentsMemoryStoreResourceConfigAccess`](../type-aliases/ManagedAgentsMemoryStoreResourceConfigAccess.md) \| `null`

Access mode for an attached memory store.

Any of "read_write", "read_only".

***

### instructions?

> `optional` **instructions?**: `string` \| `null`

Per-attachment guidance for the agent on how to use this store. Rendered into
the memory section of the system prompt. Max 4096 chars.

***

### memory\_store\_id

> **memory\_store\_id**: `string`

The memory store ID (memstore\_...). Must belong to the caller's organization
and workspace.

***

### type

> **type**: `"memory_store"`

Any of "memory_store".
