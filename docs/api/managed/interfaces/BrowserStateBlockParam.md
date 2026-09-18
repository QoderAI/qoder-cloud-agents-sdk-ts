[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [managed](../README.md) / BrowserStateBlockParam

# Interface: BrowserStateBlockParam

The caller's browser state after a browser toolset member call — the full
inventory of open tabs, which tab is active, and any side effects (tabs opened,
download state changes) the call produced.

At most one per `tool_result`, only on a non-error result answering a browser
toolset member `tool_use`. The server renders the model-visible text from it;
the model never sees the raw fields.

## Properties

### cache\_control?

> `optional` **cache\_control?**: [`CacheControlEphemeralParam`](CacheControlEphemeralParam.md) \| `null`

Create a cache control breakpoint at this content block.

***

### state\_changes?

> `optional` **state\_changes?**: [`BrowserStateChangeUnionParam`](../type-aliases/BrowserStateChangeUnionParam.md)[] \| `null`

Tabs opened and download state changes during this call. "Nothing to report" is
expressed by omitting the field, never by an empty list.

***

### tabs

> **tabs**: [`BrowserStateTabEntryParam`](BrowserStateTabEntryParam.md)[]

All tabs open in the browser after this call — the full inventory, not a delta.
May be empty. Whenever non-empty, exactly one entry carries `active: true`.

***

### type?

> `optional` **type?**: `"browser_state"` \| `null`

This field can be elided, and will marshal its zero value as "browser_state".
