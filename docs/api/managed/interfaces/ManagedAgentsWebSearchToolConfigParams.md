[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [managed](../README.md) / ManagedAgentsWebSearchToolConfigParams

# Interface: ManagedAgentsWebSearchToolConfigParams

Configuration override for the web_search tool.

## Properties

### allowed\_domains?

> `optional` **allowed\_domains?**: `string`[] \| `null`

Only return search results whose host is one of these domains or a subdomain of
one. Each entry is a plain hostname like "docs.example.com" (no scheme or port;
an optional path suffix is accepted). At most 64 entries; an empty list is
rejected (omit the field instead). Cannot be combined with blocked_domains.

***

### blocked\_domains?

> `optional` **blocked\_domains?**: `string`[] \| `null`

Never return search results whose host is one of these domains or a subdomain of
one. Each entry is a plain hostname like "ads.example.com" (no scheme or port;
an optional path suffix is accepted). At most 64 entries; an empty list is
rejected (omit the field instead). Cannot be combined with allowed_domains.

***

### enabled?

> `optional` **enabled?**: `boolean` \| `null`

Whether this tool is enabled and available to Claude. Overrides the
default_config setting.

***

### name?

> `optional` **name?**: `"web_search"` \| `null`

Must be "web_search".

This field can be elided, and will marshal its zero value as "web_search".

***

### permission\_policy?

> `optional` **permission\_policy?**: [`ManagedAgentsWebSearchToolConfigParamsPermissionPolicyUnion`](../type-aliases/ManagedAgentsWebSearchToolConfigParamsPermissionPolicyUnion.md) \| `null`

Permission policy for tool execution.

***

### type?

> `optional` **type?**: `"web_search"` \| `null`

Any of "web_search".

***

### user\_location?

> `optional` **user\_location?**: [`ManagedAgentsUserLocationParam`](ManagedAgentsUserLocationParam.md) \| `null`

Approximate user location for search result localization.
