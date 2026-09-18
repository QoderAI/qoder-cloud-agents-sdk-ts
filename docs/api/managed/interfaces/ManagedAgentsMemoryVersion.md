[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [managed](../README.md) / ManagedAgentsMemoryVersion

# Interface: ManagedAgentsMemoryVersion

A `memory_version` object: one immutable, attributed row in a memory's
append-only history. Every non-no-op mutation to a memory produces a new
version. Versions belong to the store (not the individual memory) and are not
deleted with the memory; each version is retained for at least the version
retention period after it was written, unless the store itself is deleted.
Retrieving a redacted version returns 200 with `content`, `path`,
`content_size_bytes`, and `content_sha256` set to `null`; branch on
`redacted_at`, not HTTP status.

## Properties

### content?

> `optional` **content?**: `string` \| `null`

The memory's UTF-8 text content as of this version. `null` when `view=basic`,
when `operation` is `deleted`, or when `redacted_at` is set.

***

### content\_sha256?

> `optional` **content\_sha256?**: `string` \| `null`

Lowercase hex SHA-256 digest of `content` as of this version (64 characters).
`null` when `redacted_at` is set or `operation` is `deleted`. Populated
regardless of `view` otherwise.

***

### content\_size\_bytes?

> `optional` **content\_size\_bytes?**: `number` \| `null`

Size of `content` in bytes as of this version. `null` when `redacted_at` is set
or `operation` is `deleted`. Populated regardless of `view` otherwise.

***

### created\_at

> **created\_at**: `string`

A timestamp in RFC 3339 format

***

### created\_by?

> `optional` **created\_by?**: [`ManagedAgentsActorUnion`](../type-aliases/ManagedAgentsActorUnion.md)

Identifies who performed a write or redact operation. Captured at write time on
the `memory_version` row. The API key that created a session is not recorded on
agent writes; attribution answers who made the write, not who is ultimately
responsible. Look up session provenance separately via the
[Sessions API](/en/api/beta/sessions/retrieve).

***

### id

> **id**: `string`

Unique identifier for this version (a `memver_...` value).

***

### memory\_id

> **memory\_id**: `string`

ID of the memory this version snapshots (a `mem_...` value). Remains valid after
the memory is deleted; pass it as `memory_id` to
[List memory versions](/en/api/beta/memory_stores/memory_versions/list) to
retrieve the memory's retained versions, including the `deleted` row while the
lineage is retained.

***

### memory\_store\_id

> **memory\_store\_id**: `string`

ID of the memory store this version belongs to (a `memstore_...` value).

***

### operation

> **operation**: [`ManagedAgentsMemoryVersionOperation`](../type-aliases/ManagedAgentsMemoryVersionOperation.md)

The kind of mutation a `memory_version` records. Every non-no-op mutation to a
memory appends exactly one version row with one of these values.

Any of "created", "modified", "deleted".

***

### path?

> `optional` **path?**: `string` \| `null`

The memory's path at the time of this write. `null` if and only if `redacted_at`
is set.

***

### redacted\_at?

> `optional` **redacted\_at?**: `string` \| `null`

A timestamp in RFC 3339 format

***

### redacted\_by?

> `optional` **redacted\_by?**: [`ManagedAgentsActorUnion`](../type-aliases/ManagedAgentsActorUnion.md)

Identifies who performed a write or redact operation. Captured at write time on
the `memory_version` row. The API key that created a session is not recorded on
agent writes; attribution answers who made the write, not who is ultimately
responsible. Look up session provenance separately via the
[Sessions API](/en/api/beta/sessions/retrieve).

***

### type

> **type**: `"memory_version"`

Any of "memory_version".
