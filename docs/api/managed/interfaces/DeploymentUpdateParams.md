[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [managed](../README.md) / DeploymentUpdateParams

# Interface: DeploymentUpdateParams

## Properties

### agent?

> `optional` **agent?**: [`DeploymentUpdateParamsAgentUnion`](../type-aliases/DeploymentUpdateParamsAgentUnion.md)

Agent to deploy. Accepts the `agent` ID string, which re-pins to the latest
version, or an `agent` object with both id and version specified. Omit to
preserve. Cannot be cleared.

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

Description. Omit to preserve; send empty string or null to clear.

***

### environment\_id?

> `optional` **environment\_id?**: `string`

ID of the `environment` where sessions run. Omit to preserve. Cannot be cleared.

***

### environment\_variables?

> `optional` **environment\_variables?**: `string` \| `null`

***

### initial\_events?

> `optional` **initial\_events?**: [`ManagedAgentsDeploymentInitialEventParamsUnion`](../type-aliases/ManagedAgentsDeploymentInitialEventParamsUnion.md)[]

Initial events. Full replacement. Omit to preserve. Cannot be cleared. At least
1, maximum 50.

***

### metadata?

> `optional` **metadata?**: `Record`\<`string`, `unknown`\> \| `null`

Metadata patch. Set a key to a string to upsert it, or to null to delete it.
Omit the field to preserve. The stored bag is limited to 16 keys (up to 64 chars
each) with values up to 512 chars.

***

### name?

> `optional` **name?**: `string`

Human-readable name. Must be non-empty. Omit to preserve. Cannot be cleared.

***

### resources?

> `optional` **resources?**: [`DeploymentUpdateParamsResourceUnion`](../type-aliases/DeploymentUpdateParamsResourceUnion.md)[] \| `null`

Session resources. Full replacement. Omit to preserve; send empty array or null
to clear. Maximum 500.

***

### schedule?

> `optional` **schedule?**: [`ManagedAgentsScheduleParams`](ManagedAgentsScheduleParams.md) \| `null`

5-field POSIX cron schedule. Literal wall-clock matching in the configured
timezone.

***

### vault\_ids?

> `optional` **vault\_ids?**: `string`[] \| `null`

Vault IDs. Full replacement. Omit to preserve; send empty array or null to
clear. Maximum 50.

***

### workspace\_id?

> `optional` **workspace\_id?**: `string`
