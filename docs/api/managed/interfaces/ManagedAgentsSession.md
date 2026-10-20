[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [managed](../README.md) / ManagedAgentsSession

# Interface: ManagedAgentsSession

A Managed Agents `session`.

## Properties

### agent

> **agent**: [`ManagedAgentsSessionAgent`](ManagedAgentsSessionAgent.md)

Resolved `agent` definition for a `session`. Snapshot of the `agent` at
`session` creation time.

***

### archived\_at

> **archived\_at**: `string` \| `null`

A timestamp in RFC 3339 format

***

### budget?

> `optional` **budget?**: [`ManagedAgentsBudgetLimit`](ManagedAgentsBudgetLimit.md) \| `null`

A total model and sandbox credit limit. Reaching it rejects the next user
message without interrupting the running turn.

***

### created\_at

> **created\_at**: `string`

A timestamp in RFC 3339 format

***

### deployment\_id?

> `optional` **deployment\_id?**: `string` \| `null`

Deployment ID when the session was created from a deployment reference. Null
otherwise.

***

### environment\_id

> **environment\_id**: `string`

***

### environment\_variables?

> `optional` **environment\_variables?**: `Record`\<`string`, `string`\>

***

### id

> **id**: `string`

***

### metadata

> **metadata**: `Record`\<`string`, `string`\>

***

### outcome\_evaluations

> **outcome\_evaluations**: [`ManagedAgentsOutcomeEvaluationResource`](ManagedAgentsOutcomeEvaluationResource.md)[]

Per-outcome evaluation state. One entry per `define_outcome` event sent to the
session.

***

### resources

> **resources**: [`ManagedAgentsSessionResourceUnion`](../type-aliases/ManagedAgentsSessionResourceUnion.md)[]

***

### stats

> **stats**: [`ManagedAgentsSessionStats`](ManagedAgentsSessionStats.md)

Timing statistics for a session.

***

### status

> **status**: [`ManagedAgentsSessionStatus`](../type-aliases/ManagedAgentsSessionStatus.md)

SessionStatus enum

Any of "rescheduling", "running", "idle", "terminated".

***

### title

> **title**: `string`

***

### type

> **type**: `"session"`

Any of "session".

***

### updated\_at

> **updated\_at**: `string`

A timestamp in RFC 3339 format

***

### usage?

> `optional` **usage?**: [`ManagedAgentsSessionUsage`](ManagedAgentsSessionUsage.md)

Cumulative Credits snapshot. Legacy token and list-cost fields may appear in older responses.

***

### vault\_ids

> **vault\_ids**: `string`[]

Vault IDs attached to the session at creation. Empty when no vaults were
supplied.
