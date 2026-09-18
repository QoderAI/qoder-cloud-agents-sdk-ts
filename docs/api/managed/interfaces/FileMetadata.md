[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [managed](../README.md) / FileMetadata

# Interface: FileMetadata

## Properties

### created\_at

> **created\_at**: `string`

RFC 3339 datetime string representing when the file was created.

***

### downloadable?

> `optional` **downloadable?**: `boolean`

Whether the file can be downloaded.

***

### expires\_at?

> `optional` **expires\_at?**: `string` \| `null`

RFC 3339 datetime string representing when the file will expire and become
unavailable for download. Null if the file does not expire. For files uploaded
with `expires_in_seconds`, this is the upload time plus that value.

***

### filename

> **filename**: `string`

Original filename of the uploaded file.

***

### id

> **id**: `string`

Unique object identifier.

The format and length of IDs may change over time.

***

### metadata?

> `optional` **metadata?**: `Record`\<`string`, `string`\>

***

### mime\_type

> **mime\_type**: `string`

MIME type of the file.

***

### scope?

> `optional` **scope?**: [`FileScope`](FileScope.md) \| `null`

The scope of this file, indicating the context in which it was created (e.g., a
session).

***

### size\_bytes

> **size\_bytes**: `number`

Size of the file in bytes.

***

### status?

> `optional` **status?**: `string`

***

### type?

> `optional` **type?**: `"file"`

Object type.

For files, this is always `"file"`.
