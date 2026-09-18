[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [forward](../README.md) / Identity

# Interface: Identity

## Indexable

> \[`key`: `string`\]: `unknown`

Additional fields are preserved verbatim by the SDK.

## Properties

### created\_at

> **created\_at**: `string`

创建时间，RFC 3339 格式。

***

### enabled

> **enabled**: `boolean`

是否允许继续使用该 Identity。

***

### external\_id

> **external\_id**: `string`

集成方系统中的终端用户 ID。

***

### id

> **id**: `string`

Forward Identity ID，建议前缀 `idn_`。

***

### identity\_type

> **identity\_type**: `string`

Identity 类型。普通 Identity 返回 `normal`。

***

### metadata

> **metadata**: `Record`\<`string`, `unknown`\>

业务元数据。

***

### name

> **name**: `string`

Identity 展示名。

***

### updated\_at

> **updated\_at**: `string`

最近更新时间，RFC 3339 格式。
