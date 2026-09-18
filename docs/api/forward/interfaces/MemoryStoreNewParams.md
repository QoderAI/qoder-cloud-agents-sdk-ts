[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [forward](../README.md) / MemoryStoreNewParams

# Interface: MemoryStoreNewParams

## Indexable

> \[`key`: `string`\]: `unknown`

Additional fields are preserved verbatim by the SDK.

## Properties

### description?

> `optional` **description?**: `string` \| `null`

自由文本描述。不允许非打印控制字符。

***

### idempotency\_key

> **idempotency\_key**: `string`

创建请求幂等键。相同 key 只能用于相同请求体；不传返回 `400`。

***

### metadata?

> `optional` **metadata?**: `Record`\<`string`, `unknown`\> \| `null`

键值元数据，值必须为字符串。最多 **15** 个键；键 1..64 字符；值 ≤512 字符。`created_by` 是 Forward 保留键，服务端自动写入 `"forward"`；调用方传入 `created_by` 会返回 `400 invalid_request_error`。详见 [Store metadata 约束](./MemoryStore数据结构.md#store-metadata-约束)。

***

### name

> **name**: `string`

Store 展示名，非空。不允许非打印控制字符（`U+0000`–`U+001F`、`U+007F`），换行 `\n`、回车 `\r`、制表 `\t` 除外。
