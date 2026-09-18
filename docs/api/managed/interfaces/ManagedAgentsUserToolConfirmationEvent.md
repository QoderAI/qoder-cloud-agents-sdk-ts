[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [managed](../README.md) / ManagedAgentsUserToolConfirmationEvent

# Interface: ManagedAgentsUserToolConfirmationEvent

A tool confirmation event that approves or denies a pending tool execution.

## Properties

### deny\_message?

> `optional` **deny\_message?**: `string` \| `null`

Optional message providing context for a 'deny' decision. Only allowed when
result is 'deny'.

***

### id

> **id**: `string`

Unique identifier for this event.

***

### processed\_at?

> `optional` **processed\_at?**: `string` \| `null`

A timestamp in RFC 3339 format

***

### result

> **result**: [`ManagedAgentsUserToolConfirmationEventResult`](../type-aliases/ManagedAgentsUserToolConfirmationEventResult.md)

UserToolConfirmationResult enum

Any of "allow", "deny".

***

### session\_thread\_id?

> `optional` **session\_thread\_id?**: `string` \| `null`

When set, the confirmation routes to this subagent's thread rather than the
primary. Echo this from the `session_thread_id` on the `agent.tool_use` or
`agent.mcp_tool_use` event that prompted the approval.

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
