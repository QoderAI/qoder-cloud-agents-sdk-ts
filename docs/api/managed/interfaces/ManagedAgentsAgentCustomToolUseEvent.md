[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [managed](../README.md) / ManagedAgentsAgentCustomToolUseEvent

# Interface: ManagedAgentsAgentCustomToolUseEvent

Event emitted when the agent calls a custom tool. The session goes idle until
the client sends a `user.custom_tool_result` event with the result.

## Properties

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

Name of the custom tool being called.

***

### processed\_at

> **processed\_at**: `string`

A timestamp in RFC 3339 format

***

### session\_thread\_id?

> `optional` **session\_thread\_id?**: `string` \| `null`

When set, this event was cross-posted from a subagent's thread to surface its
custom tool use on the primary thread's stream. Empty on the thread's own
events. Echo this on a `user.custom_tool_result` event to route the result back.

***

### type

> **type**: `"agent.custom_tool_use"`

Any of "agent.custom_tool_use".
