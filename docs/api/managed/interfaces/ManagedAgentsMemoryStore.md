[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [managed](../README.md) / ManagedAgentsMemoryStore

# Interface: ManagedAgentsMemoryStore

A `memory_store`: a named container for agent memories, scoped to a workspace.
Attach a store to a session via `resources[]` to mount it as a directory the
agent can read and write.

## Properties

### archived\_at?

> `optional` **archived\_at?**: `string` \| `null`

A timestamp in RFC 3339 format

***

### created\_at

> **created\_at**: `string`

A timestamp in RFC 3339 format

***

### description?

> `optional` **description?**: `string`

Free-text description of what the store contains, up to 1024 characters.
Included in the agent's system prompt when the store is attached, so word it to
be useful to the agent. Empty string when unset.

***

### id

> **id**: `string`

Unique identifier for the memory store (a `memstore_...` tagged ID). Use this
when attaching the store to a session, or in the `{memory_store_id}` path
parameter of subsequent calls.

***

### metadata?

> `optional` **metadata?**: `Record`\<`string`, `string`\>

Arbitrary key-value tags for your own bookkeeping (such as the end user a store
belongs to). Up to 16 pairs; keys 1–64 characters; values up to 512 characters.
Returned on retrieve/list but not filterable.

***

### name

> **name**: `string`

Human-readable name for the store. 1–255 characters. The store's mount-path slug
under `/mnt/memory/` is derived from this name.

***

### type

> **type**: `"memory_store"`

Any of "memory_store".

***

### updated\_at

> **updated\_at**: `string`

A timestamp in RFC 3339 format
