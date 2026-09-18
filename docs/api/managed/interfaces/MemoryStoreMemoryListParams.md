[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [managed](../README.md) / MemoryStoreMemoryListParams

# Interface: MemoryStoreMemoryListParams

## Properties

### betas?

> `optional` **betas?**: `string`[]

Optional header to specify the beta version(s) you want to use.

***

### depth?

> `optional` **depth?**: `number`

`0` (or omitted) returns all descendants below `path_prefix` (recursive). `1`
returns immediate children only; deeper entries roll up as `memory_prefix`
items. `depth=1` behaves like `ls`; omitting `depth` behaves like `find`.

***

### limit?

> `optional` **limit?**: `number`

Maximum number of items to return per page. Must be between 1 and 100. Defaults
to 20 when omitted. Capped at 20 when `view=full`. Both `memory` and
`memory_prefix` items count toward the limit.

***

### page?

> `optional` **page?**: `string`

Opaque pagination cursor (a `page_...` value). Pass the `next_page` value from a
previous response to fetch the next page; omit for the first page.

***

### path\_prefix?

> `optional` **path\_prefix?**: `string`

Optional path prefix filter. Must end with `/` (segment-aligned), e.g.,
`/notes/`. This value appears in request URLs. Do not include secrets or
personally identifiable information.

***

### view?

> `optional` **view?**: [`ManagedAgentsMemoryView`](../type-aliases/ManagedAgentsMemoryView.md)

Which projection of each `memory` to return. Defaults to `basic` (content
omitted). `full` populates `content` on each item and caps `limit` at 20; use
this as the bulk-read path for export and sync.

Any of "basic", "full".

***

### workspace\_id?

> `optional` **workspace\_id?**: `string`
