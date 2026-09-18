[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [managed](../README.md) / BrowserStateTabEntryParam

# Interface: BrowserStateTabEntryParam

One open browser tab reported in a `browser_state` block's `tabs` inventory.

`tab_id` is the caller-assigned identifier for the tab; `title` and `url`
describe the page the tab is currently showing and may be empty strings (a blank
tab legitimately has both empty). `active` marks the tab that is active after
this call; whenever `tabs` is non-empty, exactly one entry is marked.

## Properties

### active?

> `optional` **active?**: `boolean` \| `null`

Whether this tab is the active tab after this call. Whenever `tabs` is
non-empty, exactly one entry is marked `active: true`.

***

### tab\_id

> **tab\_id**: `string`

The caller-assigned identifier for this tab, unique within the inventory.

***

### title

> **title**: `string`

The title of the page the tab is showing. May be empty.

***

### url

> **url**: `string`

The URL of the page the tab is showing. May be empty.
