[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [forward](../README.md) / SkillUpdateParams

# Interface: SkillUpdateParams

## Indexable

> \[`key`: `string`\]: `unknown`

Additional fields are preserved verbatim by the SDK.

## Properties

### content?

> `optional` **content?**: `string` \| `null`

新内容（zip 包内容）。压缩包本身与解压后总大小均不超过 50 MB，超过返回 400；请求体整体（含 base64 编码与 JSON 信封）上限约 67.7 MB，超过返回 413。

***

### content\_encoding?

> `optional` **content\_encoding?**: `string` \| `null`

`content` 的编码。支持 `base64`、`utf-8`、`utf8`、`plain`、`text`；省略时按 UTF-8 文本处理。传入该字段时必须同时提供非空 `content`。

***

### description?

> `optional` **description?**: `string` \| `null`

新描述。

***

### icon\_id?

> `optional` **icon\_id?**: `string` \| `null`

更新或清空 Forward icon。

***

### metadata?

> `optional` **metadata?**: `Record`\<`string`, `unknown`\> \| `null`

元数据对象，会**替换**当前 metadata（非合并）；传入时不能为 `null`，value 必须为 string。`created_by` 为保留字段，不可传入（传入返回 400）。

***

### name?

> `optional` **name?**: `string` \| `null`

⚠️ **已弃用**：技能名不可修改。传入必须与当前规范名完全一致，否则返回 400；一致时为空操作。
