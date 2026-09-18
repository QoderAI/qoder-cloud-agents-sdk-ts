[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [managed](../README.md) / ManagedAgentsUserToolConfirmationEventParams

# Interface: ManagedAgentsUserToolConfirmationEventParams

Parameters for confirming or denying a tool execution request.

## Properties

### deny\_message?

> `optional` **deny\_message?**: `string` \| `null`

Optional message providing context for a 'deny' decision. Only allowed when
result is 'deny'.

***

### result

> **result**: [`ManagedAgentsUserToolConfirmationEventParamsResult`](../type-aliases/ManagedAgentsUserToolConfirmationEventParamsResult.md)

UserToolConfirmationResult enum

Any of "allow", "deny".

***

### tool\_use\_id

> **tool\_use\_id**: `string`

The id of the `agent.tool_use` or `agent.mcp_tool_use` event this result
corresponds to, which can be found in the last `session.status_idle`
[event's](https://docs.qoder.com/cloud-agents/api/sessions/schemas)
`stop_reason.event_ids` field.

***

### type

> **type**: `"user.tool_confirmation"`

Any of "user.tool_confirmation".
