[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [forward](../README.md) / Batch

# Interface: Batch

## Indexable

> \[`key`: `string`\]: `unknown`

Additional fields are preserved verbatim by the SDK.

## Properties

### cancelled

> **cancelled**: `number`

因取消而终止的行数。

***

### completed

> **completed**: `number`

执行成功的行数。

***

### completion\_window

> **completion\_window**: `string`

完成窗口：`24h`、`48h`、`72h`。

***

### created\_at

> **created\_at**: `string`

创建时间，RFC 3339。

***

### error\_file\_id

> **error\_file\_id**: `string`

失败行结果文件 ID；无失败行时省略。

***

### error\_message

> **error\_message**: `string`

Batch 级错误描述；仅 `failed` 状态出现。

***

### expired

> **expired**: `number`

因过期而终止的行数。

***

### expires\_at

> **expires\_at**: `string`

过期时间，`created_at` + `completion_window`。

***

### failed

> **failed**: `number`

永久失败的行数（含校验失败）。

***

### id

> **id**: `string`

Batch ID，前缀 `batch_`。

***

### input\_file\_id

> **input\_file\_id**: `string`

输入 JSONL 文件 ID。

***

### metadata

> **metadata**: `Record`\<`string`, `unknown`\>

调用方业务元数据。

***

### object

> **object**: `string`

固定为 `batch`。

***

### output\_file\_id

> **output\_file\_id**: `string`

成功结果文件 ID；未完成或未生成时省略。

***

### pending

> **pending**: `number`

等待执行的行数。

***

### request\_counts

> **request\_counts**: [`BatchRequestCounts`](BatchRequestCounts.md)

任务计数聚合。

***

### running

> **running**: `number`

正在执行的行数。

***

### status

> **status**: `string`

Batch 状态，见状态说明。

***

### total

> **total**: `number`

总行数（含校验失败行）。

***

### usage

> **usage**: [`BatchUsage`](BatchUsage.md) \| `null`

创建响应为 `null`；后续 Batch 详情、列表和取消响应中，至少一个子任务已有合法 CAS Session 用量时返回 Credit 汇总。
