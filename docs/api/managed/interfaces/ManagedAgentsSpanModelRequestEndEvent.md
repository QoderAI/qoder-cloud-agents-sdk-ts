[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [managed](../README.md) / ManagedAgentsSpanModelRequestEndEvent

# Interface: ManagedAgentsSpanModelRequestEndEvent

Emitted when a model request completes.

## Properties

### id

> **id**: `string`

Unique identifier for this event.

***

### is\_error

> **is\_error**: `boolean`

Whether the model request resulted in an error.

***

### model\_request\_start\_id

> **model\_request\_start\_id**: `string`

The id of the corresponding `span.model_request_start` event.

***

### model\_usage

> **model\_usage**: [`ManagedAgentsSpanModelUsage`](ManagedAgentsSpanModelUsage.md)

Token usage for a single model request.

***

### processed\_at

> **processed\_at**: `string`

A timestamp in RFC 3339 format

***

### type

> **type**: `"span.model_request_end"`

Any of "span.model_request_end".
