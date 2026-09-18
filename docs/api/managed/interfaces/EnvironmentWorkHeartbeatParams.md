[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [managed](../README.md) / EnvironmentWorkHeartbeatParams

# Interface: EnvironmentWorkHeartbeatParams

## Properties

### betas?

> `optional` **betas?**: `string`[]

Optional header to specify the beta version(s) you want to use.

***

### desired\_ttl\_seconds?

> `optional` **desired\_ttl\_seconds?**: `number`

Desired TTL in seconds

***

### environment\_id

> **environment\_id**: `string`

***

### expected\_last\_heartbeat?

> `optional` **expected\_last\_heartbeat?**: `string`

Expected last_heartbeat for conditional update (optimistic concurrency). Use
literal 'NO_HEARTBEAT' to claim an unclaimed lease (first heartbeat). For
subsequent heartbeats, echo the server's previous last_heartbeat value exactly.
Returns 412 Precondition Failed if the actual value doesn't match.
