[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [forward](../README.md) / SessionResource

# Interface: SessionResource

## Indexable

> \[`key`: `string`\]: `unknown`

Additional fields are preserved verbatim by the SDK.

## Properties

### created\_at

> **created\_at**: `string`

资源创建时间，RFC3339。

***

### file\_id

> **file\_id**: `string`

挂载的 File ID。

***

### id

> **id**: `string`

Session 资源 ID，以 `sesr_` 为前缀。

***

### mount\_path

> **mount\_path**: `string`

文件在 Agent 容器内的实际挂载路径。

***

### type

> **type**: `string`

资源类型，固定为 `file`。

***

### updated\_at

> **updated\_at**: `string`

资源更新时间，RFC3339。
