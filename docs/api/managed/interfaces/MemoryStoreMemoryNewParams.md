[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [managed](../README.md) / MemoryStoreMemoryNewParams

# Interface: MemoryStoreMemoryNewParams

## Properties

### betas?

> `optional` **betas?**: `string`[]

Optional header to specify the beta version(s) you want to use.

***

### content

> **content**: `string`

UTF-8 text content for the new memory. Maximum 100 kB (102,400 bytes). Required;
pass `""` explicitly to create an empty memory.

***

### metadata?

> `optional` **metadata?**: `Record`\<`string`, `string`\> \| `null`

***

### path

> **path**: `string`

Hierarchical path for the new memory, e.g. `/projects/foo/notes.md`. Must start
with `/`, contain at least one non-empty segment, and be at most 1,024 bytes.
Must not contain empty segments, `.` or `..` segments, control or format
characters, or the Unicode line and paragraph separators (U+2028, U+2029), and
must be NFC-normalized. Paths are case-sensitive.

***

### view?

> `optional` **view?**: [`ManagedAgentsMemoryView`](../type-aliases/ManagedAgentsMemoryView.md)

Query parameter for view

Any of "basic", "full".

***

### workspace\_id?

> `optional` **workspace\_id?**: `string`
