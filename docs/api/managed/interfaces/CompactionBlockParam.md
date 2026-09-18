[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [managed](../README.md) / CompactionBlockParam

# Interface: CompactionBlockParam

A compaction block containing summary of previous context.

Users should round-trip these blocks from responses to subsequent requests to
maintain context across compaction boundaries.

When content is None, the block represents a failed compaction. The server
treats these as no-ops. Empty string content is not allowed.

## Properties

### cache\_control?

> `optional` **cache\_control?**: [`CacheControlEphemeralParam`](CacheControlEphemeralParam.md) \| `null`

Create a cache control breakpoint at this content block.

***

### content?

> `optional` **content?**: `string` \| `null`

Summary of previously compacted content, or null if compaction failed

***

### encrypted\_content?

> `optional` **encrypted\_content?**: `string` \| `null`

Opaque metadata from prior compaction, to be round-tripped verbatim

***

### type?

> `optional` **type?**: `"compaction"` \| `null`

This field can be elided, and will marshal its zero value as "compaction".
