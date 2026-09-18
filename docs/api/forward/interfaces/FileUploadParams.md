[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [forward](../README.md) / FileUploadParams

# Interface: FileUploadParams

## Indexable

> \[`key`: `string`\]: `unknown`

Additional fields are preserved verbatim by the SDK.

## Properties

### file

> **file**: [`Uploadable`](../../index/type-aliases/Uploadable.md)

待上传文件内容。支持类型见[支持上传的文件类型](./schemas.md#支持上传的文件类型)。

***

### idempotency\_key?

> `optional` **idempotency\_key?**: `string` \| `null`

可选创建请求幂等键。传入时相同 key 只能用于相同请求；不传时不提供本地幂等重放保护。

***

### metadata?

> `optional` **metadata?**: `Record`\<`string`, `unknown`\> \| `null`

元数据对象；`created_by` 为保留字段，不可传入（传入返回 400）。

***

### name?

> `optional` **name?**: `string` \| `null`

文件展示名，未传时使用 multipart 文件名；规范化后长度为 1-255 bytes。

***

### purpose?

> `optional` **purpose?**: `string` \| `null`

文件用途，默认 `user_upload`；作为 Batch 输入文件时必须传 `session_resource`。
