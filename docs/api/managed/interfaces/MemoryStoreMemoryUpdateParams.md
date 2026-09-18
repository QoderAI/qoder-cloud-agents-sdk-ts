[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [managed](../README.md) / MemoryStoreMemoryUpdateParams

# Interface: MemoryStoreMemoryUpdateParams

## Properties

### betas?

> `optional` **betas?**: `string`[]

Optional header to specify the beta version(s) you want to use.

***

### content?

> `optional` **content?**: `string` \| `null`

New UTF-8 text content for the memory. Maximum 100 kB (102,400 bytes). Omit to
leave the content unchanged (e.g., for a rename-only update).

***

### content\_sha256?

> `optional` **content\_sha256?**: `string` \| `null`

***

### memory\_store\_id

> **memory\_store\_id**: `string`

***

### metadata?

> `optional` **metadata?**: `Record`\<`string`, `unknown`\> \| `null`

***

### path?

> `optional` **path?**: `string` \| `null`

New path for the memory (a rename). Must start with `/`, contain at least one
non-empty segment, and be at most 1,024 bytes. Must not contain empty segments,
`.` or `..` segments, control or format characters, or the Unicode line and
paragraph separators (U+2028, U+2029), and must be NFC-normalized. Paths are
case-sensitive. The memory's `id` is preserved across renames. Omit to leave the
path unchanged.

***

### precondition?

> `optional` **precondition?**: [`ManagedAgentsPreconditionParam`](ManagedAgentsPreconditionParam.md) \| `null`

Optimistic-concurrency precondition: the update applies only if the memory's
stored `content_sha256` equals the supplied value. On mismatch, the request
returns `memory_precondition_failed_error` (HTTP 409); re-read the memory and
retry against the fresh state. If the precondition fails but the stored state
already exactly matches the requested `content` and `path`, the server returns
200 instead of 409.

***

### view?

> `optional` **view?**: [`ManagedAgentsMemoryView`](../type-aliases/ManagedAgentsMemoryView.md)

Query parameter for view

Any of "basic", "full".

***

### workspace\_id?

> `optional` **workspace\_id?**: `string`
