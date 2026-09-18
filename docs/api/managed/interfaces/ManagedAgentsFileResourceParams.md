[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [managed](../README.md) / ManagedAgentsFileResourceParams

# Interface: ManagedAgentsFileResourceParams

Mount a file uploaded via the Files API into the session.

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
