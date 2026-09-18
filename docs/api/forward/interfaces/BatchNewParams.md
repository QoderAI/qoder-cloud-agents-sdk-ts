[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [forward](../README.md) / BatchNewParams

# Interface: BatchNewParams

## Indexable

> \[`key`: `string`\]: `unknown`

Additional fields are preserved verbatim by the SDK.

## Properties

### completion\_window

> **completion\_window**: `string`

完成窗口：`24h`、`48h`、`72h`。超时后 Batch 自动进入 `expired` 状态。

***

### idempotency\_key?

> `optional` **idempotency\_key?**: `string` \| `null`

有副作用请求可选的幂等键。

***

### input\_file\_id

> **input\_file\_id**: `string`

通过 Files API 上传的 JSONL 文件 ID。

***

### metadata?

> `optional` **metadata?**: `Record`\<`string`, `unknown`\> \| `null`

调用方业务元数据，最多 16 个 key；value 可为任意 JSON 类型；整体序列化后 ≤ 2KB，key ≤ 64 字符，且不得包含 NUL（U+0000）。
