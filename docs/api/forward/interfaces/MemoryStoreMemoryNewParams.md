[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [forward](../README.md) / MemoryStoreMemoryNewParams

# Interface: MemoryStoreMemoryNewParams

## Indexable

> \[`key`: `string`\]: `unknown`

Additional fields are preserved verbatim by the SDK.

## Properties

### content

> **content**: `string`

UTF-8 明文内容，非 base64；原始字节 ≤100 KiB。约束详见 [content 约束](../MemoryStore数据结构.md#content-约束)。

***

### metadata?

> `optional` **metadata?**: `Record`\<`string`, `unknown`\> \| `null`

键值元数据，值必须为字符串。最多 **16** 个键。约束详见 [Memory metadata 约束](../MemoryStore数据结构.md#memory-metadata-约束)。

***

### path

> **path**: `string`

库内相对路径，大小写敏感。约束详见 [path 规则](../MemoryStore数据结构.md#path-规则)。
