[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [managed](../README.md) / ManagedAgentsAdvisorParams

# Interface: ManagedAgentsAdvisorParams

Platform advisor roster entry: a model the session's primary thread may consult
mid-turn. At most one per roster; the entry occupies the roster name
`qoder.advisor`.

## Properties

### model

> **model**: `string`

A Claude model id. The model must be permitted as an advisor for this agent's
model — see the sessions/threads/advisor spec.

***

### type

> **type**: `"advisor"`

Any of "advisor".
