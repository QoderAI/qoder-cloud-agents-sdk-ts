[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [managed](../README.md) / SelfHostedWork

# Interface: SelfHostedWork

Work resource representing a unit of work in a self-hosted environment.

Work items are queued when sessions are created or when long-dormant sessions
receive new messages. The Environment Manager polls for work items and executes
them on customer-hosted infrastructure.

## Properties

### acknowledged\_at

> **acknowledged\_at**: `string` \| `null`

RFC 3339 timestamp when work was acknowledged by Environment Manager

***

### created\_at

> **created\_at**: `string`

RFC 3339 timestamp when work was created

***

### data

> **data**: [`SessionWorkData`](SessionWorkData.md)

The actual work to be performed

***

### environment\_id

> **environment\_id**: `string`

Environment identifier this work belongs to (e.g., `env_...`)

***

### id

> **id**: `string`

Work identifier (e.g., 'work\_...')

***

### latest\_heartbeat\_at

> **latest\_heartbeat\_at**: `string` \| `null`

RFC 3339 timestamp of the most recent heartbeat

***

### metadata

> **metadata**: `Record`\<`string`, `string`\>

User-provided metadata key-value pairs associated with this work item

***

### secret

> **secret**: `string`

Credential payload used by the environment worker to execute this work item. May
be populated when polling for work; null on all other retrieval paths.

***

### started\_at

> **started\_at**: `string` \| `null`

RFC 3339 timestamp when work execution started

***

### state

> **state**: [`SelfHostedWorkState`](../type-aliases/SelfHostedWorkState.md)

Current state of the work item

Any of "queued", "starting", "active", "stopping", "stopped".

***

### stop\_requested\_at

> **stop\_requested\_at**: `string` \| `null`

RFC 3339 timestamp when stop was requested

***

### stopped\_at

> **stopped\_at**: `string` \| `null`

RFC 3339 timestamp when work execution stopped

***

### type?

> `optional` **type?**: `"work"`

The type of object (always 'work')
