[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [forward](../README.md) / ScheduleUpdateParams

# Interface: ScheduleUpdateParams

## Indexable

> \[`key`: `string`\]: `unknown`

Additional fields are preserved verbatim by the SDK.

## Properties

### description?

> `optional` **description?**: `string` \| `null`

新的 Schedule 描述。

***

### environment\_id?

> `optional` **environment\_id?**: `string` \| `null`

新的执行环境。

***

### execution?

> `optional` **execution?**: `Record`\<`string`, `unknown`\> \| `null`

合并更新执行策略。

***

### idempotency\_key?

> `optional` **idempotency\_key?**: `string` \| `null`

有副作用请求可选的幂等键。

***

### initial\_events?

> `optional` **initial\_events?**: `Record`\<`string`, `unknown`\>[] \| `null`

替换初始事件列表。

***

### metadata?

> `optional` **metadata?**: `Record`\<`string`, `unknown`\> \| `null`

合并更新 metadata；value 为 `null` 删除 key。

***

### name?

> `optional` **name?**: `string` \| `null`

新的 Schedule 名称。

***

### sinks?

> `optional` **sinks?**: `Record`\<`string`, `unknown`\>[] \| `null`

执行结果推送目标；为兼容性保留数组形式，当前最多允许一个元素。

***

### template\_id?

> `optional` **template\_id?**: `string` \| `null`

新的 Forward Template ID。

***

### trigger\_policy?

> `optional` **trigger\_policy?**: `Record`\<`string`, `unknown`\> \| `null`

更新触发策略；`null` 表示改为 manual。
