[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [forward](../README.md) / ScheduleArchiveManyParams

# Interface: ScheduleArchiveManyParams

## Indexable

> \[`key`: `string`\]: `unknown`

Additional fields are preserved verbatim by the SDK.

## Properties

### idempotency\_key?

> `optional` **idempotency\_key?**: `string` \| `null`

有副作用请求可选的幂等键；相同 owner、路径和请求体可安全重放。

***

### schedule\_ids

> **schedule\_ids**: `string`[]

去重后必须包含 1～50 个非空 Schedule ID。
