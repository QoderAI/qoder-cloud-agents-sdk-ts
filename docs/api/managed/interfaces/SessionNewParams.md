[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [managed](../README.md) / SessionNewParams

# Interface: SessionNewParams

## Properties

### agent

> **agent**: [`SessionNewParamsAgentUnion`](../type-aliases/SessionNewParamsAgentUnion.md)

Agent identifier. Accepts the `agent` ID string, which pins the latest version
for the session, or an `agent` object with both id and version specified.

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

### environment\_id

> **environment\_id**: `string`

ID of the `environment` defining the container configuration for this session.

***

### environment\_variables?

> `optional` **environment\_variables?**: `Record`\<`string`, `string`\> \| `null`

***

### initial\_events?

> `optional` **initial\_events?**: [`SessionNewParamsInitialEventUnion`](../type-aliases/SessionNewParamsInitialEventUnion.md)[] \| `null`

Initial events to send to the `session` at creation, processed in order.
Supports `user.message` and `user.define_outcome` events. Maximum 50 events.

***

### metadata?

> `optional` **metadata?**: `Record`\<`string`, `string`\> \| `null`

Arbitrary key-value metadata attached to the session. Maximum 16 pairs, keys up
to 64 chars, values up to 512 chars.

***

### resources?

> `optional` **resources?**: [`SessionNewParamsResourceUnion`](../type-aliases/SessionNewParamsResourceUnion.md)[] \| `null`

Resources (e.g. repositories, files) to mount into the session's container.

***

### title?

> `optional` **title?**: `string` \| `null`

Human-readable session title.

***

### vault\_ids?

> `optional` **vault\_ids?**: `string`[] \| `null`

Vault IDs for stored credentials the agent can use during the session.

***

### workspace\_id?

> `optional` **workspace\_id?**: `string`
