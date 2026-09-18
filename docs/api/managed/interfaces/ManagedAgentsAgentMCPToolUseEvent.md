[**qca-sdk**](../../README.md)

***

[qca-sdk](../../README.md) / [managed](../README.md) / ManagedAgentsAgentMCPToolUseEvent

# Interface: ManagedAgentsAgentMCPToolUseEvent

Event emitted when the agent invokes a tool provided by an MCP server.

## Properties

### evaluated\_permission?

> `optional` **evaluated\_permission?**: [`ManagedAgentsAgentMCPToolUseEventEvaluatedPermission`](../type-aliases/ManagedAgentsAgentMCPToolUseEventEvaluatedPermission.md)

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

### mcp\_server\_name

> **mcp\_server\_name**: `string`

Name of the MCP server providing the tool.

***

### name

> **name**: `string`

Name of the MCP tool being used.

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

> **type**: `"agent.mcp_tool_use"`

Any of "agent.mcp_tool_use".
