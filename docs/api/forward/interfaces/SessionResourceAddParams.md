[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [forward](../README.md) / SessionResourceAddParams

# Interface: SessionResourceAddParams

## Indexable

> \[`key`: `string`\]: `unknown`

Additional fields are preserved verbatim by the SDK.

## Properties

### file\_id

> **file\_id**: `string`

Files API 返回的 File ID，文件必须已上传完成。

***

### mount\_path?

> `optional` **mount\_path?**: `string` \| `null`

Agent 容器内挂载路径；省略时由 Forward 根据文件名生成，默认挂载到 `/data/workspace/<文件名>`。

***

### type

> **type**: `string`

资源类型，必须为 `file`。
