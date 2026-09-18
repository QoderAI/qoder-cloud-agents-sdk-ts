[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [managed](../README.md) / ContainerUploadBlockParam

# Interface: ContainerUploadBlockParam

A content block that represents a file to be uploaded to the container Files
uploaded via this block will be available in the container's input directory.

## Properties

### cache\_control?

> `optional` **cache\_control?**: [`CacheControlEphemeralParam`](CacheControlEphemeralParam.md) \| `null`

Create a cache control breakpoint at this content block.

***

### file\_id

> **file\_id**: `string`

***

### type?

> `optional` **type?**: `"container_upload"` \| `null`

This field can be elided, and will marshal its zero value as "container_upload".
