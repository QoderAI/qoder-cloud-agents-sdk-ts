[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [managed](../README.md) / DeploymentNewParams

# Interface: DeploymentNewParams

## Properties

### agent

> **agent**: [`DeploymentNewParamsAgentUnion`](../type-aliases/DeploymentNewParamsAgentUnion.md)

Agent to deploy. Accepts the `agent` ID string, which pins the latest version,
or an `agent` object with both id and version specified. The agent must exist
and not be archived.

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

### description?

> `optional` **description?**: `string` \| `null`

Description of what the deployment does.

***

### environment\_id

> **environment\_id**: `string`

ID of the `environment` defining the container configuration for sessions
created from this deployment.

***

### environment\_variables?

> `optional` **environment\_variables?**: `string` \| `null`

***

### initial\_events

> **initial\_events**: [`ManagedAgentsDeploymentInitialEventParamsUnion`](../type-aliases/ManagedAgentsDeploymentInitialEventParamsUnion.md)[]

Events to send to each session immediately after creation. At least 1,
maximum 50.

***

### metadata?

> `optional` **metadata?**: `Record`\<`string`, `string`\> \| `null`

Arbitrary key-value metadata. Maximum 16 pairs, keys up to 64 chars, values up
to 512 chars.

***

### name

> **name**: `string`

Human-readable name for the deployment.

***

### resources?

> `optional` **resources?**: [`DeploymentNewParamsResourceUnion`](../type-aliases/DeploymentNewParamsResourceUnion.md)[] \| `null`

Resources (e.g. repositories, files) to mount into each session's container.
Maximum 500.

***

### schedule?

> `optional` **schedule?**: [`ManagedAgentsScheduleParams`](ManagedAgentsScheduleParams.md) \| `null`

5-field POSIX cron schedule. Literal wall-clock matching in the configured
timezone.

***

### vault\_ids?

> `optional` **vault\_ids?**: `string`[] \| `null`

Vault IDs for stored credentials the agent can use during sessions created from
this deployment. Maximum 50.

***

### workspace\_id?

> `optional` **workspace\_id?**: `string`
