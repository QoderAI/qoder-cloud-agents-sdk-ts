[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [managed](../README.md) / SkillNewParams

# Interface: SkillNewParams

## Properties

### betas?

> `optional` **betas?**: `string`[]

Optional header to specify the beta version(s) you want to use.

***

### display\_title?

> `optional` **display\_title?**: `string` \| `null`

Human-readable, single-line label for the Skill. Maximum 255 characters. Always
set: derived from the SKILL.md frontmatter `name` when omitted at creation. Not
unique.

***

### files

> **files**: [`Uploadable`](../../index/type-aliases/Uploadable.md)[]

Files to upload for the skill.

All files must be in the same top-level directory and must include a SKILL.md
file at the root of that directory.

***

### metadata?

> `optional` **metadata?**: `Record`\<`string`, `string`\> \| `null`

***

### workspace\_id?

> `optional` **workspace\_id?**: `string`
