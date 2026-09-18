[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [forward](../README.md) / ScheduleNewParams

# Interface: ScheduleNewParams

## Indexable

> \[`key`: `string`\]: `unknown`

Additional fields are preserved verbatim by the SDK.

## Properties

### description?

> `optional` **description?**: `string` \| `null`

Schedule 描述。

***

### environment\_id

> **environment\_id**: `string`

执行环境。

***

### execution?

> `optional` **execution?**: `Record`\<`string`, `unknown`\> \| `null`

执行策略；省略时使用服务端默认值。

***

### idempotency\_key?

> `optional` **idempotency\_key?**: `string` \| `null`

有副作用请求可选的幂等键。

***

### identity\_id

> **identity\_id**: `string`

Schedule 所属 Forward Identity ID。

***

### initial\_events

> **initial\_events**: `Record`\<`string`, `unknown`\>[]

每次执行注入的初始事件，当前支持 `user.message`。

***

### metadata?

> `optional` **metadata?**: `Record`\<`string`, `unknown`\> \| `null`

业务元数据，仅用于标签或透传。

***

### name

> **name**: `string`

Schedule 名称。

***

### sinks?

> `optional` **sinks?**: `Record`\<`string`, `unknown`\>[] \| `null`

执行结果推送目标；为兼容性保留数组形式，当前最多允许一个元素。

***

### template\_id

> **template\_id**: `string`

要执行的 Forward Template ID。

***

### trigger\_policy?

> `optional` **trigger\_policy?**: `Record`\<`string`, `unknown`\> \| `null`

触发策略；省略或 `null` 时按 `manual` 处理。
