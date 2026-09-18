[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [managed](../README.md) / ManagedAgentsMemoryStoreResourceParam

# Interface: ManagedAgentsMemoryStoreResourceParam

Parameters for attaching a memory store to an agent session.

## Properties

### access?

> `optional` **access?**: [`ManagedAgentsMemoryStoreResourceParamAccess`](../type-aliases/ManagedAgentsMemoryStoreResourceParamAccess.md) \| `null`

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
