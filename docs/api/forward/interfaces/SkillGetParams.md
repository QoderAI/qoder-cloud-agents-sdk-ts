[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [forward](../README.md) / SkillGetParams

# Interface: SkillGetParams

## Indexable

> \[`key`: `string`\]: `unknown`

Additional fields are preserved verbatim by the SDK.

## Properties

### include\_content?

> `optional` **include\_content?**: `boolean` \| `null`

⚠️ **已弃用**：为 `true` 时随响应返回 `content` 与 `content_encoding`（base64 zip）。命中时响应头会返回 `Deprecation: true`。请改用 [下载 Skill 版本内容](./Versions/download.md)。
