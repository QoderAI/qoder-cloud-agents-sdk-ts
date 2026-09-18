[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [forward](../README.md) / DeletedMemoryStoreMount

# Interface: DeletedMemoryStoreMount

## Indexable

> \[`key`: `string`\]: `unknown`

Additional fields are preserved verbatim by the SDK.

## Properties

### deleted

> **deleted**: `boolean`

挂载关系是否已解除。

***

### id

> **id**: `string`

被解绑的 Memory Store ID。

***

### type

> **type**: `string`

固定为 `memory_store_binding_deleted`。与删除 Store 的 `memory_store_deleted` 区分：本接口只解除挂载关系，Store 本体仍然存在。
