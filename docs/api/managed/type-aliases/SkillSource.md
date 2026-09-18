[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [managed](../README.md) / SkillSource

# Type Alias: SkillSource

> **SkillSource** = `string` \| \{ `type`: [`SkillSourceType`](SkillSourceType.md); \}

## Union Members

`string`

***

### Type Literal

\{ `type`: [`SkillSourceType`](SkillSourceType.md); \}

#### type

> **type**: [`SkillSourceType`](SkillSourceType.md)

Where the Skill comes from.

Possible values:

- `"custom"`: authored by the platform user; private to their workspace
- `"qoder"`: published by Qoder; shared and read-only
- `"qoder_example"`: Qoder-published sample Skill
- `"plugin"`: resolved from an installed plugin

Any of "custom", "qoder", "qoder_example", "plugin".
