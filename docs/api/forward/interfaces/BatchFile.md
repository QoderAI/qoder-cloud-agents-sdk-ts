[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [forward](../README.md) / BatchFile

# Interface: BatchFile

## Indexable

> \[`key`: `string`\]: `unknown`

Additional fields are preserved verbatim by the SDK.

## Properties

### expires\_at

> **expires\_at**: `string`

链接过期时间，RFC 3339，需在此之前完成下载。

***

### url

> **url**: `string`

OSS 预签名下载链接，含 `Expires` / `OSSAccessKeyId` / `Signature` 及 `response-content-disposition`，下载文件名为 `batch-<batch_id>-output.jsonl`。
