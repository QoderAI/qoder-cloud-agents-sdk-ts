[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [managed](../README.md) / ManagedAgentsDeploymentRun

# Interface: ManagedAgentsDeploymentRun

A persistent, append-only record of a single deployment execution. Records
session creation success or failure — no session lifecycle tracking.

## Properties

### agent

> **agent**: [`ManagedAgentsAgentReference`](ManagedAgentsAgentReference.md)

A resolved agent reference with a concrete version.

***

### created\_at

> **created\_at**: `string`

A timestamp in RFC 3339 format

***

### deployment\_id

> **deployment\_id**: `string`

ID of the deployment that produced this run.

***

### error

> **error**: [`ManagedAgentsDeploymentRunErrorUnion`](../type-aliases/ManagedAgentsDeploymentRunErrorUnion.md) \| `null`

Why the run failed to create a session. The type identifies the failure; message
is human-readable detail.

***

### id

> **id**: `string`

Unique identifier for this run (`drun_...`).

***

### session\_id

> **session\_id**: `string`

Populated on success. Null on creation failure. Exactly one of `session_id` or
`error` is non-null.

***

### trigger\_context

> **trigger\_context**: [`ManagedAgentsTriggerContextUnion`](../type-aliases/ManagedAgentsTriggerContextUnion.md)

Describes what triggered a deployment run, with trigger-specific metadata.

***

### type

> **type**: `"deployment_run"`

Any of "deployment_run".
