[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [managed](../README.md) / RedactedThinkingBlockParam

# Interface: RedactedThinkingBlockParam

The properties Data, Type are required.

## Properties

### data

> **data**: `string`

The `data` value of this redacted thinking block, exactly as returned by the API
in a previous response. Opaque and encrypted; pass it back unchanged.

***

### type?

> `optional` **type?**: `"redacted_thinking"` \| `null`

This field can be elided, and will marshal its zero value as
"redacted_thinking".
