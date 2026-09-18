[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [forward](../README.md) / TemplateNewParams

# Interface: TemplateNewParams

## Indexable

> \[`key`: `string`\]: `unknown`

Additional fields are preserved verbatim by the SDK.

## Properties

### description?

> `optional` **description?**: `string` \| `null`

Template 描述，最多 2048 个字符。

***

### environment\_id

> **environment\_id**: `string`

创建 Session 时默认使用的 Environment ID。

***

### environment\_variables?

> `optional` **environment\_variables?**: [`EnvironmentVariablesUnionParam`](../type-aliases/EnvironmentVariablesUnionParam.md)

默认 Session 环境变量。

***

### files?

> `optional` **files?**: `Record`\<`string`, [`ResourceBindingParam`](ResourceBindingParam.md)\> \| `null`

默认文件资源配置，按 file ID 组织。

***

### github\_repositories?

> `optional` **github\_repositories?**: `Record`\<`string`, [`GitHubRepositoryParam`](GitHubRepositoryParam.md)\> \| `null`

默认 GitHub 仓库配置，按调用方指定的 binding key 组织，最多 20 项。

***

### idempotency\_key?

> `optional` **idempotency\_key?**: `string` \| `null`

有副作用请求可选的幂等键。

***

### mcp\_servers?

> `optional` **mcp\_servers?**: [`MCPServerParam`](MCPServerParam.md)[] \| `null`

MCP Server 配置列表，最多 20 项。

***

### metadata?

> `optional` **metadata?**: `Record`\<`string`, `unknown`\> \| `null`

自定义元数据。

***

### model

> **model**: [`ModelConfigUnionParam`](../type-aliases/ModelConfigUnionParam.md)

模型标识。可传 string（如 `"ultimate"`），或传 Agent model 对象以同时配置 `effort` 或 `context_window`。可通过列出模型接口查询可用值。

***

### multiagent?

> `optional` **multiagent?**: [`MultiagentConfigParam`](MultiagentConfigParam.md) \| `null`

Multi-agent 协作配置。`type` 必须为 `coordinator`；省略或传 `null` 表示不启用。

***

### name

> **name**: `string`

Template 名称，1-256 个字符，租户内唯一。

***

### skills?

> `optional` **skills?**: [`SkillBindingParam`](SkillBindingParam.md)[] \| `null`

Skill 绑定列表，最多 20 项。

***

### system?

> `optional` **system?**: `string` \| `null`

System Prompt，最多 100,000 个字符。

***

### tools?

> `optional` **tools?**: [`ToolParam`](ToolParam.md)[] \| `null`

工具配置列表，最多 128 项。

***

### vaults?

> `optional` **vaults?**: `Record`\<`string`, [`ResourceBindingParam`](ResourceBindingParam.md)\> \| `null`

默认 Vault 配置，按 Vault ID 组织。

***

### x\_qoder\_beta?

> `optional` **x\_qoder\_beta?**: `string` \| `null`

启用 Browser Use 时必须设置为 `browser-use-2026-07-14`。
