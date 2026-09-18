[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [managed](../README.md) / MemoryStoreUpdateParams

# Interface: MemoryStoreUpdateParams

## Properties

### betas?

> `optional` **betas?**: `string`[]

Optional header to specify the beta version(s) you want to use.

***

### description?

> `optional` **description?**: `string` \| `null`

New description for the store, up to 1024 characters. Pass an empty string to
clear it.

***

### metadata?

> `optional` **metadata?**: `Record`\<`string`, `unknown`\> \| `null`

Metadata patch. Set a key to a string to upsert it, or to null to delete it.
Omit the field to preserve. The stored bag is limited to 16 keys (up to 64 chars
each) with values up to 512 chars.

***

### name?

> `optional` **name?**: `string` \| `null`

New human-readable name for the store. 1–255 characters; no control characters.
Renaming changes the slug used for the store's `mount_path` in sessions created
after the update.

***

### workspace\_id?

> `optional` **workspace\_id?**: `string`
