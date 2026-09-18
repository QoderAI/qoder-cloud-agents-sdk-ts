[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [managed](../README.md) / ManagedAgentsMemoryVersionOperation

# Type Alias: ManagedAgentsMemoryVersionOperation

> **ManagedAgentsMemoryVersionOperation** = `"created"` \| `"modified"` \| `"deleted"`

The kind of mutation a `memory_version` records. Every non-no-op mutation to a
memory appends exactly one version row with one of these values.
