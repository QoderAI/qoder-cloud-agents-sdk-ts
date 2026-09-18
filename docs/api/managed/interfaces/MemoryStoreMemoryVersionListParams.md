[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [managed](../README.md) / MemoryStoreMemoryVersionListParams

# Interface: MemoryStoreMemoryVersionListParams

## Properties

### api\_key\_id?

> `optional` **api\_key\_id?**: `string`

Query parameter for api_key_id

***

### betas?

> `optional` **betas?**: `string`[]

Optional header to specify the beta version(s) you want to use.

***

### created\_at\[gte\]?

> `optional` **created\_at\[gte\]?**: `string`

Return versions created at or after this time (inclusive).

***

### created\_at\[lte\]?

> `optional` **created\_at\[lte\]?**: `string`

Return versions created at or before this time (inclusive).

***

### limit?

> `optional` **limit?**: `number`

Query parameter for limit

***

### memory\_id?

> `optional` **memory\_id?**: `string`

Query parameter for memory_id

***

### operation?

> `optional` **operation?**: [`ManagedAgentsMemoryVersionOperation`](../type-aliases/ManagedAgentsMemoryVersionOperation.md)

Query parameter for operation

Any of "created", "modified", "deleted".

***

### page?

> `optional` **page?**: `string`

Query parameter for page

***

### service\_account\_id?

> `optional` **service\_account\_id?**: `string`

Query parameter for service_account_id

***

### session\_id?

> `optional` **session\_id?**: `string`

Query parameter for session_id

***

### view?

> `optional` **view?**: [`ManagedAgentsMemoryView`](../type-aliases/ManagedAgentsMemoryView.md)

Query parameter for view

Any of "basic", "full".

***

### workspace\_id?

> `optional` **workspace\_id?**: `string`
