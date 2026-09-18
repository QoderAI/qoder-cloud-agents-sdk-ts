[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [forward](../README.md) / ScheduleRun

# Interface: ScheduleRun

## Indexable

> \[`key`: `string`\]: `unknown`

Additional fields are preserved verbatim by the SDK.

## Properties

### attempt

> **attempt**: `number`

当前或最终实际执行到第几次，从 `1` 开始；当 Schedule 的 `execution.max_attempts=2` 且服务端完成自动重试时，可能返回 `2`。

***

### completed\_at

> **completed\_at**: `string`

null|结束时间。

***

### created\_at

> **created\_at**: `string`

记录创建时间。

***

### duration\_ms

> **duration\_ms**: `number`

null|执行耗时，单位毫秒。

***

### error

> **error**: `Record`\<`string`, `unknown`\>

null|失败或跳过时的结构化错误。

***

### error\_message

> **error\_message**: `string`

null|便于展示的错误信息；结构化信息保留在 `error`。

***

### id

> **id**: `string`

Schedule Run ID。

***

### identity\_id

> **identity\_id**: `string`

Forward Identity ID。

***

### push\_finished\_at

> **push\_finished\_at**: `string`

null|IM 投递结束时间。

***

### push\_sink

> **push\_sink**: `string`

null|本次 IM 投递使用的 Sink 类型；未配置投递时为 `null`。

***

### push\_status

> **push\_status**: `string`

IM 投递状态：`pending`、`succeeded`、`failed` 或 `skipped`。主流程状态与投递状态相互独立。

***

### result\_payload

> **result\_payload**: `string`

null|主流程文本结果。

***

### schedule\_id

> **schedule\_id**: `string`

所属 Schedule ID。

***

### session\_id

> **session\_id**: `string`

null|本次执行创建或使用的 Session。

***

### started\_at

> **started\_at**: `string`

null|开始执行时间。

***

### status

> **status**: `string`

`pending`、`running`、`completed`、`failed` 或 `skipped`。

***

### template\_id

> **template\_id**: `string`

Forward Template ID。

***

### trigger\_context

> **trigger\_context**: [`ScheduleRunTriggerContext`](ScheduleRunTriggerContext.md)

触发来源。

***

### triggered\_at

> **triggered\_at**: `string`

触发时间。
