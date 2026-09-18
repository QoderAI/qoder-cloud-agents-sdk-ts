[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [managed](../README.md) / ManagedAgentsDeletedMemory

# Interface: ManagedAgentsDeletedMemory

Tombstone returned by
[Delete a memory](/en/api/beta/memory_stores/memories/delete). Deleting a memory
does not erase its version history: its versions remain listable via
[List memory versions](/en/api/beta/memory_stores/memory_versions/list) while
they are retained (each version is kept for at least the version retention
period after it was written, unless the store itself is deleted).

## Properties

### id

> **id**: `string`

ID of the deleted memory (a `mem_...` value).

***

### type

> **type**: `"memory_deleted"`

Any of "memory_deleted".
