[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [forward](../README.md) / Template

# Interface: Template

## Indexable

> \[`key`: `string`\]: `unknown`

Additional fields are preserved verbatim by the SDK.

## Properties

### created\_at

> **created\_at**: `string`

***

### description

> **description**: `string`

***

### environment\_id

> **environment\_id**: `string`

默认 Environment ID。

***

### environment\_variables

> **environment\_variables**: `Record`\<`string`, `string`\>

***

### files

> **files**: `Record`\<`string`, [`ResourceBinding`](ResourceBinding.md)\>

***

### github\_repositories

> **github\_repositories**: `Record`\<`string`, [`GitHubRepository`](GitHubRepository.md)\>

***

### id

> **id**: `string`

Template ID。

***

### mcp\_servers

> **mcp\_servers**: [`MCPServer`](MCPServer.md)[]

***

### metadata

> **metadata**: `Record`\<`string`, `unknown`\>

自定义元数据。

***

### model

> **model**: [`ModelConfig`](../type-aliases/ModelConfig.md)

与请求提交的形态一致；对象形态保留 `id`、`effort` 和 `context_window`。

***

### multiagent

> **multiagent**: [`MultiagentConfig`](MultiagentConfig.md)

***

### name

> **name**: `string`

Template 名称。

***

### skills

> **skills**: [`SkillBinding`](SkillBinding.md)[]

***

### status

> **status**: `string`

`active` 或 `archived`。

***

### system

> **system**: `string`

***

### tools

> **tools**: [`Tool`](Tool.md)[]

***

### type

> **type**: `string`

固定为 `template`。

***

### updated\_at

> **updated\_at**: `string`

***

### vaults

> **vaults**: `Record`\<`string`, [`ResourceBinding`](ResourceBinding.md)\>
