[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [forward](../README.md) / ChannelUpdateParams

# Interface: ChannelUpdateParams

## Indexable

> \[`key`: `string`\]: `unknown`

Additional fields are preserved verbatim by the SDK.

## Properties

### channel\_config?

> `optional` **channel\_config?**: `Record`\<`string`, `unknown`\> \| `null`

***

### enabled?

> `optional` **enabled?**: `boolean` \| `null`

人工启停开关。

***

### idempotency\_key?

> `optional` **idempotency\_key?**: `string` \| `null`

有副作用请求可选的幂等键。

***

### identity\_id?

> `optional` **identity\_id?**: `string` \| `null`

`fixed` 模式下新的 Forward Identity ID。

***

### name?

> `optional` **name?**: `string` \| `null`

Channel 展示名。

***

### template\_id?

> `optional` **template\_id?**: `string` \| `null`

`fixed` 模式下新的 Forward Template ID。
