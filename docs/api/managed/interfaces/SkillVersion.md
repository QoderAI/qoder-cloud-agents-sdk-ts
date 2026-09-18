[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [managed](../README.md) / SkillVersion

# Interface: SkillVersion

## Properties

### created\_at

> **created\_at**: `string`

ISO 8601 timestamp of when the skill was created.

***

### description

> **description**: `string`

Description of the skill version.

This is extracted from the SKILL.md file in the skill upload.

***

### directory?

> `optional` **directory?**: `string`

***

### id

> **id**: `string`

Unique identifier for this Skill Version. The id addresses the version in paths
and pins it in references.

***

### name

> **name**: `string`

The Skill's immutable kebab-case slug, set at creation from the first upload's
SKILL.md frontmatter `name` (or its enclosing directory). Every later upload
must resolve to the same value. Also the top-level directory of the Skill's
mounted files and the base name of a downloaded archive.

***

### skill\_id

> **skill\_id**: `string`

Unique identifier for the skill.

The format and length of IDs may change over time.

***

### type?

> `optional` **type?**: `"skill_version"`

Object type.

For Skill Versions, this is always `"skill_version"`.

***

### version?

> `optional` **version?**: `string`
