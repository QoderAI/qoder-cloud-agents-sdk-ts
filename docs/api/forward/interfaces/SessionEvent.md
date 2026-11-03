[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [forward](../README.md) / SessionEvent

# Interface: SessionEvent

## Indexable

> \[`key`: `string`\]: `unknown`

Additional fields are preserved verbatim by the SDK.

## Properties

### agent?

> `optional` **agent?**: `Record`\<`string`, `unknown`\>

***

### budget?

> `optional` **budget?**: [`SessionBudget`](SessionBudget.md) \| `null`

Absent means unchanged; null means unlimited.

***

### content?

> `optional` **content?**: `unknown`

***

### content\_block?

> `optional` **content\_block?**: `unknown`

***

### content\_type?

> `optional` **content\_type?**: `string`

***

### custom\_tool\_use\_id?

> `optional` **custom\_tool\_use\_id?**: `string`

***

### delta?

> `optional` **delta?**: `unknown`

***

### deny\_message?

> `optional` **deny\_message?**: `string`

***

### description?

> `optional` **description?**: `string`

***

### error?

> `optional` **error?**: `Record`\<`string`, `unknown`\>

***

### evaluated\_permission?

> `optional` **evaluated\_permission?**: `string`

***

### evaluation?

> `optional` **evaluation?**: [`ToolApprovalEvaluation`](ToolApprovalEvaluation.md)

***

### event?

> `optional` **event?**: `unknown`

***

### event\_id?

> `optional` **event\_id?**: `string`

***

### explanation?

> `optional` **explanation?**: `string` \| `null`

***

### file\_id?

> `optional` **file\_id?**: `string`

***

### id

> **id**: `string`

***

### index?

> `optional` **index?**: `number`

***

### input?

> `optional` **input?**: `Record`\<`string`, `unknown`\>

***

### is\_error?

> `optional` **is\_error?**: `boolean`

***

### iteration?

> `optional` **iteration?**: `number`

***

### max\_iterations?

> `optional` **max\_iterations?**: `number`

***

### mcp\_server\_name?

> `optional` **mcp\_server\_name?**: `string`

***

### mcp\_tool\_use\_id?

> `optional` **mcp\_tool\_use\_id?**: `string`

***

### message?

> `optional` **message?**: `unknown`

***

### message\_id?

> `optional` **message\_id?**: `string`

***

### metadata?

> `optional` **metadata?**: `Record`\<`string`, `unknown`\>

***

### model\_credits?

> `optional` **model\_credits?**: `number`

Cumulative Credits: replace with the latest values, never sum successive events.

***

### model\_request\_start\_id?

> `optional` **model\_request\_start\_id?**: `string`

***

### model\_usage?

> `optional` **model\_usage?**: `Record`\<`string`, `unknown`\>

***

### name?

> `optional` **name?**: `string`

***

### original\_filename?

> `optional` **original\_filename?**: `string`

***

### outcome\_evaluation\_start\_id?

> `optional` **outcome\_evaluation\_start\_id?**: `string`

***

### outcome\_id?

> `optional` **outcome\_id?**: `string`

***

### processed\_at

> **processed\_at**: `string`

***

### reason?

> `optional` **reason?**: `string`

***

### result?

> `optional` **result?**: `string`

***

### rubric?

> `optional` **rubric?**: [`OutcomeRubric`](../type-aliases/OutcomeRubric.md)

***

### sandbox\_runtime\_credits?

> `optional` **sandbox\_runtime\_credits?**: `number`

***

### session\_id?

> `optional` **session\_id?**: `string`

***

### session\_thread\_id?

> `optional` **session\_thread\_id?**: `string`

***

### size?

> `optional` **size?**: `number`

***

### stop\_reason?

> `optional` **stop\_reason?**: `Record`\<`string`, `unknown`\>

***

### text?

> `optional` **text?**: `string`

***

### thinking?

> `optional` **thinking?**: `string`

***

### title?

> `optional` **title?**: `string`

***

### tool\_use\_id?

> `optional` **tool\_use\_id?**: `string`

***

### total\_credits?

> `optional` **total\_credits?**: `number`

***

### type

> **type**: `string`

***

### usage?

> `optional` **usage?**: `Record`\<`string`, `unknown`\>
