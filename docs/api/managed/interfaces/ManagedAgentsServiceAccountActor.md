[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [managed](../README.md) / ManagedAgentsServiceAccountActor

# Interface: ManagedAgentsServiceAccountActor

Attribution for a write made by a workload authenticated as a service account,
for example via Workload Identity Federation.

## Properties

### service\_account\_id

> **service\_account\_id**: `string`

ID of the service account that performed the write (a `svac_...` value).

***

### type?

> `optional` **type?**: `"service_account_actor"`
