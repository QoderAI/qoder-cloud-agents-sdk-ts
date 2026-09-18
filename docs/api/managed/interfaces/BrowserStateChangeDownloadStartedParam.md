[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [managed](../README.md) / BrowserStateChangeDownloadStartedParam

# Interface: BrowserStateChangeDownloadStartedParam

A file download that started during this call.

## Properties

### download\_id

> **download\_id**: `string`

The caller-assigned identifier for this download, stable across the state
changes reporting it.

***

### type?

> `optional` **type?**: `"download_started"` \| `null`

This field can be elided, and will marshal its zero value as "download_started".

***

### url

> **url**: `string`

The final post-redirect URL the download was served from.
