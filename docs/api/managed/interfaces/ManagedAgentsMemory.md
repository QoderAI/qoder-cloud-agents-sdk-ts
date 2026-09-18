[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [managed](../README.md) / ManagedAgentsMemory

# Interface: ManagedAgentsMemory

A `memory` object: a single text document at a hierarchical path inside a memory
store. The `content` field is populated when `view=full` and `null` when
`view=basic`; the `content_size_bytes` and `content_sha256` fields are always
populated so sync clients can diff without fetching content. Memories are
addressed by their `mem_...` ID; the path is the create key and can be changed
via update.

## Properties

### content?

> `optional` **content?**: `string` \| `null`

The memory's UTF-8 text content. Populated when `view=full`; `null` when
`view=basic`. Maximum 100 kB (102,400 bytes).

***

### content\_sha256

> **content\_sha256**: `string`

Lowercase hex SHA-256 digest of the UTF-8 `content` bytes (64 characters). The
server applies no normalization, so clients can compute the same hash locally
for staleness checks and as the value for a `content_sha256` precondition on
update. Always populated, regardless of `view`.

***

### content\_size\_bytes

> **content\_size\_bytes**: `number`

Size of `content` in bytes (the UTF-8 plaintext length). Always populated,
regardless of `view`.

***

### created\_at

> **created\_at**: `string`

A timestamp in RFC 3339 format

***

### id

> **id**: `string`

Unique identifier for this memory (a `mem_...` value). Stable across renames;
use this ID, not the path, to read, update, or delete the memory.

***

### memory\_store\_id

> **memory\_store\_id**: `string`

ID of the memory store this memory belongs to (a `memstore_...` value).

***

### memory\_version\_id

> **memory\_version\_id**: `string`

ID of the `memory_version` representing this memory's current content (a
`memver_...` value). This is the authoritative head pointer; `memory_version`
objects do not carry an `is_latest` flag, so compare against this field instead.
Enumerate the history via
[List memory versions](/en/api/beta/memory_stores/memory_versions/list).

***

### metadata?

> `optional` **metadata?**: `Record`\<`string`, `string`\>

***

### path

> **path**: `string`

Hierarchical path of the memory within the store, e.g. `/projects/foo/notes.md`.
Always starts with `/`. Paths are case-sensitive and unique within a store.
Maximum 1,024 bytes.

***

### type

> **type**: `"memory"`

Any of "memory".

***

### updated\_at

> **updated\_at**: `string`

A timestamp in RFC 3339 format
