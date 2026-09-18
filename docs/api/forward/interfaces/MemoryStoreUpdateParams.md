[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [forward](../README.md) / MemoryStoreUpdateParams

# Interface: MemoryStoreUpdateParams

## Indexable

> \[`key`: `string`\]: `unknown`

Additional fields are preserved verbatim by the SDK.

## Properties

### description?

> `optional` **description?**: `string` \| `null`

新描述。传入时不含非打印控制字符。

***

### metadata?

> `optional` **metadata?**: `Record`\<`string`, `unknown`\> \| `null`

新元数据，**整体替换**当前 metadata（非合并）。约束详见 [Store metadata 约束](./MemoryStore数据结构.md#store-metadata-约束)。

***

### name?

> `optional` **name?**: `string` \| `null`

新名称。传入时非空且不含非打印控制字符。
