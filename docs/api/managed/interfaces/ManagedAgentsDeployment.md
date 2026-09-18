[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [managed](../README.md) / ManagedAgentsDeployment

# Interface: ManagedAgentsDeployment

A deployment is a configured instance of an agent — it binds the agent to
everything needed to run it autonomously: an environment, credentials, initial
events, and an optional schedule.

## Properties

### agent

> **agent**: [`ManagedAgentsAgentReference`](ManagedAgentsAgentReference.md)

A resolved agent reference with a concrete version.

***

### archived\_at

> **archived\_at**: `string` \| `null`

A timestamp in RFC 3339 format

***

### budget?

> `optional` **budget?**: [`ManagedAgentsBudgetLimit`](ManagedAgentsBudgetLimit.md) \| `null`

A hard spend ceiling. The session stops issuing new model requests once the
tracked list cost reaches `max_list_cost`.

***

### created\_at

> **created\_at**: `string`

A timestamp in RFC 3339 format

***

### description

> **description**: `string`

Description of what the deployment does.

***

### environment\_id

> **environment\_id**: `string`

ID of the `environment` where sessions run.

***

### environment\_variables?

> `optional` **environment\_variables?**: `string`

***

### id

> **id**: `string`

Unique identifier for this deployment.

***

### initial\_events

> **initial\_events**: [`ManagedAgentsDeploymentInitialEventUnion`](../type-aliases/ManagedAgentsDeploymentInitialEventUnion.md)[]

Events sent to each session immediately after creation.

***

### metadata

> **metadata**: `Record`\<`string`, `string`\>

Arbitrary key-value metadata. Maximum 16 pairs.

***

### name

> **name**: `string`

Human-readable name.

***

### paused\_reason

> **paused\_reason**: [`ManagedAgentsDeploymentPausedReasonUnion`](../type-aliases/ManagedAgentsDeploymentPausedReasonUnion.md) \| `null`

Why a deployment is paused. Non-null exactly when `status` is `paused`.

***

### resources

> **resources**: [`ManagedAgentsSessionResourceConfigUnion`](../type-aliases/ManagedAgentsSessionResourceConfigUnion.md)[]

Resources attached to sessions created from this deployment. Echoes the input
minus write-only credentials.

***

### schedule

> **schedule**: [`ManagedAgentsSchedule`](ManagedAgentsSchedule.md)

5-field POSIX cron schedule with computed runtime timestamps.

***

### status

> **status**: [`ManagedAgentsDeploymentStatus`](../type-aliases/ManagedAgentsDeploymentStatus.md)

Lifecycle status of a deployment.

Any of "active", "paused".

***

### type

> **type**: `"deployment"`

Any of "deployment".

***

### updated\_at

> **updated\_at**: `string`

A timestamp in RFC 3339 format

***

### vault\_ids

> **vault\_ids**: `string`[]

Vault IDs supplying stored credentials for sessions created from this
deployment.
