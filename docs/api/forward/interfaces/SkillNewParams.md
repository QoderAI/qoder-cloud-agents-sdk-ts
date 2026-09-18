[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [forward](../README.md) / SkillNewParams

# Interface: SkillNewParams

## Indexable

> \[`key`: `string`\]: `unknown`

Additional fields are preserved verbatim by the SDK.

## Properties

### description?

> `optional` **description?**: `string` \| `null`

⚠️ **已弃用**：最终描述始终从 `SKILL.md` 解析。

***

### file?

> `optional` **file?**: [`Uploadable`](../../index/type-aliases/Uploadable.md) \| `null`

⚠️ **已弃用**：单个 `.zip` 包，宽松包规则。命中时响应头返回 `Deprecation: true`。请迁移到 `files`。

***

### files?

> `optional` **files?**: [`Uploadable`](../../index/type-aliases/Uploadable.md)[] \| `null`

推荐上传字段，可**重复出现**多次。支持两种形态： ① 单个 `.zip` 包； ② 裸文件树——每个 part 独立上传一个文件，`filename` 携带相对路径（如 `code-review/SKILL.md`、`code-review/scripts/run.sh`）。 压缩包本身与解压后总大小均不超过 50 MB。

***

### icon\_id?

> `optional` **icon\_id?**: `string` \| `null`

Forward Resource icon 公开 ID。

***

### idempotency\_key?

> `optional` **idempotency\_key?**: `string` \| `null`

建议提供。相同 key 且规范化后的 `files` 指纹一致时可安全重试。

***

### metadata?

> `optional` **metadata?**: `Record`\<`string`, `unknown`\> \| `null`

调用方元数据对象，最多 15 个键；`created_by` 为保留字段，不可传入（传入返回 400）。

***

### name?

> `optional` **name?**: `string` \| `null`

⚠️ **已弃用**：最终名称始终从上传包内 `SKILL.md` frontmatter 的 `name` 解析。字段保留仅为兼容，传入将被忽略。

***

### type?

> `optional` **type?**: `string` \| `null`

⚠️ **已弃用**：Skill 创建类型，可选 `custom`、`prebuilt`，默认 `custom`。`prebuilt` 会使响应 `source` 字段返回 `qoder`（其余为 `custom`）。
