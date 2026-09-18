[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [managed](../README.md) / ManagedAgentsErrorDeploymentPausedReason

# Interface: ManagedAgentsErrorDeploymentPausedReason

A scheduled fire recorded a failed run whose error auto-pauses the deployment.

## Properties

### error

> **error**: [`ManagedAgentsDeploymentPausedReasonErrorUnion`](../type-aliases/ManagedAgentsDeploymentPausedReasonErrorUnion.md)

The error that triggered an auto-pause. Matches the failed run's `error.type`.

***

### type

> **type**: `"error"`

Any of "error".
