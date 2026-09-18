[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [forward](../README.md) / Session

# Interface: Session

## Indexable

> \[`key`: `string`\]: `unknown`

Additional fields are preserved verbatim by the SDK.

## Properties

### archived\_at

> **archived\_at**: `string` \| `null`

***

### config

> **config**: [`SessionConfig`](SessionConfig.md)

***

### created\_at

> **created\_at**: `string`

***

### id

> **id**: `string`

Session ID。

***

### identity\_id

> **identity\_id**: `string`

Forward Identity ID。

***

### metadata

> **metadata**: `Record`\<`string`, `unknown`\>

***

### resources

> **resources**: [`SessionResource`](SessionResource.md)[]

***

### source\_type

> **source\_type**: `string`

Session 来源，直接 API 创建为 `api`。

***

### stats

> **stats**: [`SessionStats`](SessionStats.md)

***

### status

> **status**: `string`

`idle`、`running`、`rescheduling`、`canceling` 或 `terminated`。

***

### template

> **template**: [`SessionTemplate`](SessionTemplate.md)

Template 摘要。

***

### title

> **title**: `string`

***

### type

> **type**: `string`

固定为 `session`。

***

### updated\_at

> **updated\_at**: `string`

***

### usage

> **usage**: [`SessionUsage`](SessionUsage.md)
