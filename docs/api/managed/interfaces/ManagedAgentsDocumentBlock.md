[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [managed](../README.md) / ManagedAgentsDocumentBlock

# Interface: ManagedAgentsDocumentBlock

Document content, either specified directly as base64 data, as text, or as a
reference via a URL.

## Properties

### context?

> `optional` **context?**: `string` \| `null`

Additional context about the document for the model.

***

### source

> **source**: [`ManagedAgentsDocumentBlockSourceUnion`](../type-aliases/ManagedAgentsDocumentBlockSourceUnion.md)

Union type for document source variants.

***

### title?

> `optional` **title?**: `string` \| `null`

The title of the document.

***

### type

> **type**: `"document"`

Any of "document".
