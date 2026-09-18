[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [forward](../README.md) / SkillVersionNewParams

# Interface: SkillVersionNewParams

## Indexable

> \[`key`: `string`\]: `unknown`

Additional fields are preserved verbatim by the SDK.

## Properties

### files

> **files**: [`Uploadable`](../../index/type-aliases/Uploadable.md)[]

上传字段，可**重复**出现多次。支持两种形态： • 单个 `.zip` 包； • 裸文件树——每个 part 独立上传一个文件，`filename` 携带相对路径（如 `customer-reply/SKILL.md`、`customer-reply/scripts/run.sh`）。 压缩包本身与解压后总大小均不超过 50 MB。
