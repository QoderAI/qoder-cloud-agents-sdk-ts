[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [managed](../README.md) / ManagedAgentsMemoryView

# Type Alias: ManagedAgentsMemoryView

> **ManagedAgentsMemoryView** = `"basic"` \| `"full"`

Selects which projection of a `memory` or `memory_version` the server returns.
`basic` returns the object with `content` set to `null`; `full` populates
`content`. When omitted, the default is endpoint-specific: retrieve operations
default to `full`; list, create, and update operations default to `basic`.
Listing with `view=full` caps `limit` at 20.
