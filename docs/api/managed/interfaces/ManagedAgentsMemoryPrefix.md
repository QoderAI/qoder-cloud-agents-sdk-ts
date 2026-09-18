[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [managed](../README.md) / ManagedAgentsMemoryPrefix

# Interface: ManagedAgentsMemoryPrefix

A rolled-up directory marker returned by
[List memories](/en/api/beta/memory_stores/memories/list) when `depth` is set.
Indicates that one or more memories exist deeper than the requested depth under
this prefix. This is a list-time rollup, not a stored resource; it has no ID and
no lifecycle. Each prefix counts toward the page `limit` and interleaves with
`memory` items in path order.

## Properties

### path

> **path**: `string`

The rolled-up path prefix, including a trailing `/` (e.g. `/projects/foo/`).
Pass this value as `path_prefix` on a subsequent list call to drill into the
directory.

***

### type

> **type**: `"memory_prefix"`

Any of "memory_prefix".
