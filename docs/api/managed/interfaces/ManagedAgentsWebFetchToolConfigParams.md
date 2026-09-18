[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [managed](../README.md) / ManagedAgentsWebFetchToolConfigParams

# Interface: ManagedAgentsWebFetchToolConfigParams

Configuration override for the web_fetch tool.

## Properties

### allowed\_domains?

> `optional` **allowed\_domains?**: `string`[] \| `null`

Only fetch URLs whose host is one of these domains or a subdomain of one. Each
entry is a plain hostname like "docs.example.com" (no scheme, port, or path). At
most 64 entries; an empty list is rejected (omit the field instead). Cannot be
combined with blocked_domains.

***

### blocked\_domains?

> `optional` **blocked\_domains?**: `string`[] \| `null`

Never fetch URLs whose host is one of these domains or a subdomain of one. Each
entry is a plain hostname like "ads.example.com" (no scheme, port, or path). At
most 64 entries; an empty list is rejected (omit the field instead). Cannot be
combined with allowed_domains.

***

### enabled?

> `optional` **enabled?**: `boolean` \| `null`

Whether this tool is enabled and available to Claude. Overrides the
default_config setting.

***

### max\_content\_tokens?

> `optional` **max\_content\_tokens?**: `number` \| `null`

Maximum number of tokens of fetched text content to include in context per call.
Does not apply to binary content such as PDFs.

***

### name?

> `optional` **name?**: `"web_fetch"` \| `null`

Must be "web_fetch".

This field can be elided, and will marshal its zero value as "web_fetch".

***

### permission\_policy?

> `optional` **permission\_policy?**: [`ManagedAgentsWebFetchToolConfigParamsPermissionPolicyUnion`](../type-aliases/ManagedAgentsWebFetchToolConfigParamsPermissionPolicyUnion.md) \| `null`

Permission policy for tool execution.

***

### type?

> `optional` **type?**: `"web_fetch"` \| `null`

Any of "web_fetch".
