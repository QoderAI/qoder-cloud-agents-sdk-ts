[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [managed](../README.md) / SessionResourceAddParams

# Interface: SessionResourceAddParams

## Properties

### betas?

> `optional` **betas?**: `string`[]

Optional header to specify the beta version(s) you want to use.

***

### file\_id

> **file\_id**: `string`

ID of a previously uploaded file.

***

### mount\_path?

> `optional` **mount\_path?**: `string` \| `null`

Mount path in the container. Defaults to `/mnt/session/uploads/<file_id>`.

***

### type

> **type**: `"file"`

Any of "file".

***

### workspace\_id?

> `optional` **workspace\_id?**: `string`
