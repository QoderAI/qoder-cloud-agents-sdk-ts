[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [managed](../README.md) / MemoryStoreNewParams

# Interface: MemoryStoreNewParams

## Properties

### betas?

> `optional` **betas?**: `string`[]

Optional header to specify the beta version(s) you want to use.

***

### description?

> `optional` **description?**: `string` \| `null`

Free-text description of what the store contains, up to 1024 characters.
Included in the agent's system prompt when the store is attached, so word it to
be useful to the agent.

***

### metadata?

> `optional` **metadata?**: `Record`\<`string`, `string`\> \| `null`

Arbitrary key-value tags for your own bookkeeping (such as the end user a store
belongs to). Up to 16 pairs; keys 1–64 characters; values up to 512 characters.
Not visible to the agent.

***

### name

> **name**: `string`

Human-readable name for the store. Required; 1–255 characters; no control
characters. The mount-path slug under `/mnt/memory/` is derived from this name
(lowercased, non-alphanumeric runs collapsed to a hyphen). Names need not be
unique within a workspace.

***

### workspace\_id?

> `optional` **workspace\_id?**: `string`
