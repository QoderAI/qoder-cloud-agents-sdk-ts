[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [managed](../README.md) / BrowserStateChangeDownloadCompletedParam

# Interface: BrowserStateChangeDownloadCompletedParam

A file download that finished during this call, reported with the same
`download_id` as its `download_started` — or without a prior `download_started`,
when the download finished during the call that started it (at most one state
change per `download_id` per result).

## Properties

### download\_id

> **download\_id**: `string`

The caller-assigned identifier for this download, stable across the state
changes reporting it.

***

### path?

> `optional` **path?**: `string` \| `null`

Where the executor saved the file, on the executor's filesystem. Only included
when another tool in the same environment can read the file at that path.

***

### size\_bytes?

> `optional` **size\_bytes?**: `number` \| `null`

The completed download's size.

***

### type?

> `optional` **type?**: `"download_completed"` \| `null`

This field can be elided, and will marshal its zero value as
"download_completed".

***

### url

> **url**: `string`

The final post-redirect URL the download was served from.
