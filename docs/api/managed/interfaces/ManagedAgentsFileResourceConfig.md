[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [managed](../README.md) / ManagedAgentsFileResourceConfig

# Interface: ManagedAgentsFileResourceConfig

A file mounted into each session's container.

## Properties

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
