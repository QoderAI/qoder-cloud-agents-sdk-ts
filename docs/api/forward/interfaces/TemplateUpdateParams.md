[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [forward](../README.md) / TemplateUpdateParams

# Interface: TemplateUpdateParams

## Indexable

> \[`key`: `string`\]: `unknown`

Additional fields are preserved verbatim by the SDK.

## Properties

### description?

> `optional` **description?**: `string` \| `null`

新的 Template 描述。

***

### environment\_id?

> `optional` **environment\_id?**: `string` \| `null`

替换默认 Environment ID；`null` 或空字符串表示清空。

***

### environment\_variables?

> `optional` **environment\_variables?**: [`EnvironmentVariablesUnionParam`](../type-aliases/EnvironmentVariablesUnionParam.md)

整体替换默认环境变量；`null` 表示清空。

***

### files?

> `optional` **files?**: `Record`\<`string`, [`ResourceBindingParam`](ResourceBindingParam.md)\> \| `null`

整体替换默认文件资源配置；`null` 表示清空。

***

### github\_repositories?

> `optional` **github\_repositories?**: `Record`\<`string`, [`GitHubRepositoryParam`](GitHubRepositoryParam.md)\> \| `null`

整体替换默认 GitHub 仓库配置；按 binding key 组织，`null` 或空 object 表示清空。

***

### idempotency\_key?

> `optional` **idempotency\_key?**: `string` \| `null`

有副作用请求可选的幂等键。

***

### mcp\_servers?

> `optional` **mcp\_servers?**: [`MCPServerParam`](MCPServerParam.md)[] \| `null`

整体替换 MCP Server 列表。

***

### metadata?

> `optional` **metadata?**: `Record`\<`string`, `unknown`\> \| `null`

合并更新自定义元数据。

***

### model?

> `optional` **model?**: [`ModelConfigUnionParam`](../type-aliases/ModelConfigUnionParam.md)

新的模型标识。可传 string，或传 Agent model 对象以同时配置 `effort` 或 `context_window`。可通过列出模型接口查询可用值。

***

### multiagent?

> `optional` **multiagent?**: [`MultiagentConfigParam`](MultiagentConfigParam.md) \| `null`

整体替换 Multi-agent 协作配置；传 `null` 表示清空，省略则保留当前配置。

***

### name?

> `optional` **name?**: `string` \| `null`

新的 Template 名称。

***

### skills?

> `optional` **skills?**: [`SkillBindingParam`](SkillBindingParam.md)[] \| `null`

整体替换 Skill 绑定列表。

***

### system?

> `optional` **system?**: `string` \| `null`

新的 System Prompt。

***

### tools?

> `optional` **tools?**: [`ToolParam`](ToolParam.md)[] \| `null`

整体替换工具配置列表。

***

### vaults?

> `optional` **vaults?**: `Record`\<`string`, [`ResourceBindingParam`](ResourceBindingParam.md)\> \| `null`

整体替换默认 Vault 配置；按 Vault ID 组织，`null` 表示清空。

***

### x\_qoder\_beta?

> `optional` **x\_qoder\_beta?**: `string` \| `null`

更新后的 `tools` 中包含 Browser Use 工具集时，必须设置为 `browser-use-2026-07-14`。
