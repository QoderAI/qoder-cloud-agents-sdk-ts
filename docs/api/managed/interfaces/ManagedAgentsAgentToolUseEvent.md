[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [managed](../README.md) / ManagedAgentsAgentToolUseEvent

# Interface: ManagedAgentsAgentToolUseEvent

Event emitted when the agent invokes a built-in agent tool.

## Properties

### evaluated\_permission?

> `optional` **evaluated\_permission?**: [`ManagedAgentsAgentToolUseEventEvaluatedPermission`](../type-aliases/ManagedAgentsAgentToolUseEventEvaluatedPermission.md)

AgentEvaluatedPermission enum

Any of "allow", "ask", "deny".

***

### id

> **id**: `string`

Unique identifier for this event.

***

### input

> **input**: `Record`\<`string`, `unknown`\>

Input parameters for the tool call.

***

### name

> **name**: `string`

Name of the agent tool being used.

***

### processed\_at

> **processed\_at**: `string`

A timestamp in RFC 3339 format

***

### session\_thread\_id?

> `optional` **session\_thread\_id?**: `string` \| `null`

When set, this event was cross-posted from a subagent's thread to surface its
permission request on the primary thread's stream. Empty on the thread's own
events. Echo this on a `user.tool_confirmation` event to route the approval
back.

***

### type

> **type**: `"agent.tool_use"`

Any of "agent.tool_use".
