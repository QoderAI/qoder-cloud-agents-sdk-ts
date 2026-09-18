[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [managed](../README.md) / WebFetchBlockParam

# Interface: WebFetchBlockParam

The properties Content, Type, URL are required.

## Properties

### content

> **content**: [`RequestDocumentBlockParam`](RequestDocumentBlockParam.md)

***

### retrieved\_at?

> `optional` **retrieved\_at?**: `string` \| `null`

ISO 8601 timestamp when the content was retrieved

***

### type?

> `optional` **type?**: `"web_fetch_result"` \| `null`

This field can be elided, and will marshal its zero value as "web_fetch_result".

***

### url

> **url**: `string`

Fetched content URL
