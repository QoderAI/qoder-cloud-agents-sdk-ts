[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [managed](../README.md) / BrowserStateChangeTabOpenedParam

# Interface: BrowserStateChangeTabOpenedParam

A tab this call's execution opened that remains open at its end — the creation
delta of the `tabs` inventory, not an event log.

Carries only the `tab_id`; the tab's `title` and `url` live on its `tabs` entry,
which must include the same `tab_id`. A tab opened during a failed call gets no
deferred `tab_opened`; it simply appears in the next result's `tabs` inventory.

## Properties

### tab\_id

> **tab\_id**: `string`

The `tab_id` of the opened tab, present in `tabs`.

***

### type?

> `optional` **type?**: `"tab_opened"` \| `null`

This field can be elided, and will marshal its zero value as "tab_opened".
