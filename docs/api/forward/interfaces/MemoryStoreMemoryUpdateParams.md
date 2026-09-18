[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [forward](../README.md) / MemoryStoreMemoryUpdateParams

# Interface: MemoryStoreMemoryUpdateParams

## Indexable

> \[`key`: `string`\]: `unknown`

Additional fields are preserved verbatim by the SDK.

## Properties

### content

> **content**: `string`

新内容，UTF-8 明文；原始字节 ≤100 KiB。约束详见 [content 约束](../MemoryStore数据结构.md#content-约束)。

***

### content\_sha256?

> `optional` **content\_sha256?**: `string` \| `null`

期望的当前内容 SHA-256，用于乐观并发控制。不一致时返回 `409`。

***

### metadata?

> `optional` **metadata?**: `Record`\<`string`, `unknown`\> \| `null`

新元数据，**整体替换**当前 metadata（非合并）。未传入时保持原 metadata 不变。约束详见 [Memory metadata 约束](../MemoryStore数据结构.md#memory-metadata-约束)。
