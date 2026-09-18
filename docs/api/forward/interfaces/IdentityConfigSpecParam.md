[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [forward](../README.md) / IdentityConfigSpecParam

# Interface: IdentityConfigSpecParam

## Indexable

> \[`key`: `string`\]: `unknown`

Additional fields are preserved verbatim by the SDK.

## Properties

### agent\_metadata?

> `optional` **agent\_metadata?**: `Record`\<`string`, `unknown`\> \| `null`

***

### environment\_variables?

> `optional` **environment\_variables?**: `Record`\<`string`, [`EnvironmentVariableOverrideParam`](EnvironmentVariableOverrideParam.md)\> \| `null`

***

### files?

> `optional` **files?**: `Record`\<`string`, [`ResourceBindingParam`](ResourceBindingParam.md)\> \| `null`

***

### github\_repositories?

> `optional` **github\_repositories?**: `Record`\<`string`, [`GitHubRepositoryParam`](GitHubRepositoryParam.md)\> \| `null`

***

### mcp\_servers?

> `optional` **mcp\_servers?**: `Record`\<`string`, [`MCPServerOverrideParam`](MCPServerOverrideParam.md)\> \| `null`

***

### model?

> `optional` **model?**: [`ModelConfigUnionParam`](../type-aliases/ModelConfigUnionParam.md)

***

### skills?

> `optional` **skills?**: `Record`\<`string`, [`SkillOverrideParam`](SkillOverrideParam.md)\> \| `null`

***

### system?

> `optional` **system?**: [`SystemOverrideParam`](SystemOverrideParam.md) \| `null`

***

### tools?

> `optional` **tools?**: `Record`\<`string`, [`ToolOverrideParam`](ToolOverrideParam.md)\> \| `null`

***

### toolsets?

> `optional` **toolsets?**: `Record`\<`string`, `unknown`\> \| `null`

***

### vaults?

> `optional` **vaults?**: `Record`\<`string`, [`ResourceBindingParam`](ResourceBindingParam.md)\> \| `null`
