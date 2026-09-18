[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [forward](../README.md) / IdentityConfigSpec

# Interface: IdentityConfigSpec

## Indexable

> \[`key`: `string`\]: `unknown`

Additional fields are preserved verbatim by the SDK.

## Properties

### agent\_metadata

> **agent\_metadata**: `Record`\<`string`, `unknown`\>

***

### environment\_variables

> **environment\_variables**: `Record`\<`string`, [`EnvironmentVariableOverride`](EnvironmentVariableOverride.md)\>

***

### files

> **files**: `Record`\<`string`, [`ResourceBinding`](ResourceBinding.md)\>

***

### github\_repositories

> **github\_repositories**: `Record`\<`string`, [`GitHubRepository`](GitHubRepository.md)\>

***

### mcp\_servers

> **mcp\_servers**: `Record`\<`string`, [`MCPServerOverride`](MCPServerOverride.md)\>

***

### model

> **model**: [`ModelConfig`](../type-aliases/ModelConfig.md)

***

### skills

> **skills**: `Record`\<`string`, [`SkillOverride`](SkillOverride.md)\>

***

### system

> **system**: [`SystemOverride`](SystemOverride.md)

***

### tools

> **tools**: `Record`\<`string`, [`ToolOverride`](ToolOverride.md)\>

***

### toolsets

> **toolsets**: `Record`\<`string`, `unknown`\>

***

### vaults

> **vaults**: `Record`\<`string`, [`ResourceBinding`](ResourceBinding.md)\>
