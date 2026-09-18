[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [managed](../README.md) / SessionUpdateParams

# Interface: SessionUpdateParams

## Properties

### agent?

> `optional` **agent?**: [`ManagedAgentsSessionAgentUpdateParam`](ManagedAgentsSessionAgentUpdateParam.md) \| `null`

Mid-session agent configuration update. Only `tools` and `mcp_servers` are
updatable. Full replacement: the provided array becomes the new value. To
preserve existing entries, GET the session, modify the array, and POST it back.

***

### betas?

> `optional` **betas?**: `string`[]

Optional header to specify the beta version(s) you want to use.

***

### budget?

> `optional` **budget?**: [`ManagedAgentsBudgetLimitParam`](ManagedAgentsBudgetLimitParam.md) \| `null`

A hard spend ceiling. The session stops issuing new model requests once the
tracked list cost reaches `max_list_cost`.

***

### environment\_variables?

> `optional` **environment\_variables?**: `Record`\<`string`, `string`\> \| `null`

***

### metadata?

> `optional` **metadata?**: `Record`\<`string`, `unknown`\> \| `null`

Metadata patch. Set a key to a string to upsert it, or to null to delete it.
Omit the field to preserve.

***

### title?

> `optional` **title?**: `string` \| `null`

Human-readable session title.

***

### vault\_ids?

> `optional` **vault\_ids?**: `string`[] \| `null`

Vault IDs (`vlt_*`) to attach to the session. Not yet supported; requests
setting this field are rejected. Reserved for future use.

***

### workspace\_id?

> `optional` **workspace\_id?**: `string`
