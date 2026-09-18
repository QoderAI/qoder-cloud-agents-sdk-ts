[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [forward](../README.md) / SkillVersionListParams

# Interface: SkillVersionListParams

## Indexable

> \[`key`: `string`\]: `unknown`

Additional fields are preserved verbatim by the SDK.

## Properties

### limit?

> `optional` **limit?**: `number` \| `null`

分页大小，最大 100，默认 20。

***

### page?

> `optional` **page?**: `string` \| `null`

向后翻页游标；取值来自上一页响应的 `next_page`；不传即从第一页开始。
