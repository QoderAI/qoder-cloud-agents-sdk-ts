[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [managed](../README.md) / ImageBlockParam

# Interface: ImageBlockParam

The properties Source, Type are required.

## Properties

### cache\_control?

> `optional` **cache\_control?**: [`CacheControlEphemeralParam`](CacheControlEphemeralParam.md) \| `null`

Create a cache control breakpoint at this content block.

***

### source

> **source**: [`ImageBlockParamSourceUnion`](../type-aliases/ImageBlockParamSourceUnion.md)

***

### transformations?

> `optional` **transformations?**: [`ImageTransformationsParam`](ImageTransformationsParam.md) \| `null`

Configures the transformations the server applies to this image before the model
observes it. Each key names a condition the server transforms images for; its
value selects the transformation applied. Omitted keys keep their default
behavior, and an empty object is equivalent to omitting the field.

***

### type?

> `optional` **type?**: `"image"` \| `null`

This field can be elided, and will marshal its zero value as "image".
