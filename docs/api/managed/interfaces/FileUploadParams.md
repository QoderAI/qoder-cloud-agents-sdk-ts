[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [managed](../README.md) / FileUploadParams

# Interface: FileUploadParams

## Properties

### betas?

> `optional` **betas?**: `string`[]

Optional header to specify the beta version(s) you want to use.

***

### expires\_in\_seconds?

> `optional` **expires\_in\_seconds?**: `number` \| `null`

Seconds from upload until the file expires and its bytes become permanently
unavailable. Must be between 3600 (one hour) and 7776000 (ninety days).

***

### file

> **file**: [`Uploadable`](../../index/type-aliases/Uploadable.md)

The file to upload. Only the final path component of the part's `filename` is
kept; an absent or empty `filename` is replaced with `unnamed` plus the
extension for the file's stored `mime_type`, when known.

***

### metadata?

> `optional` **metadata?**: `Record`\<`string`, `string`\> \| `null`

***

### name?

> `optional` **name?**: `string` \| `null`

***

### workspace\_id?

> `optional` **workspace\_id?**: `string`
