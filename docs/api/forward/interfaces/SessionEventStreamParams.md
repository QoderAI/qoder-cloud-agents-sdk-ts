[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [forward](../README.md) / SessionEventStreamParams

# Interface: SessionEventStreamParams

## Indexable

> \[`key`: `string`\]: `unknown`

Additional fields are preserved verbatim by the SDK.

## Properties

### event\_deltas\[\]?

> `optional` **event\_deltas\[\]?**: `string`[] \| `null`

订阅指定公开事件类型的流式增量事件。支持重复传参，取值见 [流式增量事件](../Session&Event数据结构.md#流式增量事件)。

***

### include\_thinking?

> `optional` **include\_thinking?**: `boolean` \| `null`

是否包含思考过程事件。

***

### include\_tool\_calls?

> `optional` **include\_tool\_calls?**: `boolean` \| `null`

是否包含工具调用类事件。

***

### last\_event\_id?

> `optional` **last\_event\_id?**: `string` \| `null`

从该 Event ID 之后恢复订阅。
