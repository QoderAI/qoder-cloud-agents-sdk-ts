[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [managed](../README.md) / ModelInfo

# Interface: ModelInfo

## Properties

### allowed\_fallback\_models

> **allowed\_fallback\_models**: `string`[]

Model IDs this model accepts as `fallbacks`i`.model` on the Messages API. An
empty list means the `fallbacks` parameter is not supported for this model as
primary.

***

### available\_context\_windows?

> `optional` **available\_context\_windows?**: `number`[]

***

### capabilities

> **capabilities**: [`ModelCapabilities`](ModelCapabilities.md)

Model capability information.

***

### created\_at

> **created\_at**: `string`

RFC 3339 datetime string representing the time at which the model was released.
May be set to an epoch value if the release date is unknown.

***

### default\_context\_window?

> `optional` **default\_context\_window?**: `number`

***

### default\_effort?

> `optional` **default\_effort?**: `string`

***

### display\_name

> **display\_name**: `string`

A human-readable name for the model.

***

### efforts?

> `optional` **efforts?**: `string`[]

***

### id

> **id**: `string`

Unique model identifier.

***

### is\_enabled?

> `optional` **is\_enabled?**: `boolean`

***

### is\_new?

> `optional` **is\_new?**: `boolean`

***

### max\_input\_tokens

> **max\_input\_tokens**: `number`

Maximum input context window size in tokens for this model.

***

### max\_tokens

> **max\_tokens**: `number`

Maximum value for the `max_tokens` parameter when using this model.

***

### price\_factor?

> `optional` **price\_factor?**: `number`

***

### source?

> `optional` **source?**: `string`

***

### type?

> `optional` **type?**: `"model"`

Object type.

For Models, this is always `"model"`.
