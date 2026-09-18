[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [managed](../README.md) / BrowserStateChangeDownloadFailedParam

# Interface: BrowserStateChangeDownloadFailedParam

A file download that failed — or was cancelled — during this call.

## Properties

### download\_id

> **download\_id**: `string`

The caller-assigned identifier for this download, stable across the state
changes reporting it.

***

### error?

> `optional` **error?**: `string` \| `null`

The failure or cancellation detail, when known.

***

### type?

> `optional` **type?**: `"download_failed"` \| `null`

This field can be elided, and will marshal its zero value as "download_failed".

***

### url

> **url**: `string`

The final post-redirect URL the download was served from.
