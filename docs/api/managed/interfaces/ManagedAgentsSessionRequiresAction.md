[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [managed](../README.md) / ManagedAgentsSessionRequiresAction

# Interface: ManagedAgentsSessionRequiresAction

The agent is idle waiting on one or more blocking user-input events (tool
confirmation, custom tool result, etc.). Resolving all of them transitions the
session back to running.

## Properties

### event\_ids

> **event\_ids**: `string`[]

The ids of events the agent is blocked on. Resolving fewer than all re-emits
`session.status_idle` with the remainder.

***

### type

> **type**: `"requires_action"`

Any of "requires_action".
