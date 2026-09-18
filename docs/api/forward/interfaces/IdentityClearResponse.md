[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [forward](../README.md) / IdentityClearResponse

# Interface: IdentityClearResponse

## Indexable

> \[`key`: `string`\]: `unknown`

Additional fields are preserved verbatim by the SDK.

## Properties

### completed\_at

> **completed\_at**: `string`

Forward 侧清理完成时间，使用 RFC 3339 格式。

***

### identity\_id

> **identity\_id**: `string`

被清理的 Identity ID。

***

### status

> **status**: `string`

清理状态，成功时为 `completed`。

***

### summary

> **summary**: [`IdentityClearResponseSummary`](IdentityClearResponseSummary.md)
