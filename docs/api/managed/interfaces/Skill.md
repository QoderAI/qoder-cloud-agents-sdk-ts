[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [managed](../README.md) / Skill

# Interface: Skill

## Properties

### created\_at

> **created\_at**: `string`

ISO 8601 timestamp of when the skill was created.

***

### display\_title

> **display\_title**: `string`

Human-readable, single-line label for the Skill. Maximum 255 characters. Always
set: derived from the SKILL.md frontmatter `name` when omitted at creation. Not
unique.

***

### id

> **id**: `string`

Unique identifier for the skill.

The format and length of IDs may change over time.

***

### latest\_version

> **latest\_version**: `string`

ID of the newest Skill Version — what `latest` references resolve to. Always
set: a Skill holds at least one version.

***

### metadata?

> `optional` **metadata?**: `Record`\<`string`, `string`\>

***

### source

> **source**: [`SkillSource`](../type-aliases/SkillSource.md)

Where the Skill comes from.

Possible values:

- `"custom"`: authored by the platform user; private to their workspace
- `"qoder"`: published by Qoder; shared and read-only
- `"qoder_example"`: Qoder-published sample Skill
- `"plugin"`: resolved from an installed plugin

***

### type?

> `optional` **type?**: `"skill"`

Object type.

For Skills, this is always `"skill"`.

***

### updated\_at

> **updated\_at**: `string`
