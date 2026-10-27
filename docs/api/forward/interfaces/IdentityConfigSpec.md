[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [forward](../README.md) / IdentityConfigSpec

# Interface: IdentityConfigSpec

## Indexable

> \[`key`: `string`\]: `unknown`

Additional fields are preserved verbatim by the SDK.

## Properties

### agent\_metadata?

> `optional` **agent\_metadata?**: `Record`\<`string`, `unknown`\> \| `null`

***

### environment\_variables?

> `optional` **environment\_variables?**: `Record`\<`string`, [`EnvironmentVariableOverride`](EnvironmentVariableOverride.md)\> \| `null`

***

### files?

> `optional` **files?**: `Record`\<`string`, [`ResourceBinding`](ResourceBinding.md)\> \| `null`

***

### github\_repositories?

> `optional` **github\_repositories?**: `Record`\<`string`, [`GitHubRepository`](GitHubRepository.md)\> \| `null`

***

### managed\_tool\_config?

> `optional` **managed\_tool\_config?**: `Record`\<`string`, [`ManagedCapabilityOverride`](ManagedCapabilityOverride.md) \| `null`\> \| `null`

***

### mcp\_servers?

> `optional` **mcp\_servers?**: `Record`\<`string`, [`MCPServerOverride`](MCPServerOverride.md)\> \| `null`

***

### model?

> `optional` **model?**: [`ModelConfig`](../type-aliases/ModelConfig.md) \| `null`

***

### skills?

> `optional` **skills?**: `Record`\<`string`, [`SkillOverride`](SkillOverride.md)\> \| `null`

***

### system?

> `optional` **system?**: [`SystemOverride`](SystemOverride.md) \| `null`

***

### tools?

> `optional` **tools?**: `Record`\<`string`, [`ToolOverride`](ToolOverride.md) \| `null`\> \| [`Tool`](Tool.md)[] \| `null`

***

### toolsets?

> `optional` **toolsets?**: `Record`\<`string`, `unknown`\> \| `null`

***

### vaults?

> `optional` **vaults?**: `Record`\<`string`, [`ResourceBinding`](ResourceBinding.md)\> \| `null`
