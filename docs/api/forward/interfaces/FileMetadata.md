[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [forward](../README.md) / FileMetadata

# Interface: FileMetadata

## Indexable

> \[`key`: `string`\]: `unknown`

Additional fields are preserved verbatim by the SDK.

## Properties

### created\_at

> **created\_at**: `string`

创建时间，RFC 3339 格式。

***

### downloadable

> **downloadable**: `boolean`

是否可下载。

***

### filename

> **filename**: `string`

文件名。

***

### id

> **id**: `string`

File ID。

***

### identity\_id

> **identity\_id**: `string` \| `null`

Forward 归属身份。

***

### metadata

> **metadata**: `Record`\<`string`, `unknown`\>

文件元数据。

***

### mime\_type

> **mime\_type**: `string`

MIME 类型。

***

### scope

> **scope**: `Record`\<`string`, `unknown`\> \| `null`

文件关联的资源作用域，如 Session。

***

### size\_bytes

> **size\_bytes**: `number`

文件大小，单位为 byte。

***

### type

> **type**: `string`

固定为 `file`。

***

### updated\_at

> **updated\_at**: `string`

最后更新时间，RFC 3339 格式。
