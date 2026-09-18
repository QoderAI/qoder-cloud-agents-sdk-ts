[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [managed](../README.md) / AdvisorRedactedResultBlockParam

# Interface: AdvisorRedactedResultBlockParam

The properties EncryptedContent, Type are required.

## Properties

### encrypted\_content

> **encrypted\_content**: `string`

Opaque blob produced by a prior response; must be round-tripped verbatim.

***

### stop\_reason?

> `optional` **stop\_reason?**: `string` \| `null`

***

### type?

> `optional` **type?**: `"advisor_redacted_result"` \| `null`

This field can be elided, and will marshal its zero value as
"advisor_redacted_result".
