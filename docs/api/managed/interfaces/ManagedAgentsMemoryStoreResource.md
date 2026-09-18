[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [managed](../README.md) / ManagedAgentsMemoryStoreResource

# Interface: ManagedAgentsMemoryStoreResource

A memory store attached to an agent session.

## Properties

### access?

> `optional` **access?**: [`ManagedAgentsMemoryStoreResourceAccess`](../type-aliases/ManagedAgentsMemoryStoreResourceAccess.md) \| `null`

Access mode for an attached memory store.

Any of "read_write", "read_only".

***

### description?

> `optional` **description?**: `string`

Description of the memory store, snapshotted at attach time. Rendered into the
agent's system prompt. Empty string when the store has no description.

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

### mount\_path?

> `optional` **mount\_path?**: `string` \| `null`

Filesystem path where the store is mounted in the session container, e.g.
/mnt/memory/user-preferences. Derived from the store's name. Output-only.

***

### name?

> `optional` **name?**: `string` \| `null`

Display name of the memory store, snapshotted at attach time. Later edits to the
store's name do not propagate to this resource.

***

### type

> **type**: `"memory_store"`

Any of "memory_store".
