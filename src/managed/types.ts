// Generated wire types, verified against the API contracts.

import type { Uploadable } from '../core/uploads.js';

/**
 * Platform advisor roster entry: a model the session's primary thread may consult
 * mid-turn.
 */
export interface ManagedAgentsAdvisor {
  /**
   * The advisor model id.
   */
  model: string;
  /**
   * Any of "advisor".
   */
  type: ManagedAgentsAdvisorType;
}

export type ManagedAgentsAdvisorType = "advisor";

/**
 * A Managed Agents `agent`.
 */
export interface ManagedAgentsAgent {
  id: string;
  /**
   * A timestamp in RFC 3339 format
   */
  archived_at: string | null;
  /**
   * A timestamp in RFC 3339 format
   */
  created_at: string;
  description: string;
  mcp_servers: Array<ManagedAgentsMCPServerURLDefinition>;
  metadata: Record<string, string>;
  /**
   * Model identifier and configuration.
   */
  model: ManagedAgentsModelConfig;
  /**
   * Resolved coordinator topology with a concrete agent roster.
   */
  multiagent: ManagedAgentsMultiagent | null;
  name: string;
  skills: Array<ManagedAgentsAgentSkillUnion>;
  system: string;
  tools: Array<ManagedAgentsAgentToolUnion>;
  /**
   * Any of "agent".
   */
  type: ManagedAgentsAgentType;
  /**
   * A timestamp in RFC 3339 format
   */
  updated_at: string;
  /**
   * The agent's current version. Starts at 1 and increments when the agent is
   * modified.
   */
  version: number;
}

export type ManagedAgentsAgentSkillUnion = ManagedAgentsQoderSkill | ManagedAgentsCustomSkill;

export type ManagedAgentsAgentToolUnion = ManagedAgentsAgentToolset20260401 | ManagedAgentsMCPToolset | ManagedAgentsCustomTool;

export type ManagedAgentsAgentToolUnionConfigs = Array<ManagedAgentsAgentToolConfigUnion> | Array<ManagedAgentsMCPToolConfig>;

export interface ManagedAgentsAgentToolUnionDefaultConfig {
  enabled?: boolean;
  /**
   * This field is a union of
   * `ManagedAgentsAgentToolsetDefaultConfigPermissionPolicyUnion`,
   * `ManagedAgentsMCPToolsetDefaultConfigPermissionPolicyUnion`
   */
  permission_policy?: ManagedAgentsAgentToolUnionDefaultConfigPermissionPolicy;
}

/**
 * ManagedAgentsAgentToolUnionDefaultConfigPermissionPolicy is an implicit
 * subunion of `ManagedAgentsAgentToolUnion`.
 * ManagedAgentsAgentToolUnionDefaultConfigPermissionPolicy provides convenient
 * access to the sub-properties of the union.
 */
export interface ManagedAgentsAgentToolUnionDefaultConfigPermissionPolicy {
  type?: string;
}

export type ManagedAgentsAgentType = "agent";

/**
 * A resolved agent reference with a concrete version.
 */
export interface ManagedAgentsAgentReference {
  id: string;
  /**
   * Any of "agent".
   */
  type: ManagedAgentsAgentReferenceType;
  version: number;
}

export type ManagedAgentsAgentReferenceType = "agent";

export type ManagedAgentsAgentToolConfigUnion = ManagedAgentsBashToolConfig | ManagedAgentsEditToolConfig | ManagedAgentsReadToolConfig | ManagedAgentsWriteToolConfig | ManagedAgentsGlobToolConfig | ManagedAgentsGrepToolConfig | ManagedAgentsWebFetchToolConfig | ManagedAgentsWebSearchToolConfig;

export interface ManagedAgentsAgentToolConfigUnionPermissionPolicy {
  type?: string;
}

export type ManagedAgentsAgentToolConfigParamsUnion = ManagedAgentsBashToolConfigParams | ManagedAgentsEditToolConfigParams | ManagedAgentsReadToolConfigParams | ManagedAgentsWriteToolConfigParams | ManagedAgentsGlobToolConfigParams | ManagedAgentsGrepToolConfigParams | ManagedAgentsWebFetchToolConfigParams | ManagedAgentsWebSearchToolConfigParams;

/**
 * Resolved default configuration for agent tools.
 */
export interface ManagedAgentsAgentToolsetDefaultConfig {
  enabled: boolean;
  /**
   * Permission policy for tool execution.
   */
  permission_policy: ManagedAgentsAgentToolsetDefaultConfigPermissionPolicyUnion;
}

/**
 * ManagedAgentsAgentToolsetDefaultConfigPermissionPolicyUnion contains all
 * possible properties and values from `ManagedAgentsAlwaysAllowPolicy`,
 * `ManagedAgentsAlwaysAskPolicy`.
 */
export type ManagedAgentsAgentToolsetDefaultConfigPermissionPolicyUnion = ManagedAgentsAlwaysAllowPolicy | ManagedAgentsAlwaysAskPolicy;

/**
 * Default configuration for all tools in a toolset.
 */
export interface ManagedAgentsAgentToolsetDefaultConfigParams {
  /**
   * Whether tools are enabled and available to Claude by default. Defaults to true
   * if not specified.
   */
  enabled?: boolean | null;
  /**
   * Permission policy for tool execution.
   */
  permission_policy?: ManagedAgentsAgentToolsetDefaultConfigParamsPermissionPolicyUnion | null;
}

export type ManagedAgentsAgentToolsetDefaultConfigParamsPermissionPolicyUnion = ManagedAgentsAlwaysAllowPolicyParam | ManagedAgentsAlwaysAskPolicyParam;

export interface ManagedAgentsAgentToolset20260401 {
  enabled_tools?: Array<string>;
  disallowed_tools?: Array<string>;
  configs: Array<ManagedAgentsAgentToolConfigUnion>;
  /**
   * Resolved default configuration for agent tools.
   */
  default_config: ManagedAgentsAgentToolsetDefaultConfig;
  /**
   * Any of "agent_toolset_20260401".
   */
  type: ManagedAgentsAgentToolset20260401Type;
}

export type ManagedAgentsAgentToolset20260401Type = "agent_toolset_20260401";

/**
 * Input payload for the `bash` tool of the `agent_toolset_20260401` toolset. All
 * fields are optional; a normal invocation supplies `command`, while
 * `restart=true` (with no `command`) reboots the runner-side bash session.
 */
export interface ManagedAgentsAgentToolset20260401BashInput {
  /**
   * Shell command to execute. Omit only when `restart` is true.
   */
  command?: string;
  /**
   * When true, restart the persistent bash session instead of running a command.
   * Subsequent calls without `restart` will run against the fresh session.
   */
  restart?: boolean;
  /**
   * Per-call timeout in milliseconds. Defaults to the runner-wide tool timeout when
   * omitted or zero.
   */
  timeout_ms?: number;
}

/**
 * Input payload for the `edit` tool. Performs a string replacement in the named
 * file; by default `old_string` must occur exactly once.
 */
export interface ManagedAgentsAgentToolset20260401EditInput {
  /**
   * Path of the file to edit.
   */
  file_path: string;
  /**
   * Replacement text.
   */
  new_string: string;
  /**
   * Substring to find and replace.
   */
  old_string: string;
  /**
   * When true, replace every occurrence of `old_string` instead of requiring a
   * unique match.
   */
  replace_all?: boolean;
}

/**
 * Input payload for the `glob` tool. Returns paths matching a doublestar glob
 * pattern, newest first.
 */
export interface ManagedAgentsAgentToolset20260401GlobInput {
  /**
   * Doublestar glob pattern (e.g. `** /*.go`). Absolute patterns are only permitted
   * when the runner is configured to allow them.
   */
  pattern: string;
  /**
   * Optional directory root to search under. Defaults to the runner's working
   * directory.
   */
  path?: string;
}

/**
 * Input payload for the `grep` tool. Searches file contents for a regular
 * expression, returning matching lines.
 */
export interface ManagedAgentsAgentToolset20260401GrepInput {
  /**
   * Regular expression to search for.
   */
  pattern: string;
  /**
   * Optional directory root to search under. Defaults to the runner's working
   * directory.
   */
  path?: string;
}

/**
 * Configuration for built-in agent tools. Use this to enable or disable groups of
 * tools available to the agent.
 */
export interface ManagedAgentsAgentToolset20260401Params {
  disallowed_tools?: Array<string> | null;
  enabled_tools?: Array<string> | null;
  /**
   * Any of "agent_toolset_20260401".
   */
  type: ManagedAgentsAgentToolset20260401ParamsType;
  /**
   * Per-tool configuration overrides.
   */
  configs?: Array<ManagedAgentsAgentToolConfigParamsUnion> | null;
  /**
   * Default configuration for all tools in a toolset.
   */
  default_config?: ManagedAgentsAgentToolsetDefaultConfigParams | null;
}

export type ManagedAgentsAgentToolset20260401ParamsType = "agent_toolset_20260401";

/**
 * Input payload for the `read` tool. Reads file contents relative to the runner's
 * working directory (or absolute when the runner permits).
 */
export interface ManagedAgentsAgentToolset20260401ReadInput {
  /**
   * Path of the file to read.
   */
  file_path: string;
  /**
   * Optional ``start_line, end_line`` 1-indexed inclusive range. When omitted the
   * entire file is returned. `end_line` of 0 or negative means "to end of file".
   */
  view_range?: Array<number>;
}

/**
 * Input payload for the `write` tool. Writes (overwriting) the entire file
 * contents.
 */
export interface ManagedAgentsAgentToolset20260401WriteInput {
  /**
   * Full file contents to write.
   */
  content: string;
  /**
   * Path of the file to write.
   */
  file_path: string;
}

/**
 * Tool calls are automatically approved without user confirmation.
 */
export interface ManagedAgentsAlwaysAllowPolicy {
  /**
   * Any of "always_allow".
   */
  type: ManagedAgentsAlwaysAllowPolicyType;
}

export type ManagedAgentsAlwaysAllowPolicyType = "always_allow";

/**
 * Tool calls are automatically approved without user confirmation.
 */
export interface ManagedAgentsAlwaysAllowPolicyParam {
  /**
   * Any of "always_allow".
   */
  type: ManagedAgentsAlwaysAllowPolicyType;
}

/**
 * Tool calls require user confirmation before execution.
 */
export interface ManagedAgentsAlwaysAskPolicy {
  /**
   * Any of "always_ask".
   */
  type: ManagedAgentsAlwaysAskPolicyType;
}

export type ManagedAgentsAlwaysAskPolicyType = "always_ask";

/**
 * Tool calls require user confirmation before execution.
 */
export interface ManagedAgentsAlwaysAskPolicyParam {
  /**
   * Any of "always_ask".
   */
  type: ManagedAgentsAlwaysAskPolicyType;
}

/**
 * A resolved Qoder-managed skill.
 */
export interface ManagedAgentsQoderSkill {
  skill_id: string;
  /**
   * Any of "qoder".
   */
  type: ManagedAgentsQoderSkillType;
  version: string;
}

export type ManagedAgentsQoderSkillType = "qoder";

/**
 * An Qoder-managed skill.
 */
export interface ManagedAgentsQoderSkillParams {
  /**
   * Identifier of the Qoder skill (e.g., "xlsx").
   */
  skill_id: string;
  /**
   * Any of "qoder".
   */
  type: ManagedAgentsQoderSkillParamsType;
  /**
   * Version to pin. Defaults to latest if omitted.
   */
  version?: string | null;
}

export type ManagedAgentsQoderSkillParamsType = "qoder";

/**
 * Configuration for the bash tool.
 */
export interface ManagedAgentsBashToolConfig {
  enabled: boolean;
  name?: "bash";
  /**
   * Permission policy for tool execution.
   */
  permission_policy: ManagedAgentsBashToolConfigPermissionPolicyUnion;
  type?: "bash";
}

/**
 * ManagedAgentsBashToolConfigPermissionPolicyUnion contains all possible
 * properties and values from `ManagedAgentsAlwaysAllowPolicy`,
 * `ManagedAgentsAlwaysAskPolicy`.
 */
export type ManagedAgentsBashToolConfigPermissionPolicyUnion = ManagedAgentsAlwaysAllowPolicy | ManagedAgentsAlwaysAskPolicy;

/**
 * Configuration override for the bash tool.
 */
export interface ManagedAgentsBashToolConfigParams {
  /**
   * Whether this tool is enabled and available to Claude. Overrides the
   * default_config setting.
   */
  enabled?: boolean | null;
  /**
   * Permission policy for tool execution.
   */
  permission_policy?: ManagedAgentsBashToolConfigParamsPermissionPolicyUnion | null;
  /**
   * Any of "bash".
   */
  type?: ManagedAgentsBashToolConfigParamsType | null;
  /**
   * Must be "bash".
   *
   * This field can be elided, and will marshal its zero value as "bash".
   */
  name?: "bash" | null;
}

export type ManagedAgentsBashToolConfigParamsPermissionPolicyUnion = ManagedAgentsAlwaysAllowPolicyParam | ManagedAgentsAlwaysAskPolicyParam;

export type ManagedAgentsBashToolConfigParamsType = "bash";

/**
 * A resolved user-created custom skill.
 */
export interface ManagedAgentsCustomSkill {
  skill_id: string;
  /**
   * Any of "custom".
   */
  type: ManagedAgentsCustomSkillType;
  version: string;
}

export type ManagedAgentsCustomSkillType = "custom";

/**
 * A user-created custom skill.
 */
export interface ManagedAgentsCustomSkillParams {
  /**
   * Tagged ID of the custom skill (e.g., "skill_01XJ5...").
   */
  skill_id: string;
  /**
   * Any of "custom".
   */
  type: ManagedAgentsCustomSkillParamsType;
  /**
   * Version to pin. Defaults to latest if omitted.
   */
  version?: string | null;
}

export type ManagedAgentsCustomSkillParamsType = "custom";

/**
 * A custom tool as returned in API responses.
 */
export interface ManagedAgentsCustomTool {
  description: string;
  /**
   * JSON Schema for custom tool input parameters.
   */
  input_schema: ManagedAgentsCustomToolInputSchema;
  name: string;
  /**
   * Any of "custom".
   */
  type: ManagedAgentsCustomToolType;
}

export type ManagedAgentsCustomToolType = "custom";

/**
 * JSON Schema for custom tool input parameters.
 */
export interface ManagedAgentsCustomToolInputSchema {
  type?: "object";
  properties?: Record<string, unknown> | null;
  required?: Array<string> | null;
  extra_fields?: Record<string, unknown>;
}

/**
 * JSON Schema for custom tool input parameters.
 */
export interface ManagedAgentsCustomToolInputSchemaParam {
  properties?: Record<string, unknown> | null;
  required?: Array<string> | null;
  /**
   * This field can be elided, and will marshal its zero value as "object".
   */
  type?: "object" | null;
  /** Additional JSON Schema keywords are sent at the schema root. */
  [key: string]: unknown;
}

/**
 * A custom tool that is executed by the API client rather than the agent. When the
 * agent calls this tool, an `agent.custom_tool_use` event is emitted and the
 * session goes idle, waiting for the client to provide the result via a
 * `user.custom_tool_result` event.
 */
export interface ManagedAgentsCustomToolParams {
  /**
   * Description of what the tool does, shown to the agent to help it decide when to
   * use the tool.
   */
  description: string;
  /**
   * JSON Schema for custom tool input parameters.
   */
  input_schema: ManagedAgentsCustomToolInputSchemaParam;
  /**
   * Unique name for the tool. 1-128 characters; letters, digits, underscores, and
   * hyphens.
   */
  name: string;
  /**
   * Any of "custom".
   */
  type: ManagedAgentsCustomToolParamsType;
}

export type ManagedAgentsCustomToolParamsType = "custom";

/**
 * Configuration for the edit tool.
 */
export interface ManagedAgentsEditToolConfig {
  enabled: boolean;
  name?: "edit";
  /**
   * Permission policy for tool execution.
   */
  permission_policy: ManagedAgentsEditToolConfigPermissionPolicyUnion;
  type?: "edit";
}

/**
 * ManagedAgentsEditToolConfigPermissionPolicyUnion contains all possible
 * properties and values from `ManagedAgentsAlwaysAllowPolicy`,
 * `ManagedAgentsAlwaysAskPolicy`.
 */
export type ManagedAgentsEditToolConfigPermissionPolicyUnion = ManagedAgentsAlwaysAllowPolicy | ManagedAgentsAlwaysAskPolicy;

/**
 * Configuration override for the edit tool.
 */
export interface ManagedAgentsEditToolConfigParams {
  /**
   * Whether this tool is enabled and available to Claude. Overrides the
   * default_config setting.
   */
  enabled?: boolean | null;
  /**
   * Permission policy for tool execution.
   */
  permission_policy?: ManagedAgentsEditToolConfigParamsPermissionPolicyUnion | null;
  /**
   * Any of "edit".
   */
  type?: ManagedAgentsEditToolConfigParamsType | null;
  /**
   * Must be "edit".
   *
   * This field can be elided, and will marshal its zero value as "edit".
   */
  name?: "edit" | null;
}

export type ManagedAgentsEditToolConfigParamsPermissionPolicyUnion = ManagedAgentsAlwaysAllowPolicyParam | ManagedAgentsAlwaysAskPolicyParam;

export type ManagedAgentsEditToolConfigParamsType = "edit";

/**
 * High effort. Favors reasoning depth.
 */
export interface ManagedAgentsEffortHigh {
  /**
   * Any of "high".
   */
  type: ManagedAgentsEffortHighType;
}

export type ManagedAgentsEffortHighType = "high";

/**
 * High effort. Favors reasoning depth.
 */
export interface ManagedAgentsEffortHighParam {
  /**
   * Any of "high".
   */
  type: ManagedAgentsEffortHighType;
}

/**
 * Low effort. Favors latency over reasoning depth.
 */
export interface ManagedAgentsEffortLow {
  /**
   * Any of "low".
   */
  type: ManagedAgentsEffortLowType;
}

export type ManagedAgentsEffortLowType = "low";

/**
 * Low effort. Favors latency over reasoning depth.
 */
export interface ManagedAgentsEffortLowParam {
  /**
   * Any of "low".
   */
  type: ManagedAgentsEffortLowType;
}

/**
 * Maximum effort. Favors reasoning depth over latency.
 */
export interface ManagedAgentsEffortMax {
  /**
   * Any of "max".
   */
  type: ManagedAgentsEffortMaxType;
}

export type ManagedAgentsEffortMaxType = "max";

/**
 * Maximum effort. Favors reasoning depth over latency.
 */
export interface ManagedAgentsEffortMaxParam {
  /**
   * Any of "max".
   */
  type: ManagedAgentsEffortMaxType;
}

/**
 * Medium effort. Balances latency and reasoning depth.
 */
export interface ManagedAgentsEffortMedium {
  /**
   * Any of "medium".
   */
  type: ManagedAgentsEffortMediumType;
}

export type ManagedAgentsEffortMediumType = "medium";

/**
 * Medium effort. Balances latency and reasoning depth.
 */
export interface ManagedAgentsEffortMediumParam {
  /**
   * Any of "medium".
   */
  type: ManagedAgentsEffortMediumType;
}

/**
 * Extra-high effort. Not all models accept this level.
 */
export interface ManagedAgentsEffortXhigh {
  /**
   * Any of "xhigh".
   */
  type: ManagedAgentsEffortXhighType;
}

export type ManagedAgentsEffortXhighType = "xhigh";

/**
 * Extra-high effort. Not all models accept this level.
 */
export interface ManagedAgentsEffortXhighParam {
  /**
   * Any of "xhigh".
   */
  type: ManagedAgentsEffortXhighType;
}

/**
 * Configuration for the glob tool.
 */
export interface ManagedAgentsGlobToolConfig {
  enabled: boolean;
  name?: "glob";
  /**
   * Permission policy for tool execution.
   */
  permission_policy: ManagedAgentsGlobToolConfigPermissionPolicyUnion;
  type?: "glob";
}

/**
 * ManagedAgentsGlobToolConfigPermissionPolicyUnion contains all possible
 * properties and values from `ManagedAgentsAlwaysAllowPolicy`,
 * `ManagedAgentsAlwaysAskPolicy`.
 */
export type ManagedAgentsGlobToolConfigPermissionPolicyUnion = ManagedAgentsAlwaysAllowPolicy | ManagedAgentsAlwaysAskPolicy;

/**
 * Configuration override for the glob tool.
 */
export interface ManagedAgentsGlobToolConfigParams {
  /**
   * Whether this tool is enabled and available to Claude. Overrides the
   * default_config setting.
   */
  enabled?: boolean | null;
  /**
   * Permission policy for tool execution.
   */
  permission_policy?: ManagedAgentsGlobToolConfigParamsPermissionPolicyUnion | null;
  /**
   * Any of "glob".
   */
  type?: ManagedAgentsGlobToolConfigParamsType | null;
  /**
   * Must be "glob".
   *
   * This field can be elided, and will marshal its zero value as "glob".
   */
  name?: "glob" | null;
}

export type ManagedAgentsGlobToolConfigParamsPermissionPolicyUnion = ManagedAgentsAlwaysAllowPolicyParam | ManagedAgentsAlwaysAskPolicyParam;

export type ManagedAgentsGlobToolConfigParamsType = "glob";

/**
 * Configuration for the grep tool.
 */
export interface ManagedAgentsGrepToolConfig {
  enabled: boolean;
  name?: "grep";
  /**
   * Permission policy for tool execution.
   */
  permission_policy: ManagedAgentsGrepToolConfigPermissionPolicyUnion;
  type?: "grep";
}

/**
 * ManagedAgentsGrepToolConfigPermissionPolicyUnion contains all possible
 * properties and values from `ManagedAgentsAlwaysAllowPolicy`,
 * `ManagedAgentsAlwaysAskPolicy`.
 */
export type ManagedAgentsGrepToolConfigPermissionPolicyUnion = ManagedAgentsAlwaysAllowPolicy | ManagedAgentsAlwaysAskPolicy;

/**
 * Configuration override for the grep tool.
 */
export interface ManagedAgentsGrepToolConfigParams {
  /**
   * Whether this tool is enabled and available to Claude. Overrides the
   * default_config setting.
   */
  enabled?: boolean | null;
  /**
   * Permission policy for tool execution.
   */
  permission_policy?: ManagedAgentsGrepToolConfigParamsPermissionPolicyUnion | null;
  /**
   * Any of "grep".
   */
  type?: ManagedAgentsGrepToolConfigParamsType | null;
  /**
   * Must be "grep".
   *
   * This field can be elided, and will marshal its zero value as "grep".
   */
  name?: "grep" | null;
}

export type ManagedAgentsGrepToolConfigParamsPermissionPolicyUnion = ManagedAgentsAlwaysAllowPolicyParam | ManagedAgentsAlwaysAskPolicyParam;

export type ManagedAgentsGrepToolConfigParamsType = "grep";

/**
 * URL-based MCP server connection as returned in API responses.
 */
export interface ManagedAgentsMCPServerURLDefinition {
  name: string;
  /**
   * Any of "url".
   */
  type: ManagedAgentsMCPServerURLDefinitionType;
  url: string;
}

export type ManagedAgentsMCPServerURLDefinitionType = "url";

/**
 * Resolved configuration for a specific MCP tool.
 */
export interface ManagedAgentsMCPToolConfig {
  enabled: boolean;
  name: string;
  /**
   * Permission policy for tool execution.
   */
  permission_policy: ManagedAgentsMCPToolConfigPermissionPolicyUnion;
}

/**
 * ManagedAgentsMCPToolConfigPermissionPolicyUnion contains all possible
 * properties and values from `ManagedAgentsAlwaysAllowPolicy`,
 * `ManagedAgentsAlwaysAskPolicy`.
 */
export type ManagedAgentsMCPToolConfigPermissionPolicyUnion = ManagedAgentsAlwaysAllowPolicy | ManagedAgentsAlwaysAskPolicy;

/**
 * Configuration override for a specific MCP tool.
 */
export interface ManagedAgentsMCPToolConfigParams {
  /**
   * Name of the MCP tool to configure. 1-128 characters.
   */
  name: string;
  /**
   * Whether this tool is enabled. Overrides the `default_config` setting.
   */
  enabled?: boolean | null;
  /**
   * Permission policy for tool execution.
   */
  permission_policy?: ManagedAgentsMCPToolConfigParamsPermissionPolicyUnion | null;
}

export type ManagedAgentsMCPToolConfigParamsPermissionPolicyUnion = ManagedAgentsAlwaysAllowPolicyParam | ManagedAgentsAlwaysAskPolicyParam;

export interface ManagedAgentsMCPToolset {
  configs: Array<ManagedAgentsMCPToolConfig>;
  /**
   * Resolved default configuration for all tools from an MCP server.
   */
  default_config: ManagedAgentsMCPToolsetDefaultConfig;
  mcp_server_name: string;
  /**
   * Any of "mcp_toolset".
   */
  type: ManagedAgentsMCPToolsetType;
}

export type ManagedAgentsMCPToolsetType = "mcp_toolset";

/**
 * Resolved default configuration for all tools from an MCP server.
 */
export interface ManagedAgentsMCPToolsetDefaultConfig {
  enabled: boolean;
  /**
   * Permission policy for tool execution.
   */
  permission_policy: ManagedAgentsMCPToolsetDefaultConfigPermissionPolicyUnion;
}

/**
 * ManagedAgentsMCPToolsetDefaultConfigPermissionPolicyUnion contains all
 * possible properties and values from `ManagedAgentsAlwaysAllowPolicy`,
 * `ManagedAgentsAlwaysAskPolicy`.
 */
export type ManagedAgentsMCPToolsetDefaultConfigPermissionPolicyUnion = ManagedAgentsAlwaysAllowPolicy | ManagedAgentsAlwaysAskPolicy;

/**
 * Default configuration for all tools from an MCP server.
 */
export interface ManagedAgentsMCPToolsetDefaultConfigParams {
  /**
   * Whether tools are enabled by default. Defaults to true if not specified.
   */
  enabled?: boolean | null;
  /**
   * Permission policy for tool execution.
   */
  permission_policy?: ManagedAgentsMCPToolsetDefaultConfigParamsPermissionPolicyUnion | null;
}

export type ManagedAgentsMCPToolsetDefaultConfigParamsPermissionPolicyUnion = ManagedAgentsAlwaysAllowPolicyParam | ManagedAgentsAlwaysAskPolicyParam;

/**
 * Configuration for tools from an MCP server defined in `mcp_servers`.
 */
export interface ManagedAgentsMCPToolsetParams {
  /**
   * Name of the MCP server. Must match a server name from the mcp_servers array.
   * 1-255 characters.
   */
  mcp_server_name: string;
  /**
   * Any of "mcp_toolset".
   */
  type: ManagedAgentsMCPToolsetParamsType;
  /**
   * Per-tool configuration overrides.
   */
  configs?: Array<ManagedAgentsMCPToolConfigParams> | null;
  /**
   * Default configuration for all tools from an MCP server.
   */
  default_config?: ManagedAgentsMCPToolsetDefaultConfigParams | null;
}

export type ManagedAgentsMCPToolsetParamsType = "mcp_toolset";

/**
 * The model that will power your agent.
 *
 * See [models](https://docs.qoder.com/cloud-agents/api/models/list) for additional
 * details and options.
 */
export type ManagedAgentsModel = "claude-fable-5-1" | "claude-sonnet-5" | "claude-fable-5" | "claude-opus-5" | "claude-opus-4-8" | "claude-opus-4-7" | "claude-opus-4-6" | "claude-sonnet-4-6" | "claude-haiku-4-5" | "claude-haiku-4-5-20251001" | "claude-opus-4-5" | "claude-opus-4-5-20251101" | "claude-sonnet-4-5" | "claude-sonnet-4-5-20250929" | (string & {});

/**
 * Model identifier and configuration.
 */
export type ManagedAgentsModelConfig = string | {
  context_window?: number;
  /**
   * The model that will power your agent.
   *
   * See [models](https://docs.qoder.com/cloud-agents/api/models/list) for additional
   * details and options.
   */
  id: ManagedAgentsModel;
  /**
   * How hard Claude works on each turn. Sets `output_config.effort` on every
   * Messages call the session makes.
   */
  effort?: ManagedAgentsModelConfigEffortUnion;
  /**
   * Geographic region for model inference. When unset, requests fall through to the
   * workspace's default_inference_geo.
   */
  inference_geo?: string;
  /**
   * Inference speed mode. `fast` provides significantly faster output token
   * generation at premium pricing. Not all models support `fast`; invalid
   * combinations are rejected at create time.
   *
   * Any of "standard", "fast".
   */
  speed?: ManagedAgentsModelConfigSpeed;
};

export type ManagedAgentsModelConfigEffortUnion = ManagedAgentsEffortLow | ManagedAgentsEffortMedium | ManagedAgentsEffortHigh | ManagedAgentsEffortXhigh | ManagedAgentsEffortMax | "low" | "medium" | "high" | "xhigh" | "max";

/**
 * Inference speed mode. `fast` provides significantly faster output token
 * generation at premium pricing. Not all models support `fast`; invalid
 * combinations are rejected at create time.
 */
export type ManagedAgentsModelConfigSpeed = "standard" | "fast";

/**
 * An object that defines additional configuration control over model use
 */
export type ManagedAgentsModelConfigParams = string | {
  context_window?: number | null;
  /**
   * The model that will power your agent.
   *
   * See [models](https://docs.qoder.com/cloud-agents/api/models/list) for additional
   * details and options.
   */
  id: ManagedAgentsModel;
  /**
   * Geographic region for model inference. When unset, requests fall through to the
   * workspace's default_inference_geo. On update, `model` is whole-object
   * replacement — omitting inference_geo clears it.
   */
  inference_geo?: string | null;
  /**
   * How hard Claude works on each inference call. Accepts a bare level string
   * (`"high"`) or `{"type": "high"}`. On create, omitting it resolves the per-model
   * default; on update, omitting it leaves the stored value unchanged.
   */
  effort?: ManagedAgentsModelConfigParamsEffortUnion | null;
  /**
   * Inference speed mode. `fast` provides significantly faster output token
   * generation at premium pricing. Not all models support `fast`; invalid
   * combinations are rejected at create time.
   *
   * Any of "standard", "fast".
   */
  speed?: ManagedAgentsModelConfigParamsSpeed | null;
};

export type ManagedAgentsModelConfigParamsEffortUnion = string | ManagedAgentsEffortLowParam | ManagedAgentsEffortMediumParam | ManagedAgentsEffortHighParam | ManagedAgentsEffortXhighParam | ManagedAgentsEffortMaxParam;

/**
 * How hard Claude works on each turn. Higher levels favor reasoning depth over
 * latency. Not all models accept every level; invalid combinations are rejected at
 * create time.
 */
export type ManagedAgentsModelConfigParamsEffortManagedAgentsEffortLevel = "low" | "medium" | "high" | "xhigh" | "max";

/**
 * Inference speed mode. `fast` provides significantly faster output token
 * generation at premium pricing. Not all models support `fast`; invalid
 * combinations are rejected at create time.
 */
export type ManagedAgentsModelConfigParamsSpeed = "standard" | "fast";

/**
 * Sentinel roster entry meaning "the agent that owns this configuration". Resolved
 * server-side to a concrete agent reference.
 */
export interface ManagedAgentsMultiagentSelfParams {
  /**
   * Any of "self".
   */
  type: ManagedAgentsMultiagentSelfParamsType;
}

export type ManagedAgentsMultiagentSelfParamsType = "self";

/**
 * Configuration for the read tool.
 */
export interface ManagedAgentsReadToolConfig {
  enabled: boolean;
  name?: "read";
  /**
   * Permission policy for tool execution.
   */
  permission_policy: ManagedAgentsReadToolConfigPermissionPolicyUnion;
  type?: "read";
}

/**
 * ManagedAgentsReadToolConfigPermissionPolicyUnion contains all possible
 * properties and values from `ManagedAgentsAlwaysAllowPolicy`,
 * `ManagedAgentsAlwaysAskPolicy`.
 */
export type ManagedAgentsReadToolConfigPermissionPolicyUnion = ManagedAgentsAlwaysAllowPolicy | ManagedAgentsAlwaysAskPolicy;

/**
 * Configuration override for the read tool.
 */
export interface ManagedAgentsReadToolConfigParams {
  /**
   * Whether this tool is enabled and available to Claude. Overrides the
   * default_config setting.
   */
  enabled?: boolean | null;
  /**
   * Permission policy for tool execution.
   */
  permission_policy?: ManagedAgentsReadToolConfigParamsPermissionPolicyUnion | null;
  /**
   * Any of "read".
   */
  type?: ManagedAgentsReadToolConfigParamsType | null;
  /**
   * Must be "read".
   *
   * This field can be elided, and will marshal its zero value as "read".
   */
  name?: "read" | null;
}

export type ManagedAgentsReadToolConfigParamsPermissionPolicyUnion = ManagedAgentsAlwaysAllowPolicyParam | ManagedAgentsAlwaysAskPolicyParam;

export type ManagedAgentsReadToolConfigParamsType = "read";

/**
 * Resolved `agent` definition for a single `session_thread`. Snapshot of the agent
 * at thread creation time. The multiagent roster is not repeated here; read it
 * from `Session.agent`.
 */
export interface ManagedAgentsSessionThreadAgent {
  id: string;
  description: string;
  mcp_servers: Array<ManagedAgentsMCPServerURLDefinition>;
  /**
   * Model identifier and configuration.
   */
  model: ManagedAgentsModelConfig;
  name: string;
  skills: Array<ManagedAgentsSessionThreadAgentSkillUnion>;
  system: string;
  tools: Array<ManagedAgentsSessionThreadAgentToolUnion>;
  /**
   * Any of "agent".
   */
  type: ManagedAgentsSessionThreadAgentType;
  version: number;
}

export type ManagedAgentsSessionThreadAgentSkillUnion = ManagedAgentsQoderSkill | ManagedAgentsCustomSkill;

export type ManagedAgentsSessionThreadAgentToolUnion = ManagedAgentsAgentToolset20260401 | ManagedAgentsMCPToolset | ManagedAgentsCustomTool;

export type ManagedAgentsSessionThreadAgentToolUnionConfigs = Array<ManagedAgentsAgentToolConfigUnion> | Array<ManagedAgentsMCPToolConfig>;

/**
 * ManagedAgentsSessionThreadAgentToolUnionDefaultConfig is an implicit
 * subunion of `ManagedAgentsSessionThreadAgentToolUnion`.
 * ManagedAgentsSessionThreadAgentToolUnionDefaultConfig provides convenient
 * access to the sub-properties of the union.
 */
export interface ManagedAgentsSessionThreadAgentToolUnionDefaultConfig {
  enabled?: boolean;
  /**
   * This field is a union of
   * `ManagedAgentsAgentToolsetDefaultConfigPermissionPolicyUnion`,
   * `ManagedAgentsMCPToolsetDefaultConfigPermissionPolicyUnion`
   */
  permission_policy?: ManagedAgentsSessionThreadAgentToolUnionDefaultConfigPermissionPolicy;
}

export interface ManagedAgentsSessionThreadAgentToolUnionDefaultConfigPermissionPolicy {
  type?: string;
}

export type ManagedAgentsSessionThreadAgentType = "agent";

export type ManagedAgentsSkillParamsUnion = ManagedAgentsQoderSkillParams | ManagedAgentsCustomSkillParams;

/**
 * URL-based MCP server connection.
 */
export interface ManagedAgentsURLMCPServerParams {
  /**
   * Unique name for this server, referenced by mcp_toolset configurations. 1-255
   * characters.
   */
  name: string;
  /**
   * Any of "url".
   */
  type: ManagedAgentsURLMCPServerParamsType;
  /**
   * Endpoint URL for the MCP server.
   */
  url: string;
}

export type ManagedAgentsURLMCPServerParamsType = "url";

/**
 * Approximate user location for search result localization.
 */
export interface ManagedAgentsUserLocation {
  /**
   * Location precision. Only "approximate" is supported.
   */
  type?: "approximate";
  /**
   * City name.
   */
  city?: string | null;
  /**
   * Two-letter ISO 3166-1 country code, uppercase.
   */
  country?: string | null;
  /**
   * Region or state name.
   */
  region?: string | null;
  /**
   * IANA timezone identifier, e.g. "America/Los_Angeles".
   */
  timezone?: string | null;
}

/**
 * Approximate user location for search result localization.
 */
export interface ManagedAgentsUserLocationParam {
  /**
   * City name.
   */
  city?: string | null;
  /**
   * Two-letter ISO 3166-1 country code, uppercase.
   */
  country?: string | null;
  /**
   * Region or state name.
   */
  region?: string | null;
  /**
   * IANA timezone identifier, e.g. "America/Los_Angeles".
   */
  timezone?: string | null;
  /**
   * Location precision. Only "approximate" is supported.
   *
   * This field can be elided, and will marshal its zero value as "approximate".
   */
  type?: "approximate" | null;
}

/**
 * Configuration for the web_fetch tool.
 */
export interface ManagedAgentsWebFetchToolConfig {
  enabled: boolean;
  name?: "web_fetch";
  /**
   * Permission policy for tool execution.
   */
  permission_policy: ManagedAgentsWebFetchToolConfigPermissionPolicyUnion;
  type?: "web_fetch";
  allowed_domains?: Array<string>;
  blocked_domains?: Array<string>;
  max_content_tokens?: number | null;
}

/**
 * ManagedAgentsWebFetchToolConfigPermissionPolicyUnion contains all possible
 * properties and values from `ManagedAgentsAlwaysAllowPolicy`,
 * `ManagedAgentsAlwaysAskPolicy`.
 */
export type ManagedAgentsWebFetchToolConfigPermissionPolicyUnion = ManagedAgentsAlwaysAllowPolicy | ManagedAgentsAlwaysAskPolicy;

/**
 * Configuration override for the web_fetch tool.
 */
export interface ManagedAgentsWebFetchToolConfigParams {
  /**
   * Whether this tool is enabled and available to Claude. Overrides the
   * default_config setting.
   */
  enabled?: boolean | null;
  /**
   * Maximum number of tokens of fetched text content to include in context per call.
   * Does not apply to binary content such as PDFs.
   */
  max_content_tokens?: number | null;
  /**
   * Permission policy for tool execution.
   */
  permission_policy?: ManagedAgentsWebFetchToolConfigParamsPermissionPolicyUnion | null;
  /**
   * Only fetch URLs whose host is one of these domains or a subdomain of one. Each
   * entry is a plain hostname like "docs.example.com" (no scheme, port, or path). At
   * most 64 entries; an empty list is rejected (omit the field instead). Cannot be
   * combined with blocked_domains.
   */
  allowed_domains?: Array<string> | null;
  /**
   * Never fetch URLs whose host is one of these domains or a subdomain of one. Each
   * entry is a plain hostname like "ads.example.com" (no scheme, port, or path). At
   * most 64 entries; an empty list is rejected (omit the field instead). Cannot be
   * combined with allowed_domains.
   */
  blocked_domains?: Array<string> | null;
  /**
   * Any of "web_fetch".
   */
  type?: ManagedAgentsWebFetchToolConfigParamsType | null;
  /**
   * Must be "web_fetch".
   *
   * This field can be elided, and will marshal its zero value as "web_fetch".
   */
  name?: "web_fetch" | null;
}

export type ManagedAgentsWebFetchToolConfigParamsPermissionPolicyUnion = ManagedAgentsAlwaysAllowPolicyParam | ManagedAgentsAlwaysAskPolicyParam;

export type ManagedAgentsWebFetchToolConfigParamsType = "web_fetch";

/**
 * Configuration for the web_search tool.
 */
export interface ManagedAgentsWebSearchToolConfig {
  enabled: boolean;
  name?: "web_search";
  /**
   * Permission policy for tool execution.
   */
  permission_policy: ManagedAgentsWebSearchToolConfigPermissionPolicyUnion;
  type?: "web_search";
  allowed_domains?: Array<string>;
  blocked_domains?: Array<string>;
  /**
   * Approximate user location for search result localization.
   */
  user_location?: ManagedAgentsUserLocation | null;
}

/**
 * ManagedAgentsWebSearchToolConfigPermissionPolicyUnion contains all possible
 * properties and values from `ManagedAgentsAlwaysAllowPolicy`,
 * `ManagedAgentsAlwaysAskPolicy`.
 */
export type ManagedAgentsWebSearchToolConfigPermissionPolicyUnion = ManagedAgentsAlwaysAllowPolicy | ManagedAgentsAlwaysAskPolicy;

/**
 * Configuration override for the web_search tool.
 */
export interface ManagedAgentsWebSearchToolConfigParams {
  /**
   * Whether this tool is enabled and available to Claude. Overrides the
   * default_config setting.
   */
  enabled?: boolean | null;
  /**
   * Permission policy for tool execution.
   */
  permission_policy?: ManagedAgentsWebSearchToolConfigParamsPermissionPolicyUnion | null;
  /**
   * Only return search results whose host is one of these domains or a subdomain of
   * one. Each entry is a plain hostname like "docs.example.com" (no scheme or port;
   * an optional path suffix is accepted). At most 64 entries; an empty list is
   * rejected (omit the field instead). Cannot be combined with blocked_domains.
   */
  allowed_domains?: Array<string> | null;
  /**
   * Never return search results whose host is one of these domains or a subdomain of
   * one. Each entry is a plain hostname like "ads.example.com" (no scheme or port;
   * an optional path suffix is accepted). At most 64 entries; an empty list is
   * rejected (omit the field instead). Cannot be combined with allowed_domains.
   */
  blocked_domains?: Array<string> | null;
  /**
   * Any of "web_search".
   */
  type?: ManagedAgentsWebSearchToolConfigParamsType | null;
  /**
   * Approximate user location for search result localization.
   */
  user_location?: ManagedAgentsUserLocationParam | null;
  /**
   * Must be "web_search".
   *
   * This field can be elided, and will marshal its zero value as "web_search".
   */
  name?: "web_search" | null;
}

export type ManagedAgentsWebSearchToolConfigParamsPermissionPolicyUnion = ManagedAgentsAlwaysAllowPolicyParam | ManagedAgentsAlwaysAskPolicyParam;

export type ManagedAgentsWebSearchToolConfigParamsType = "web_search";

/**
 * Configuration for the write tool.
 */
export interface ManagedAgentsWriteToolConfig {
  enabled: boolean;
  name?: "write";
  /**
   * Permission policy for tool execution.
   */
  permission_policy: ManagedAgentsWriteToolConfigPermissionPolicyUnion;
  type?: "write";
}

/**
 * ManagedAgentsWriteToolConfigPermissionPolicyUnion contains all possible
 * properties and values from `ManagedAgentsAlwaysAllowPolicy`,
 * `ManagedAgentsAlwaysAskPolicy`.
 */
export type ManagedAgentsWriteToolConfigPermissionPolicyUnion = ManagedAgentsAlwaysAllowPolicy | ManagedAgentsAlwaysAskPolicy;

/**
 * Configuration override for the write tool.
 */
export interface ManagedAgentsWriteToolConfigParams {
  /**
   * Whether this tool is enabled and available to Claude. Overrides the
   * default_config setting.
   */
  enabled?: boolean | null;
  /**
   * Permission policy for tool execution.
   */
  permission_policy?: ManagedAgentsWriteToolConfigParamsPermissionPolicyUnion | null;
  /**
   * Any of "write".
   */
  type?: ManagedAgentsWriteToolConfigParamsType | null;
  /**
   * Must be "write".
   *
   * This field can be elided, and will marshal its zero value as "write".
   */
  name?: "write" | null;
}

export type ManagedAgentsWriteToolConfigParamsPermissionPolicyUnion = ManagedAgentsAlwaysAllowPolicyParam | ManagedAgentsAlwaysAskPolicyParam;

export type ManagedAgentsWriteToolConfigParamsType = "write";

export interface AgentNewParams {
  /**
   * Model identifier. Accepts the
   * [model string](https://docs.qoder.com/cloud-agents/api/models/list),
   * e.g. `claude-opus-5`, or a `model_config` object for additional configuration
   * control
   */
  model: ManagedAgentsModelConfigParams;
  /**
   * Human-readable name for the agent.
   */
  name: string;
  /**
   * Description of what the agent does.
   */
  description?: string | null;
  /**
   * System prompt for the agent.
   */
  system?: string | null;
  workspace_id?: string;
  /**
   * MCP servers this agent connects to. Maximum 20. Names must be unique within the
   * array. Every server must be referenced by an `mcp_toolset` in `tools`;
   * unreferenced servers are rejected. See the
   * [MCP connector guide](https://docs.qoder.com/cloud-agents/api/agents/schemas).
   */
  mcp_servers?: Array<ManagedAgentsURLMCPServerParams> | null;
  /**
   * Arbitrary key-value metadata. Maximum 16 pairs, keys up to 64 chars, values up
   * to 512 chars.
   */
  metadata?: Record<string, string> | null;
  /**
   * A coordinator topology: the session's primary thread orchestrates work by
   * spawning session threads, each running an agent drawn from the `agents` roster.
   */
  multiagent?: ManagedAgentsMultiagentParams | null;
  /**
   * Skills available to the agent.
   */
  skills?: Array<ManagedAgentsSkillParamsUnion> | null;
  /**
   * Tool configurations available to the agent. Maximum of 128 tools across all
   * toolsets allowed.
   */
  tools?: Array<AgentNewParamsToolUnion> | null;
  /**
   * Optional header to specify the beta version(s) you want to use.
   */
  betas?: Array<QoderBeta>;
}

export type AgentNewParamsToolUnion = ManagedAgentsAgentToolset20260401Params | ManagedAgentsMCPToolsetParams | ManagedAgentsCustomToolParams;

export interface AgentGetParams {
  /**
   * Agent version. Omit for the most recent version. Must be at least 1 if
   * specified.
   */
  version?: number;
  workspace_id?: string;
  /**
   * Optional header to specify the beta version(s) you want to use.
   */
  betas?: Array<QoderBeta>;
}

export interface AgentUpdateParams {
  /**
   * Description. Omit to preserve; send empty string or null to clear.
   */
  description?: string | null;
  /**
   * System prompt. Omit to preserve; send empty string or null to clear.
   */
  system?: string | null;
  /**
   * Human-readable name. Must be non-empty. Omit to preserve. Cannot be cleared.
   */
  name?: string;
  /**
   * The agent's current version, used to prevent concurrent overwrites. Obtain this
   * value from a create or retrieve response. Must be at least 1 if specified. When
   * supplied, the request fails if it does not match the server's current version;
   * omit to apply the update unconditionally.
   */
  version?: number | null;
  workspace_id?: string;
  /**
   * MCP servers. Full replacement. Omit to preserve; send empty array or `null` to
   * clear. Names must be unique. Maximum 20. Every server must be referenced by an
   * `mcp_toolset` in the agent's resulting `tools`; unreferenced servers are
   * rejected. See the
   * [MCP connector guide](https://docs.qoder.com/cloud-agents/api/agents/schemas).
   */
  mcp_servers?: Array<ManagedAgentsURLMCPServerParams> | null;
  /**
   * Metadata patch. Set a key to a string to upsert it, or to null to delete it.
   * Omit the field to preserve. The stored bag is limited to 16 keys (up to 64 chars
   * each) with values up to 512 chars.
   */
  metadata?: Record<string, unknown> | null;
  /**
   * Skills. Full replacement. Omit to preserve; send empty array or null to clear.
   */
  skills?: Array<ManagedAgentsSkillParamsUnion> | null;
  /**
   * Tool configurations available to the agent. Full replacement. Omit to preserve;
   * send empty array or null to clear. Maximum of 128 tools across all toolsets
   * allowed.
   */
  tools?: Array<AgentUpdateParamsToolUnion> | null;
  /**
   * Model identifier. Accepts the
   * [model string](https://docs.qoder.com/cloud-agents/api/models/list),
   * e.g. `claude-opus-5`, or a `model_config` object for additional configuration
   * control. Omit to preserve. Cannot be cleared.
   */
  model?: ManagedAgentsModelConfigParams;
  /**
   * A coordinator topology: the session's primary thread orchestrates work by
   * spawning session threads, each running an agent drawn from the `agents` roster.
   */
  multiagent?: ManagedAgentsMultiagentParams | null;
  /**
   * Optional header to specify the beta version(s) you want to use.
   */
  betas?: Array<QoderBeta>;
}

export type AgentUpdateParamsToolUnion = ManagedAgentsAgentToolset20260401Params | ManagedAgentsMCPToolsetParams | ManagedAgentsCustomToolParams;

export interface AgentListParams {
  /**
   * Return agents created at or after this time (inclusive).
   */
  "created_at[gte]"?: string;
  /**
   * Return agents created at or before this time (inclusive).
   */
  "created_at[lte]"?: string;
  /**
   * Include archived agents in results. Defaults to false.
   */
  include_archived?: boolean;
  /**
   * Maximum results per page. Default 20, maximum 100.
   */
  limit?: number;
  /**
   * Opaque pagination cursor from a previous response.
   */
  page?: string;
  workspace_id?: string;
  /**
   * Optional header to specify the beta version(s) you want to use.
   */
  betas?: Array<QoderBeta>;
}

export interface AgentArchiveParams {
  workspace_id?: string;
  /**
   * Optional header to specify the beta version(s) you want to use.
   */
  betas?: Array<QoderBeta>;
}

export interface AgentVersionListParams {
  /**
   * Maximum results per page. Default 20, maximum 100.
   */
  limit?: number;
  /**
   * Opaque pagination cursor.
   */
  page?: string;
  workspace_id?: string;
  /**
   * Optional header to specify the beta version(s) you want to use.
   */
  betas?: Array<QoderBeta>;
}

/**
 * The deployment's agent was archived.
 */
export interface ManagedAgentsAgentArchivedDeploymentPausedReasonError {
  /**
   * Any of "agent_archived_error".
   */
  type: ManagedAgentsAgentArchivedDeploymentPausedReasonErrorType;
}

export type ManagedAgentsAgentArchivedDeploymentPausedReasonErrorType = "agent_archived_error";

/**
 * A deployment is a configured instance of an agent — it binds the agent to
 * everything needed to run it autonomously: an environment, credentials, initial
 * events, and an optional schedule.
 */
export interface ManagedAgentsDeployment {
  environment_variables?: string;
  /**
   * Unique identifier for this deployment.
   */
  id: string;
  /**
   * A resolved agent reference with a concrete version.
   */
  agent: ManagedAgentsAgentReference;
  /**
   * A timestamp in RFC 3339 format
   */
  archived_at: string | null;
  /**
   * A timestamp in RFC 3339 format
   */
  created_at: string;
  /**
   * Description of what the deployment does.
   */
  description: string;
  /**
   * ID of the `environment` where sessions run.
   */
  environment_id: string;
  /**
   * Events sent to each session immediately after creation.
   */
  initial_events: Array<ManagedAgentsDeploymentInitialEventUnion>;
  /**
   * Arbitrary key-value metadata. Maximum 16 pairs.
   */
  metadata: Record<string, string>;
  /**
   * Human-readable name.
   */
  name: string;
  /**
   * Why a deployment is paused. Non-null exactly when `status` is `paused`.
   */
  paused_reason: ManagedAgentsDeploymentPausedReasonUnion | null;
  /**
   * Resources attached to sessions created from this deployment. Echoes the input
   * minus write-only credentials.
   */
  resources: Array<ManagedAgentsSessionResourceConfigUnion>;
  /**
   * 5-field POSIX cron schedule with computed runtime timestamps.
   */
  schedule: ManagedAgentsSchedule;
  /**
   * Lifecycle status of a deployment.
   *
   * Any of "active", "paused".
   */
  status: ManagedAgentsDeploymentStatus;
  /**
   * Any of "deployment".
   */
  type: ManagedAgentsDeploymentType;
  /**
   * A timestamp in RFC 3339 format
   */
  updated_at: string;
  /**
   * Vault IDs supplying stored credentials for sessions created from this
   * deployment.
   */
  vault_ids: Array<string>;
  /**
   * A hard spend ceiling. The session stops issuing new model requests once the
   * tracked list cost reaches `max_list_cost`.
   */
  budget?: ManagedAgentsBudgetLimit | null;
}

export type ManagedAgentsDeploymentType = "deployment";

export type ManagedAgentsDeploymentInitialEventUnion = ManagedAgentsDeploymentUserMessageEvent | ManagedAgentsDeploymentUserDefineOutcomeEvent | ManagedAgentsDeploymentSystemMessageEvent;

export type ManagedAgentsDeploymentInitialEventUnionContent = Array<ManagedAgentsDeploymentUserMessageEventContentUnion> | Array<ManagedAgentsSystemContentBlock>;

export type ManagedAgentsDeploymentInitialEventParamsUnion = ManagedAgentsUserMessageEventParams | ManagedAgentsUserDefineOutcomeEventParams | ManagedAgentsSystemMessageEventParams;

export type ManagedAgentsDeploymentPausedReasonUnion = ManagedAgentsManualDeploymentPausedReason | ManagedAgentsErrorDeploymentPausedReason;

/**
 * ManagedAgentsDeploymentPausedReasonErrorUnion contains all possible
 * properties and values from
 * `ManagedAgentsEnvironmentArchivedDeploymentPausedReasonError`,
 * `ManagedAgentsAgentArchivedDeploymentPausedReasonError`,
 * `ManagedAgentsEnvironmentNotFoundDeploymentPausedReasonError`,
 * `ManagedAgentsVaultNotFoundDeploymentPausedReasonError`,
 * `ManagedAgentsFileNotFoundDeploymentPausedReasonError`,
 * `ManagedAgentsSessionResourceNotFoundDeploymentPausedReasonError`,
 * `ManagedAgentsWorkspaceArchivedDeploymentPausedReasonError`,
 * `ManagedAgentsOrganizationDisabledDeploymentPausedReasonError`,
 * `ManagedAgentsMemoryStoreArchivedDeploymentPausedReasonError`,
 * `ManagedAgentsSkillNotFoundDeploymentPausedReasonError`,
 * `ManagedAgentsVaultArchivedDeploymentPausedReasonError`,
 * `ManagedAgentsUnknownDeploymentPausedReasonError`,
 * `ManagedAgentsSelfHostedResourcesUnsupportedDeploymentPausedReasonError`,
 * `ManagedAgentsMCPEgressBlockedDeploymentPausedReasonError`.
 */
export type ManagedAgentsDeploymentPausedReasonErrorUnion = ManagedAgentsEnvironmentArchivedDeploymentPausedReasonError | ManagedAgentsAgentArchivedDeploymentPausedReasonError | ManagedAgentsEnvironmentNotFoundDeploymentPausedReasonError | ManagedAgentsVaultNotFoundDeploymentPausedReasonError | ManagedAgentsFileNotFoundDeploymentPausedReasonError | ManagedAgentsSessionResourceNotFoundDeploymentPausedReasonError | ManagedAgentsWorkspaceArchivedDeploymentPausedReasonError | ManagedAgentsOrganizationDisabledDeploymentPausedReasonError | ManagedAgentsMemoryStoreArchivedDeploymentPausedReasonError | ManagedAgentsSkillNotFoundDeploymentPausedReasonError | ManagedAgentsVaultArchivedDeploymentPausedReasonError | ManagedAgentsUnknownDeploymentPausedReasonError | ManagedAgentsSelfHostedResourcesUnsupportedDeploymentPausedReasonError | ManagedAgentsMCPEgressBlockedDeploymentPausedReasonError;

/**
 * Lifecycle status of a deployment.
 */
export type ManagedAgentsDeploymentStatus = "active" | "paused";

/**
 * Privileged context for the accompanying turn and all subsequent turns, appended
 * to the session's system context as a `role: "system"` turn rather than replacing
 * the top-level system prompt.
 */
export interface ManagedAgentsDeploymentSystemMessageEvent {
  /**
   * System content blocks to append. Text-only.
   */
  content: Array<ManagedAgentsSystemContentBlock>;
  /**
   * Any of "system.message".
   */
  type: ManagedAgentsDeploymentSystemMessageEventType;
}

export type ManagedAgentsDeploymentSystemMessageEventType = "system.message";

/**
 * An outcome the agent should work toward. The agent begins work on receipt.
 */
export interface ManagedAgentsDeploymentUserDefineOutcomeEvent {
  /**
   * What the agent should produce. This is the task specification.
   */
  description: string;
  /**
   * Rubric for grading the quality of an outcome.
   */
  rubric: ManagedAgentsDeploymentUserDefineOutcomeEventRubricUnion;
  /**
   * Any of "user.define_outcome".
   */
  type: ManagedAgentsDeploymentUserDefineOutcomeEventType;
  /**
   * Eval→revision cycles before giving up. Default 3, max 20.
   */
  max_iterations?: number | null;
}

/**
 * ManagedAgentsDeploymentUserDefineOutcomeEventRubricUnion contains all
 * possible properties and values from `ManagedAgentsFileRubric`,
 * `ManagedAgentsTextRubric`.
 */
export type ManagedAgentsDeploymentUserDefineOutcomeEventRubricUnion = ManagedAgentsFileRubric | ManagedAgentsTextRubric;

export type ManagedAgentsDeploymentUserDefineOutcomeEventType = "user.define_outcome";

/**
 * A user message sent to the session.
 */
export interface ManagedAgentsDeploymentUserMessageEvent {
  /**
   * Array of content blocks for the user message.
   */
  content: Array<ManagedAgentsDeploymentUserMessageEventContentUnion>;
  /**
   * Any of "user.message".
   */
  type: ManagedAgentsDeploymentUserMessageEventType;
}

/**
 * ManagedAgentsDeploymentUserMessageEventContentUnion contains all possible
 * properties and values from `ManagedAgentsTextBlock`,
 * `ManagedAgentsImageBlock`, `ManagedAgentsDocumentBlock`,
 * `ManagedAgentsRedactedBlock`.
 */
export type ManagedAgentsDeploymentUserMessageEventContentUnion = ManagedAgentsTextBlock | ManagedAgentsImageBlock | ManagedAgentsDocumentBlock | ManagedAgentsRedactedBlock;

/**
 * ManagedAgentsDeploymentUserMessageEventContentUnionSource is an implicit
 * subunion of `ManagedAgentsDeploymentUserMessageEventContentUnion`.
 * ManagedAgentsDeploymentUserMessageEventContentUnionSource provides
 * convenient access to the sub-properties of the union.
 */
export interface ManagedAgentsDeploymentUserMessageEventContentUnionSource {
  data?: string;
  media_type?: string;
  type?: string;
  url?: string;
  file_id?: string;
}

export type ManagedAgentsDeploymentUserMessageEventType = "user.message";

/**
 * The deployment's environment was archived.
 */
export interface ManagedAgentsEnvironmentArchivedDeploymentPausedReasonError {
  /**
   * Any of "environment_archived_error".
   */
  type: ManagedAgentsEnvironmentArchivedDeploymentPausedReasonErrorType;
}

export type ManagedAgentsEnvironmentArchivedDeploymentPausedReasonErrorType = "environment_archived_error";

/**
 * The deployment's environment no longer exists.
 */
export interface ManagedAgentsEnvironmentNotFoundDeploymentPausedReasonError {
  /**
   * Any of "environment_not_found_error".
   */
  type: ManagedAgentsEnvironmentNotFoundDeploymentPausedReasonErrorType;
}

export type ManagedAgentsEnvironmentNotFoundDeploymentPausedReasonErrorType = "environment_not_found_error";

/**
 * A scheduled fire recorded a failed run whose error auto-pauses the deployment.
 */
export interface ManagedAgentsErrorDeploymentPausedReason {
  /**
   * The error that triggered an auto-pause. Matches the failed run's `error.type`.
   */
  error: ManagedAgentsDeploymentPausedReasonErrorUnion;
  /**
   * Any of "error".
   */
  type: ManagedAgentsErrorDeploymentPausedReasonType;
}

export type ManagedAgentsErrorDeploymentPausedReasonType = "error";

/**
 * A file resource referenced by the deployment no longer exists.
 */
export interface ManagedAgentsFileNotFoundDeploymentPausedReasonError {
  /**
   * Any of "file_not_found_error".
   */
  type: ManagedAgentsFileNotFoundDeploymentPausedReasonErrorType;
}

export type ManagedAgentsFileNotFoundDeploymentPausedReasonErrorType = "file_not_found_error";

/**
 * A file mounted into each session's container.
 */
export interface ManagedAgentsFileResourceConfig {
  /**
   * ID of a previously uploaded file.
   */
  file_id: string;
  /**
   * Any of "file".
   */
  type: ManagedAgentsFileResourceConfigType;
  /**
   * Mount path in the container. Defaults to `/mnt/session/uploads/<file_id>`.
   */
  mount_path?: string | null;
}

export type ManagedAgentsFileResourceConfigType = "file";

/**
 * A GitHub repository mounted into each session's container. The authorization
 * token is write-only and never returned.
 */
export interface ManagedAgentsGitHubRepositoryResourceConfig {
  /**
   * Any of "github_repository".
   */
  type: ManagedAgentsGitHubRepositoryResourceConfigType;
  /**
   * Github URL of the repository
   */
  url: string;
  /**
   * Branch or commit to check out. Defaults to the repository's default branch.
   */
  checkout?: ManagedAgentsGitHubRepositoryResourceConfigCheckoutUnion | null;
  /**
   * Mount path in the container. Defaults to `/workspace/<repo-name>`.
   */
  mount_path?: string | null;
}

export type ManagedAgentsGitHubRepositoryResourceConfigType = "github_repository";

/**
 * ManagedAgentsGitHubRepositoryResourceConfigCheckoutUnion contains all
 * possible properties and values from `ManagedAgentsBranchCheckout`,
 * `ManagedAgentsCommitCheckout`.
 */
export type ManagedAgentsGitHubRepositoryResourceConfigCheckoutUnion = ManagedAgentsBranchCheckout | ManagedAgentsCommitCheckout;

/**
 * The caller invoked the pause endpoint on the deployment.
 */
export interface ManagedAgentsManualDeploymentPausedReason {
  /**
   * Any of "manual".
   */
  type: ManagedAgentsManualDeploymentPausedReasonType;
}

export type ManagedAgentsManualDeploymentPausedReasonType = "manual";

/**
 * An MCP server host used by the deployment's agent is blocked by the
 * environment's network policy.
 */
export interface ManagedAgentsMCPEgressBlockedDeploymentPausedReasonError {
  /**
   * Any of "mcp_egress_blocked_error".
   */
  type: ManagedAgentsMCPEgressBlockedDeploymentPausedReasonErrorType;
}

export type ManagedAgentsMCPEgressBlockedDeploymentPausedReasonErrorType = "mcp_egress_blocked_error";

/**
 * A memory store referenced by the deployment is archived.
 */
export interface ManagedAgentsMemoryStoreArchivedDeploymentPausedReasonError {
  /**
   * Any of "memory_store_archived_error".
   */
  type: ManagedAgentsMemoryStoreArchivedDeploymentPausedReasonErrorType;
}

export type ManagedAgentsMemoryStoreArchivedDeploymentPausedReasonErrorType = "memory_store_archived_error";

/**
 * A memory store attached to each session created from this deployment.
 */
export interface ManagedAgentsMemoryStoreResourceConfig {
  /**
   * The memory store ID (memstore\_...). Must belong to the caller's organization
   * and workspace.
   */
  memory_store_id: string;
  /**
   * Any of "memory_store".
   */
  type: ManagedAgentsMemoryStoreResourceConfigType;
  /**
   * Access mode for an attached memory store.
   *
   * Any of "read_write", "read_only".
   */
  access?: ManagedAgentsMemoryStoreResourceConfigAccess | null;
  /**
   * Per-attachment guidance for the agent on how to use this store. Rendered into
   * the memory section of the system prompt. Max 4096 chars.
   */
  instructions?: string | null;
}

export type ManagedAgentsMemoryStoreResourceConfigType = "memory_store";

/**
 * Access mode for an attached memory store.
 */
export type ManagedAgentsMemoryStoreResourceConfigAccess = "read_write" | "read_only";

/**
 * The deployment's organization is disabled.
 */
export interface ManagedAgentsOrganizationDisabledDeploymentPausedReasonError {
  /**
   * Any of "organization_disabled_error".
   */
  type: ManagedAgentsOrganizationDisabledDeploymentPausedReasonErrorType;
}

export type ManagedAgentsOrganizationDisabledDeploymentPausedReasonErrorType = "organization_disabled_error";

/**
 * 5-field POSIX cron schedule with computed runtime timestamps.
 */
export interface ManagedAgentsSchedule {
  /**
   * 5-field POSIX cron expression: minute hour day-of-month month day-of-week (e.g.,
   * "0 9 \* \* 1-5" for weekdays at 9am). Day-of-week is 0-7 where 0 and 7 both mean
   * Sunday. Extended cron syntax - seconds or year fields, and the special
   * characters L, W, #, and ? - is not supported, nor are predefined shortcuts
   * (@daily).
   */
  expression: string;
  /**
   * IANA timezone identifier (e.g., "America/Los_Angeles", "UTC").
   */
  timezone: string;
  /**
   * Any of "cron".
   */
  type: ManagedAgentsScheduleType;
  /**
   * A timestamp in RFC 3339 format
   */
  last_run_at?: string | null;
  /**
   * Up to 5 timestamps of upcoming cron occurrences. Non-empty for active and paused
   * deployments (reflects what the schedule would do if unpaused); empty once the
   * deployment is archived (`archived_at` set). Each fire is offset by a small
   * per-schedule jitter, so a run will actually start at or shortly after its listed
   * time.
   */
  upcoming_runs_at?: Array<string>;
}

export type ManagedAgentsScheduleType = "cron";

/**
 * 5-field POSIX cron schedule. Literal wall-clock matching in the configured
 * timezone.
 */
export interface ManagedAgentsScheduleParams {
  /**
   * 5-field POSIX cron expression: minute hour day-of-month month day-of-week (e.g.,
   * "0 9 \* \* 1-5" for weekdays at 9am). Day-of-week is 0-7 where 0 and 7 both mean
   * Sunday. Extended cron syntax - seconds or year fields, and the special
   * characters L, W, #, and ? - is not supported, nor are predefined shortcuts
   * (@daily).
   */
  expression: string;
  /**
   * Required. IANA timezone identifier (e.g., "America/Los_Angeles", "UTC").
   * Validated against the IANA timezone database.
   */
  timezone: string;
  /**
   * Any of "cron".
   */
  type: ManagedAgentsScheduleParamsType;
}

export type ManagedAgentsScheduleParamsType = "cron";

/**
 * The deployment configures resources, but its environment is self-hosted and
 * cannot mount them.
 */
export interface ManagedAgentsSelfHostedResourcesUnsupportedDeploymentPausedReasonError {
  /**
   * Any of "self_hosted_resources_unsupported_error".
   */
  type: ManagedAgentsSelfHostedResourcesUnsupportedDeploymentPausedReasonErrorType;
}

export type ManagedAgentsSelfHostedResourcesUnsupportedDeploymentPausedReasonErrorType = "self_hosted_resources_unsupported_error";

export type ManagedAgentsSessionResourceConfigUnion = ManagedAgentsGitHubRepositoryResourceConfig | ManagedAgentsFileResourceConfig | ManagedAgentsMemoryStoreResourceConfig;

/**
 * A referenced resource no longer exists and its kind was not reported.
 */
export interface ManagedAgentsSessionResourceNotFoundDeploymentPausedReasonError {
  /**
   * Any of "session_resource_not_found_error".
   */
  type: ManagedAgentsSessionResourceNotFoundDeploymentPausedReasonErrorType;
}

export type ManagedAgentsSessionResourceNotFoundDeploymentPausedReasonErrorType = "session_resource_not_found_error";

/**
 * A skill referenced by the deployment's agent no longer exists.
 */
export interface ManagedAgentsSkillNotFoundDeploymentPausedReasonError {
  /**
   * Any of "skill_not_found_error".
   */
  type: ManagedAgentsSkillNotFoundDeploymentPausedReasonErrorType;
}

export type ManagedAgentsSkillNotFoundDeploymentPausedReasonErrorType = "skill_not_found_error";

/**
 * An unrecognized error auto-paused the deployment. A fallback variant; matches a
 * run whose `error.type` is `unknown_error`.
 */
export interface ManagedAgentsUnknownDeploymentPausedReasonError {
  /**
   * Any of "unknown_error".
   */
  type: ManagedAgentsUnknownDeploymentPausedReasonErrorType;
}

export type ManagedAgentsUnknownDeploymentPausedReasonErrorType = "unknown_error";

/**
 * A vault referenced by the deployment is archived.
 */
export interface ManagedAgentsVaultArchivedDeploymentPausedReasonError {
  /**
   * Any of "vault_archived_error".
   */
  type: ManagedAgentsVaultArchivedDeploymentPausedReasonErrorType;
}

export type ManagedAgentsVaultArchivedDeploymentPausedReasonErrorType = "vault_archived_error";

/**
 * A vault referenced by the deployment no longer exists.
 */
export interface ManagedAgentsVaultNotFoundDeploymentPausedReasonError {
  /**
   * Any of "vault_not_found_error".
   */
  type: ManagedAgentsVaultNotFoundDeploymentPausedReasonErrorType;
}

export type ManagedAgentsVaultNotFoundDeploymentPausedReasonErrorType = "vault_not_found_error";

/**
 * The deployment's workspace was archived.
 */
export interface ManagedAgentsWorkspaceArchivedDeploymentPausedReasonError {
  /**
   * Any of "workspace_archived_error".
   */
  type: ManagedAgentsWorkspaceArchivedDeploymentPausedReasonErrorType;
}

export type ManagedAgentsWorkspaceArchivedDeploymentPausedReasonErrorType = "workspace_archived_error";

export interface DeploymentNewParams {
  environment_variables?: string | null;
  /**
   * Agent to deploy. Accepts the `agent` ID string, which pins the latest version,
   * or an `agent` object with both id and version specified. The agent must exist
   * and not be archived.
   */
  agent: DeploymentNewParamsAgentUnion;
  /**
   * ID of the `environment` defining the container configuration for sessions
   * created from this deployment.
   */
  environment_id: string;
  /**
   * Events to send to each session immediately after creation. At least 1,
   * maximum 50.
   */
  initial_events: Array<ManagedAgentsDeploymentInitialEventParamsUnion>;
  /**
   * Human-readable name for the deployment.
   */
  name: string;
  /**
   * Description of what the deployment does.
   */
  description?: string | null;
  workspace_id?: string;
  /**
   * A hard spend ceiling. The session stops issuing new model requests once the
   * tracked list cost reaches `max_list_cost`.
   */
  budget?: ManagedAgentsBudgetLimitParam | null;
  /**
   * Arbitrary key-value metadata. Maximum 16 pairs, keys up to 64 chars, values up
   * to 512 chars.
   */
  metadata?: Record<string, string> | null;
  /**
   * Resources (e.g. repositories, files) to mount into each session's container.
   * Maximum 500.
   */
  resources?: Array<DeploymentNewParamsResourceUnion> | null;
  /**
   * 5-field POSIX cron schedule. Literal wall-clock matching in the configured
   * timezone.
   */
  schedule?: ManagedAgentsScheduleParams | null;
  /**
   * Vault IDs for stored credentials the agent can use during sessions created from
   * this deployment. Maximum 50.
   */
  vault_ids?: Array<string> | null;
  /**
   * Optional header to specify the beta version(s) you want to use.
   */
  betas?: Array<QoderBeta>;
}

export type DeploymentNewParamsAgentUnion = string | ManagedAgentsAgentParams;

export type DeploymentNewParamsResourceUnion = ManagedAgentsGitHubRepositoryResourceParams | ManagedAgentsFileResourceParams | ManagedAgentsMemoryStoreResourceParam;

export interface DeploymentGetParams {
  workspace_id?: string;
  /**
   * Optional header to specify the beta version(s) you want to use.
   */
  betas?: Array<QoderBeta>;
}

export interface DeploymentUpdateParams {
  environment_variables?: string | null;
  /**
   * Description. Omit to preserve; send empty string or null to clear.
   */
  description?: string | null;
  /**
   * ID of the `environment` where sessions run. Omit to preserve. Cannot be cleared.
   */
  environment_id?: string;
  /**
   * Human-readable name. Must be non-empty. Omit to preserve. Cannot be cleared.
   */
  name?: string;
  workspace_id?: string;
  /**
   * Metadata patch. Set a key to a string to upsert it, or to null to delete it.
   * Omit the field to preserve. The stored bag is limited to 16 keys (up to 64 chars
   * each) with values up to 512 chars.
   */
  metadata?: Record<string, unknown> | null;
  /**
   * Session resources. Full replacement. Omit to preserve; send empty array or null
   * to clear. Maximum 500.
   */
  resources?: Array<DeploymentUpdateParamsResourceUnion> | null;
  /**
   * Vault IDs. Full replacement. Omit to preserve; send empty array or null to
   * clear. Maximum 50.
   */
  vault_ids?: Array<string> | null;
  /**
   * Agent to deploy. Accepts the `agent` ID string, which re-pins to the latest
   * version, or an `agent` object with both id and version specified. Omit to
   * preserve. Cannot be cleared.
   */
  agent?: DeploymentUpdateParamsAgentUnion;
  /**
   * A hard spend ceiling. The session stops issuing new model requests once the
   * tracked list cost reaches `max_list_cost`.
   */
  budget?: ManagedAgentsBudgetLimitParam | null;
  /**
   * Initial events. Full replacement. Omit to preserve. Cannot be cleared. At least
   * 1, maximum 50.
   */
  initial_events?: Array<ManagedAgentsDeploymentInitialEventParamsUnion>;
  /**
   * 5-field POSIX cron schedule. Literal wall-clock matching in the configured
   * timezone.
   */
  schedule?: ManagedAgentsScheduleParams | null;
  /**
   * Optional header to specify the beta version(s) you want to use.
   */
  betas?: Array<QoderBeta>;
}

export type DeploymentUpdateParamsAgentUnion = string | ManagedAgentsAgentParams;

export type DeploymentUpdateParamsResourceUnion = ManagedAgentsGitHubRepositoryResourceParams | ManagedAgentsFileResourceParams | ManagedAgentsMemoryStoreResourceParam;

export interface DeploymentListParams {
  before_id?: string;
  after_id?: string;
  /**
   * Filter by agent ID.
   */
  agent_id?: string;
  /**
   * Return deployments created at or after this time (inclusive).
   */
  "created_at[gte]"?: string;
  /**
   * Return deployments created at or before this time (inclusive).
   */
  "created_at[lte]"?: string;
  /**
   * When true, includes archived deployments. Default: false (exclude archived).
   */
  include_archived?: boolean;
  /**
   * Maximum results per page. Default 20, maximum 100.
   */
  limit?: number;
  /**
   * Opaque pagination cursor.
   */
  page?: string;
  workspace_id?: string;
  /**
   * Filter by status: `active` or `paused`. Omit for both. To include archived
   * deployments, use `include_archived` instead; the two cannot be combined.
   *
   * Any of "active", "paused".
   */
  status?: ManagedAgentsDeploymentStatus;
  /**
   * Optional header to specify the beta version(s) you want to use.
   */
  betas?: Array<QoderBeta>;
}

export interface DeploymentArchiveParams {
  workspace_id?: string;
  /**
   * Optional header to specify the beta version(s) you want to use.
   */
  betas?: Array<QoderBeta>;
}

export interface DeploymentPauseParams {
  workspace_id?: string;
  /**
   * Optional header to specify the beta version(s) you want to use.
   */
  betas?: Array<QoderBeta>;
}

export interface DeploymentRunParams {
  workspace_id?: string;
  /**
   * Optional header to specify the beta version(s) you want to use.
   */
  betas?: Array<QoderBeta>;
}

export interface DeploymentUnpauseParams {
  workspace_id?: string;
  /**
   * Optional header to specify the beta version(s) you want to use.
   */
  betas?: Array<QoderBeta>;
}

/**
 * The deployment's agent was archived.
 */
export interface ManagedAgentsAgentArchivedRunError {
  /**
   * Human-readable error description.
   */
  message: string;
  /**
   * Any of "agent_archived_error".
   */
  type: ManagedAgentsAgentArchivedRunErrorType;
}

export type ManagedAgentsAgentArchivedRunErrorType = "agent_archived_error";

/**
 * A persistent, append-only record of a single deployment execution. Records
 * session creation success or failure — no session lifecycle tracking.
 */
export interface ManagedAgentsDeploymentRun {
  /**
   * Unique identifier for this run (`drun_...`).
   */
  id: string;
  /**
   * A resolved agent reference with a concrete version.
   */
  agent: ManagedAgentsAgentReference;
  /**
   * A timestamp in RFC 3339 format
   */
  created_at: string;
  /**
   * ID of the deployment that produced this run.
   */
  deployment_id: string;
  /**
   * Why the run failed to create a session. The type identifies the failure; message
   * is human-readable detail.
   */
  error: ManagedAgentsDeploymentRunErrorUnion | null;
  /**
   * Populated on success. Null on creation failure. Exactly one of `session_id` or
   * `error` is non-null.
   */
  session_id: string;
  /**
   * Describes what triggered a deployment run, with trigger-specific metadata.
   */
  trigger_context: ManagedAgentsTriggerContextUnion;
  /**
   * Any of "deployment_run".
   */
  type: ManagedAgentsDeploymentRunType;
}

export type ManagedAgentsDeploymentRunErrorUnion = ManagedAgentsEnvironmentArchivedRunError | ManagedAgentsAgentArchivedRunError | ManagedAgentsEnvironmentNotFoundRunError | ManagedAgentsVaultNotFoundRunError | ManagedAgentsVaultArchivedRunError | ManagedAgentsFileNotFoundRunError | ManagedAgentsMemoryStoreArchivedRunError | ManagedAgentsSkillNotFoundRunError | ManagedAgentsSessionResourceNotFoundRunError | ManagedAgentsWorkspaceArchivedRunError | ManagedAgentsOrganizationDisabledRunError | ManagedAgentsSessionRateLimitedRunError | ManagedAgentsSessionCreationRejectedRunError | ManagedAgentsUnknownRunError | ManagedAgentsSelfHostedResourcesUnsupportedRunError | ManagedAgentsMCPEgressBlockedRunError;

export type ManagedAgentsDeploymentRunType = "deployment_run";

/**
 * The deployment's environment was archived.
 */
export interface ManagedAgentsEnvironmentArchivedRunError {
  /**
   * Human-readable error description.
   */
  message: string;
  /**
   * Any of "environment_archived_error".
   */
  type: ManagedAgentsEnvironmentArchivedRunErrorType;
}

export type ManagedAgentsEnvironmentArchivedRunErrorType = "environment_archived_error";

/**
 * The deployment's environment no longer exists.
 */
export interface ManagedAgentsEnvironmentNotFoundRunError {
  /**
   * Human-readable error description.
   */
  message: string;
  /**
   * Any of "environment_not_found_error".
   */
  type: ManagedAgentsEnvironmentNotFoundRunErrorType;
}

export type ManagedAgentsEnvironmentNotFoundRunErrorType = "environment_not_found_error";

/**
 * A file resource referenced by the deployment no longer exists.
 */
export interface ManagedAgentsFileNotFoundRunError {
  /**
   * Human-readable error description.
   */
  message: string;
  /**
   * Any of "file_not_found_error".
   */
  type: ManagedAgentsFileNotFoundRunErrorType;
}

export type ManagedAgentsFileNotFoundRunErrorType = "file_not_found_error";

/**
 * The run was started manually by creating a session directly against the
 * deployment.
 */
export interface ManagedAgentsManualTriggerContext {
  /**
   * Any of "manual".
   */
  type: ManagedAgentsManualTriggerContextType;
}

export type ManagedAgentsManualTriggerContextType = "manual";

/**
 * An MCP server host used by the deployment's agent is blocked by the
 * environment's network policy.
 */
export interface ManagedAgentsMCPEgressBlockedRunError {
  /**
   * Human-readable error description.
   */
  message: string;
  /**
   * Any of "mcp_egress_blocked_error".
   */
  type: ManagedAgentsMCPEgressBlockedRunErrorType;
}

export type ManagedAgentsMCPEgressBlockedRunErrorType = "mcp_egress_blocked_error";

/**
 * A memory store referenced by the deployment is archived.
 */
export interface ManagedAgentsMemoryStoreArchivedRunError {
  /**
   * Human-readable error description.
   */
  message: string;
  /**
   * Any of "memory_store_archived_error".
   */
  type: ManagedAgentsMemoryStoreArchivedRunErrorType;
}

export type ManagedAgentsMemoryStoreArchivedRunErrorType = "memory_store_archived_error";

/**
 * The deployment's organization is disabled.
 */
export interface ManagedAgentsOrganizationDisabledRunError {
  /**
   * Human-readable error description.
   */
  message: string;
  /**
   * Any of "organization_disabled_error".
   */
  type: ManagedAgentsOrganizationDisabledRunErrorType;
}

export type ManagedAgentsOrganizationDisabledRunErrorType = "organization_disabled_error";

/**
 * The run was fired by the deployment's cron schedule.
 */
export interface ManagedAgentsScheduleTriggerContext {
  /**
   * A timestamp in RFC 3339 format
   */
  scheduled_at: string;
  /**
   * Any of "schedule".
   */
  type: ManagedAgentsScheduleTriggerContextType;
}

export type ManagedAgentsScheduleTriggerContextType = "schedule";

/**
 * The deployment configures resources, but its environment is self-hosted and
 * cannot mount them.
 */
export interface ManagedAgentsSelfHostedResourcesUnsupportedRunError {
  /**
   * Human-readable error description.
   */
  message: string;
  /**
   * Any of "self_hosted_resources_unsupported_error".
   */
  type: ManagedAgentsSelfHostedResourcesUnsupportedRunErrorType;
}

export type ManagedAgentsSelfHostedResourcesUnsupportedRunErrorType = "self_hosted_resources_unsupported_error";

/**
 * The session create request was rejected with a non-retryable validation error.
 */
export interface ManagedAgentsSessionCreationRejectedRunError {
  /**
   * Human-readable error description.
   */
  message: string;
  /**
   * Any of "session_creation_rejected_error".
   */
  type: ManagedAgentsSessionCreationRejectedRunErrorType;
}

export type ManagedAgentsSessionCreationRejectedRunErrorType = "session_creation_rejected_error";

/**
 * Session creation was rejected due to rate limiting. The schedule keeps firing;
 * subsequent runs may succeed.
 */
export interface ManagedAgentsSessionRateLimitedRunError {
  /**
   * Human-readable error description.
   */
  message: string;
  /**
   * Any of "session_rate_limited_error".
   */
  type: ManagedAgentsSessionRateLimitedRunErrorType;
}

export type ManagedAgentsSessionRateLimitedRunErrorType = "session_rate_limited_error";

/**
 * A referenced resource no longer exists and its kind was not reported.
 */
export interface ManagedAgentsSessionResourceNotFoundRunError {
  /**
   * Human-readable error description.
   */
  message: string;
  /**
   * Any of "session_resource_not_found_error".
   */
  type: ManagedAgentsSessionResourceNotFoundRunErrorType;
}

export type ManagedAgentsSessionResourceNotFoundRunErrorType = "session_resource_not_found_error";

/**
 * A skill referenced by the deployment's agent no longer exists.
 */
export interface ManagedAgentsSkillNotFoundRunError {
  /**
   * Human-readable error description.
   */
  message: string;
  /**
   * Any of "skill_not_found_error".
   */
  type: ManagedAgentsSkillNotFoundRunErrorType;
}

export type ManagedAgentsSkillNotFoundRunErrorType = "skill_not_found_error";

export type ManagedAgentsTriggerContextUnion = ManagedAgentsScheduleTriggerContext | ManagedAgentsManualTriggerContext;

/**
 * What triggered a deployment run.
 */
export type ManagedAgentsTriggerType = "schedule" | "manual";

/**
 * An unknown or unexpected error caused the run to fail. A fallback variant;
 * clients that do not recognize a new error type can match on message alone.
 */
export interface ManagedAgentsUnknownRunError {
  /**
   * Human-readable error description.
   */
  message: string;
  /**
   * Any of "unknown_error".
   */
  type: ManagedAgentsUnknownRunErrorType;
}

export type ManagedAgentsUnknownRunErrorType = "unknown_error";

/**
 * A vault referenced by the deployment is archived.
 */
export interface ManagedAgentsVaultArchivedRunError {
  /**
   * Human-readable error description.
   */
  message: string;
  /**
   * Any of "vault_archived_error".
   */
  type: ManagedAgentsVaultArchivedRunErrorType;
}

export type ManagedAgentsVaultArchivedRunErrorType = "vault_archived_error";

/**
 * A vault referenced by the deployment no longer exists.
 */
export interface ManagedAgentsVaultNotFoundRunError {
  /**
   * Human-readable error description.
   */
  message: string;
  /**
   * Any of "vault_not_found_error".
   */
  type: ManagedAgentsVaultNotFoundRunErrorType;
}

export type ManagedAgentsVaultNotFoundRunErrorType = "vault_not_found_error";

/**
 * The deployment's workspace was archived.
 */
export interface ManagedAgentsWorkspaceArchivedRunError {
  /**
   * Human-readable error description.
   */
  message: string;
  /**
   * Any of "workspace_archived_error".
   */
  type: ManagedAgentsWorkspaceArchivedRunErrorType;
}

export type ManagedAgentsWorkspaceArchivedRunErrorType = "workspace_archived_error";

export interface DeploymentRunGetParams {
  workspace_id?: string;
  /**
   * Optional header to specify the beta version(s) you want to use.
   */
  betas?: Array<QoderBeta>;
}

export interface DeploymentRunListParams {
  before_id?: string;
  after_id?: string;
  /**
   * Return runs created strictly after this time (exclusive).
   */
  "created_at[gt]"?: string;
  /**
   * Return runs created at or after this time (inclusive).
   */
  "created_at[gte]"?: string;
  /**
   * Return runs created strictly before this time (exclusive).
   */
  "created_at[lt]"?: string;
  /**
   * Return runs created at or before this time (inclusive).
   */
  "created_at[lte]"?: string;
  /**
   * Filter to a specific deployment. Omit to list across all deployments in the
   * workspace. Filtering by a non-existent `deployment_id` returns 200 with empty
   * data.
   */
  deployment_id?: string;
  /**
   * Filter: true for runs with non-null `error`, false for runs with non-null
   * `session_id`. Omit for all.
   */
  has_error?: boolean;
  /**
   * Maximum results per page. Default 20, maximum 1000.
   */
  limit?: number;
  /**
   * Opaque pagination cursor. Pass `next_page` from the previous response. Invalid
   * or expired cursors return 400.
   */
  page?: string;
  workspace_id?: string;
  /**
   * Filter runs by what triggered them. Omit to return all runs.
   *
   * Any of "schedule", "manual".
   */
  trigger_type?: ManagedAgentsTriggerType;
  /**
   * Optional header to specify the beta version(s) you want to use.
   */
  betas?: Array<QoderBeta>;
}

/**
 * An asynchronous memory-consolidation job that reads a memory store plus a set of
 * session transcripts and writes consolidated memories into an output memory store
 * — a new store by default, or an existing store chosen via output_behavior. The
 * Dreams API is in research preview: the request and response shapes are volatile
 * and may change without the deprecation period that applies to
 * generally-available endpoints.
 */
export interface Dream {
  id: string;
  /**
   * A timestamp in RFC 3339 format
   */
  archived_at: string | null;
  /**
   * A timestamp in RFC 3339 format
   */
  created_at: string;
  /**
   * A timestamp in RFC 3339 format
   */
  ended_at: string | null;
  /**
   * Failure detail for a Dream whose `status` is `failed`.
   */
  error: DreamError | null;
  inputs: Array<DreamInputUnion>;
  instructions: string;
  /**
   * Model identifier and configuration applied to every pipeline stage. Same wire
   * shape as the Agents API ModelConfig.
   */
  model: DreamModelConfig;
  /**
   * The default destination: the job creates a new output memory store as a clone of
   * the memory_store input and writes the consolidated memories into it. The input
   * store is never mutated.
   */
  output_behavior: OutputBehaviorUnion;
  outputs: Array<DreamOutput>;
  session_id: string | null;
  /**
   * Lifecycle status of a Dream.
   *
   * Any of "pending", "running", "completed", "failed", "canceled".
   */
  status: DreamStatus;
  /**
   * Any of "dream".
   */
  type: DreamType;
  /**
   * Cumulative token usage for the dream across every pipeline stage.
   */
  usage: DreamUsage;
}

export type DreamType = "dream";

/**
 * Failure detail for a Dream whose `status` is `failed`.
 */
export interface DreamError {
  message: string;
  type: string;
}

export type DreamInputUnion = DreamMemoryStoreInput | DreamSessionsInput;

export type DreamInputUnionParam = DreamMemoryStoreInputParam | DreamSessionsInputParam;

/**
 * An input memory store the dream reads from. The dream never mutates this store
 * unless it is also the destination: with output_behavior {type:
 * "update_existing"} the job consolidates this store in place.
 */
export interface DreamMemoryStoreInput {
  memory_store_id: string;
  /**
   * Any of "memory_store".
   */
  type: DreamMemoryStoreInputType;
}

export type DreamMemoryStoreInputType = "memory_store";

/**
 * An input memory store the dream reads from. The dream never mutates this store
 * unless it is also the destination: with output_behavior {type:
 * "update_existing"} the job consolidates this store in place.
 */
export interface DreamMemoryStoreInputParam {
  memory_store_id: string;
  /**
   * Any of "memory_store".
   */
  type: DreamMemoryStoreInputType;
}

/**
 * Model identifier and configuration applied to every pipeline stage. Same wire
 * shape as the Agents API ModelConfig.
 */
export interface DreamModelConfig {
  /**
   * Model identifier, e.g. "claude-opus-5". 1-256 characters.
   */
  id: string;
  /**
   * Inference speed mode. `fast` provides significantly faster output token
   * generation at premium pricing. Not all models support `fast`; invalid
   * combinations are rejected at create time.
   *
   * Any of "standard", "fast".
   */
  speed?: DreamModelConfigSpeed;
}

/**
 * Inference speed mode. `fast` provides significantly faster output token
 * generation at premium pricing. Not all models support `fast`; invalid
 * combinations are rejected at create time.
 */
export type DreamModelConfigSpeed = "standard" | "fast";

/**
 * Model identifier and configuration applied to every pipeline stage.
 */
export interface DreamModelConfigParam {
  /**
   * Model identifier, e.g. "claude-opus-5". 1-256 characters.
   */
  id: string;
  /**
   * Inference speed mode. `fast` provides significantly faster output token
   * generation at premium pricing. Not all models support `fast`; invalid
   * combinations are rejected at create time.
   *
   * Any of "standard", "fast".
   */
  speed?: DreamModelConfigParamSpeed | null;
}

/**
 * Inference speed mode. `fast` provides significantly faster output token
 * generation at premium pricing. Not all models support `fast`; invalid
 * combinations are rejected at create time.
 */
export type DreamModelConfigParamSpeed = "standard" | "fast";

/**
 * An output memory store the dream writes consolidated memories into.
 */
export interface DreamOutput {
  memory_store_id: string;
  /**
   * Any of "memory_store".
   */
  type: DreamOutputType;
}

export type DreamOutputType = "memory_store";

/**
 * Input session transcripts the dream reads.
 */
export interface DreamSessionsInput {
  session_ids: Array<string>;
  /**
   * Any of "sessions".
   */
  type: DreamSessionsInputType;
}

export type DreamSessionsInputType = "sessions";

/**
 * Input session transcripts the dream reads.
 */
export interface DreamSessionsInputParam {
  session_ids: Array<string>;
  /**
   * Any of "sessions".
   */
  type: DreamSessionsInputType;
}

/**
 * Lifecycle status of a Dream.
 */
export type DreamStatus = "pending" | "running" | "completed" | "failed" | "canceled";

/**
 * Cumulative token usage for the dream across every pipeline stage.
 */
export interface DreamUsage {
  /**
   * Total tokens used to create prompt-cache entries (sum of all TTL tiers).
   */
  cache_creation_input_tokens: number;
  /**
   * Total tokens read from prompt cache.
   */
  cache_read_input_tokens: number;
  /**
   * Total uncached input tokens consumed across every pipeline stage.
   */
  input_tokens: number;
  /**
   * Total output tokens generated across every pipeline stage.
   */
  output_tokens: number;
}

export type OutputBehaviorUnion = OutputBehaviorCreateNew | OutputBehaviorUpdateExisting;

export type OutputBehaviorUnionParam = OutputBehaviorCreateNewParam | OutputBehaviorUpdateExistingParam;

/**
 * The default destination: the job creates a new output memory store as a clone of
 * the memory_store input and writes the consolidated memories into it. The input
 * store is never mutated.
 */
export interface OutputBehaviorCreateNew {
  /**
   * Any of "create_new".
   */
  type: OutputBehaviorCreateNewType;
}

export type OutputBehaviorCreateNewType = "create_new";

/**
 * The default destination: the job creates a new output memory store as a clone of
 * the memory_store input and writes the consolidated memories into it. The input
 * store is never mutated.
 */
export interface OutputBehaviorCreateNewParam {
  /**
   * Any of "create_new".
   */
  type: OutputBehaviorCreateNewType;
}

/**
 * The job writes the consolidated memories into this existing memory store instead
 * of creating one. In EAP the store must be the job's own memory_store input, so
 * the job consolidates the store in place.
 */
export interface OutputBehaviorUpdateExisting {
  memory_store_id: string;
  /**
   * Any of "update_existing".
   */
  type: OutputBehaviorUpdateExistingType;
}

export type OutputBehaviorUpdateExistingType = "update_existing";

/**
 * The job writes the consolidated memories into this existing memory store instead
 * of creating one. In EAP the store must be the job's own memory_store input, so
 * the job consolidates the store in place.
 */
export interface OutputBehaviorUpdateExistingParam {
  memory_store_id: string;
  /**
   * Any of "update_existing".
   */
  type: OutputBehaviorUpdateExistingType;
}

export interface DreamNewParams {
  inputs: Array<DreamInputUnionParam>;
  /**
   * Model identifier and configuration applied to every pipeline stage.
   */
  model: DreamNewParamsModelUnion;
  instructions?: string | null;
  workspace_id?: string;
  /**
   * The default destination: the job creates a new output memory store as a clone of
   * the memory_store input and writes the consolidated memories into it. The input
   * store is never mutated.
   */
  output_behavior?: OutputBehaviorUnionParam | null;
  /**
   * Optional header to specify the beta version(s) you want to use.
   */
  betas?: Array<QoderBeta>;
}

export type DreamNewParamsModelUnion = string | DreamModelConfigParam;

export interface DreamGetParams {
  workspace_id?: string;
  /**
   * Optional header to specify the beta version(s) you want to use.
   */
  betas?: Array<QoderBeta>;
}

export interface DreamListParams {
  /**
   * Return dreams with `created_at` strictly after this timestamp (exclusive lower
   * bound, RFC 3339). Unset applies no lower bound.
   */
  "created_at[gt]"?: string;
  /**
   * Return dreams with `created_at` strictly before this timestamp (exclusive upper
   * bound, RFC 3339). Unset applies no upper bound.
   */
  "created_at[lt]"?: string;
  /**
   * Query parameter for include_archived
   */
  include_archived?: boolean;
  /**
   * Query parameter for limit
   */
  limit?: number;
  /**
   * Query parameter for page
   */
  page?: string;
  workspace_id?: string;
  /**
   * Filter by lifecycle status. Repeat the parameter to match any of multiple
   * statuses. Empty applies no status filter.
   */
  statuses?: Array<DreamStatus>;
  /**
   * Optional header to specify the beta version(s) you want to use.
   */
  betas?: Array<QoderBeta>;
}

export interface DreamArchiveParams {
  workspace_id?: string;
  /**
   * Optional header to specify the beta version(s) you want to use.
   */
  betas?: Array<QoderBeta>;
}

export interface DreamCancelParams {
  workspace_id?: string;
  /**
   * Optional header to specify the beta version(s) you want to use.
   */
  betas?: Array<QoderBeta>;
}

/**
 * `cloud` environment configuration.
 */
export interface CloudConfig {
  setup_script?: string;
  /**
   * Network configuration policy.
   */
  networking: CloudConfigNetworkingUnion;
  /**
   * Package manager configuration.
   */
  packages: Packages;
  /**
   * Environment type
   */
  type?: "cloud";
}

export type CloudConfigNetworkingUnion = UnrestrictedNetwork | LimitedNetwork;

/**
 * Request params for `cloud` environment configuration.
 *
 * Fields default to null; on update, omitted fields preserve the existing value.
 */
export interface CloudConfigParams {
  setup_script?: string | null;
  /**
   * Network configuration policy. Omit on update to preserve the existing value.
   */
  networking?: CloudConfigParamsNetworkingUnion | null;
  /**
   * Specify packages (and optionally their versions) available in this environment.
   *
   * When versioning, use the version semantics relevant for the package manager,
   * e.g. for `pip` use `package==1.0.0`. You are responsible for validating the
   * package and version exist. Unversioned installs the latest.
   *
   * Under `limited` networking, requires `networking.allow_package_managers` to be
   * `true`.
   */
  packages?: PackagesParams | null;
  /**
   * Environment type
   *
   * This field can be elided, and will marshal its zero value as "cloud".
   */
  type?: "cloud" | null;
}

export type CloudConfigParamsNetworkingUnion = UnrestrictedNetworkParam | LimitedNetworkParams;

/**
 * Unified Environment resource for both cloud and self-hosted environments.
 */
export interface Environment {
  /**
   * Environment identifier (e.g., 'env\_...')
   */
  id: string;
  /**
   * RFC 3339 timestamp when environment was archived, or null if not archived
   */
  archived_at: string | null;
  /**
   * Environment configuration (either Qoder Cloud or self-hosted)
   */
  config: EnvironmentConfigUnion;
  /**
   * RFC 3339 timestamp when environment was created
   */
  created_at: string;
  /**
   * User-provided description for the environment; null when unset
   */
  description: string;
  /**
   * User-provided metadata key-value pairs
   */
  metadata: Record<string, string>;
  /**
   * Human-readable name for the environment
   */
  name: string;
  /**
   * The type of object (always 'environment')
   */
  type?: "environment";
  /**
   * RFC 3339 timestamp when environment was last updated
   */
  updated_at: string;
  /**
   * The visibility scope for this environment. 'organization' means visible to all
   * accounts. 'account' means visible only to the owning account.
   *
   * Any of "organization", "account".
   */
  scope?: EnvironmentScope;
}

export type EnvironmentConfigUnion = CloudConfig | SelfHostedConfig;

/**
 * The visibility scope for this environment. 'organization' means visible to all
 * accounts. 'account' means visible only to the owning account.
 */
export type EnvironmentScope = "organization" | "account";

/**
 * Response after deleting an environment.
 */
export interface EnvironmentDeleteResponse {
  /**
   * Environment identifier
   */
  id: string;
  /**
   * The type of response
   *
   * Any of "environment_deleted".
   */
  type: EnvironmentDeleteResponseType;
}

/**
 * The type of response
 */
export type EnvironmentDeleteResponseType = "environment_deleted";

/**
 * Limited network access.
 */
export interface LimitedNetwork {
  /**
   * Permits outbound access to MCP server endpoints configured on the agent, beyond
   * those listed in the `allowed_hosts` array.
   */
  allow_mcp_servers: boolean;
  /**
   * Permits outbound access to public package registries (PyPI, npm, etc.) beyond
   * those listed in the `allowed_hosts` array.
   */
  allow_package_managers: boolean;
  /**
   * Specifies domains the container can reach.
   */
  allowed_hosts: Array<string>;
  /**
   * Network policy type
   */
  type?: "limited";
}

/**
 * Limited network request params.
 *
 * Fields default to null; on update, omitted fields preserve the existing value.
 */
export interface LimitedNetworkParams {
  /**
   * Permits outbound access to MCP server endpoints configured on the agent, beyond
   * those listed in the `allowed_hosts` array. Defaults to `false`.
   */
  allow_mcp_servers?: boolean | null;
  /**
   * Permits outbound access to public package registries (PyPI, npm, etc.) beyond
   * those listed in the `allowed_hosts` array. Defaults to `false` on creation. Must
   * be `true` when `packages` are specified.
   */
  allow_package_managers?: boolean | null;
  /**
   * Specifies domains the container can reach.
   */
  allowed_hosts?: Array<string> | null;
  /**
   * Network policy type
   *
   * This field can be elided, and will marshal its zero value as "limited".
   */
  type?: "limited" | null;
}

/**
 * Packages (and their versions) available in this environment.
 */
export interface Packages {
  /**
   * Ubuntu/Debian packages to install
   */
  apt: Array<string>;
  /**
   * Rust packages to install
   */
  cargo: Array<string>;
  /**
   * Ruby packages to install
   */
  gem: Array<string>;
  /**
   * Go packages to install
   */
  go: Array<string>;
  /**
   * Node.js packages to install
   */
  npm: Array<string>;
  /**
   * Python packages to install
   */
  pip: Array<string>;
  /**
   * Package configuration type
   *
   * Any of "packages".
   */
  type?: PackagesType;
}

/**
 * Package configuration type
 */
export type PackagesType = "packages";

/**
 * Specify packages (and optionally their versions) available in this environment.
 *
 * When versioning, use the version semantics relevant for the package manager,
 * e.g. for `pip` use `package==1.0.0`. You are responsible for validating the
 * package and version exist. Unversioned installs the latest.
 *
 * Under `limited` networking, requires `networking.allow_package_managers` to be
 * `true`.
 */
export interface PackagesParams {
  /**
   * Ubuntu/Debian packages to install
   */
  apt?: Array<string> | null;
  /**
   * Rust packages to install
   */
  cargo?: Array<string> | null;
  /**
   * Ruby packages to install
   */
  gem?: Array<string> | null;
  /**
   * Go packages to install
   */
  go?: Array<string> | null;
  /**
   * Node.js packages to install
   */
  npm?: Array<string> | null;
  /**
   * Python packages to install
   */
  pip?: Array<string> | null;
  /**
   * Package configuration type
   *
   * Any of "packages".
   */
  type?: PackagesParamsType | null;
}

/**
 * Package configuration type
 */
export type PackagesParamsType = "packages";

/**
 * Configuration for self-hosted environments.
 */
export interface SelfHostedConfig {
  /**
   * Environment type
   */
  type?: "self_hosted";
}

/**
 * Request params for `self_hosted` environment configuration.
 *
 * This struct has a constant value, construct it with
 * `NewSelfHostedConfigParams`.
 */
export interface SelfHostedConfigParams {
  /**
   * Environment type
   */
  type?: "self_hosted" | null;
}

/**
 * Unrestricted network access.
 */
export interface UnrestrictedNetwork {
  /**
   * Network policy type
   */
  type?: "unrestricted";
}

/**
 * Unrestricted network access.
 *
 * This struct has a constant value, construct it with
 * `NewUnrestrictedNetworkParam`.
 */
export interface UnrestrictedNetworkParam {
  /**
   * Network policy type
   */
  type?: "unrestricted" | null;
}

export interface EnvironmentNewParams {
  /**
   * Human-readable name for the environment
   */
  name: string;
  /**
   * Optional description of the environment
   */
  description?: string | null;
  workspace_id?: string;
  /**
   * Environment configuration
   */
  config?: EnvironmentNewParamsConfigUnion | null;
  /**
   * The visibility scope for this environment. 'organization' makes the environment
   * visible to all accounts. 'account' restricts visibility to the owning account
   * only. Only applicable for self-hosted environments. If not specified, defaults
   * based on organization type.
   *
   * Any of "organization", "account".
   */
  scope?: EnvironmentNewParamsScope | null;
  /**
   * User-provided metadata key-value pairs
   */
  metadata?: Record<string, string> | null;
  /**
   * Optional header to specify the beta version(s) you want to use.
   */
  betas?: Array<QoderBeta>;
}

export type EnvironmentNewParamsConfigUnion = CloudConfigParams | SelfHostedConfigParams;

/**
 * The visibility scope for this environment. 'organization' makes the environment
 * visible to all accounts. 'account' restricts visibility to the owning account
 * only. Only applicable for self-hosted environments. If not specified, defaults
 * based on organization type.
 */
export type EnvironmentNewParamsScope = "organization" | "account";

export interface EnvironmentGetParams {
  workspace_id?: string;
  /**
   * Optional header to specify the beta version(s) you want to use.
   */
  betas?: Array<QoderBeta>;
}

export interface EnvironmentUpdateParams {
  /**
   * Updated description of the environment. Omit to preserve; null clears to null;
   * an empty string is stored as an empty string.
   */
  description?: string | null;
  /**
   * Updated name for the environment
   */
  name?: string | null;
  workspace_id?: string;
  /**
   * Updated environment configuration
   */
  config?: EnvironmentUpdateParamsConfigUnion | null;
  /**
   * The visibility scope for this environment. 'organization' makes the environment
   * visible to all accounts. 'account' restricts visibility to the owning account
   * only.
   *
   * Any of "organization", "account".
   */
  scope?: EnvironmentUpdateParamsScope | null;
  /**
   * User-provided metadata key-value pairs. Set a value to null or empty string to
   * delete the key.
   */
  metadata?: Record<string, unknown> | null;
  /**
   * Optional header to specify the beta version(s) you want to use.
   */
  betas?: Array<QoderBeta>;
}

export type EnvironmentUpdateParamsConfigUnion = CloudConfigParams | SelfHostedConfigParams;

/**
 * The visibility scope for this environment. 'organization' makes the environment
 * visible to all accounts. 'account' restricts visibility to the owning account
 * only.
 */
export type EnvironmentUpdateParamsScope = "organization" | "account";

export interface EnvironmentListParams {
  "created_at[gte]"?: string;
  "created_at[lte]"?: string;
  /**
   * Opaque cursor from previous response for pagination. Pass the `next_page` value
   * from the previous response.
   */
  page?: string;
  /**
   * Include archived environments in the response
   */
  include_archived?: boolean;
  /**
   * Maximum number of environments to return
   */
  limit?: number;
  workspace_id?: string;
  /**
   * Optional header to specify the beta version(s) you want to use.
   */
  betas?: Array<QoderBeta>;
}

export interface EnvironmentDeleteParams {
  workspace_id?: string;
  /**
   * Optional header to specify the beta version(s) you want to use.
   */
  betas?: Array<QoderBeta>;
}

export interface EnvironmentArchiveParams {
  workspace_id?: string;
  /**
   * Optional header to specify the beta version(s) you want to use.
   */
  betas?: Array<QoderBeta>;
}

/**
 * Work data for environment health checks.
 *
 * This resource type is used for assessing the health of containers where work
 * occurs. The data is opaque to users; the runner handles the health check by
 * probing connectivity to required services.
 */
export interface HealthCheckWorkData {
  /**
   * Health check identifier
   */
  id: string;
  /**
   * Type of work data
   *
   * Any of "healthcheck".
   */
  type?: HealthCheckWorkDataType;
}

/**
 * Type of work data
 */
export type HealthCheckWorkDataType = "healthcheck";

/**
 * Work resource representing a unit of work in a self-hosted environment.
 *
 * Work items are queued when sessions are created or when long-dormant sessions
 * receive new messages. The Environment Manager polls for work items and executes
 * them on customer-hosted infrastructure.
 */
export interface SelfHostedWork {
  /**
   * Work identifier (e.g., 'work\_...')
   */
  id: string;
  /**
   * RFC 3339 timestamp when work was acknowledged by Environment Manager
   */
  acknowledged_at: string | null;
  /**
   * RFC 3339 timestamp when work was created
   */
  created_at: string;
  /**
   * The actual work to be performed
   */
  data: SessionWorkData;
  /**
   * Environment identifier this work belongs to (e.g., `env_...`)
   */
  environment_id: string;
  /**
   * RFC 3339 timestamp of the most recent heartbeat
   */
  latest_heartbeat_at: string | null;
  /**
   * User-provided metadata key-value pairs associated with this work item
   */
  metadata: Record<string, string>;
  /**
   * Credential payload used by the environment worker to execute this work item. May
   * be populated when polling for work; null on all other retrieval paths.
   */
  secret: string;
  /**
   * RFC 3339 timestamp when work execution started
   */
  started_at: string | null;
  /**
   * Current state of the work item
   *
   * Any of "queued", "starting", "active", "stopping", "stopped".
   */
  state: SelfHostedWorkState;
  /**
   * RFC 3339 timestamp when stop was requested
   */
  stop_requested_at: string | null;
  /**
   * RFC 3339 timestamp when work execution stopped
   */
  stopped_at: string | null;
  /**
   * The type of object (always 'work')
   */
  type?: "work";
}

/**
 * Current state of the work item
 */
export type SelfHostedWorkState = "queued" | "starting" | "active" | "stopping" | "stopped";

/**
 * Response after recording a heartbeat for a work item.
 */
export interface SelfHostedWorkHeartbeatResponse {
  /**
   * RFC 3339 timestamp of the actual heartbeat from DB
   */
  last_heartbeat: string;
  /**
   * Whether the heartbeat succeeded in extending the lease
   */
  lease_extended: boolean;
  /**
   * Current state of the work item (active/stopping/stopped)
   *
   * Any of "queued", "starting", "active", "stopping", "stopped".
   */
  state: SelfHostedWorkHeartbeatResponseState;
  /**
   * Effective TTL applied to the lease
   */
  ttl_seconds: number;
  /**
   * The type of response
   */
  type?: "work_heartbeat";
}

/**
 * Current state of the work item (active/stopping/stopped)
 */
export type SelfHostedWorkHeartbeatResponseState = "queued" | "starting" | "active" | "stopping" | "stopped";

/**
 * Response when listing work items with cursor-based pagination.
 */
export interface SelfHostedWorkListResponse {
  /**
   * List of work items
   */
  data: Array<SelfHostedWork>;
  /**
   * Opaque cursor for fetching the next page of results
   */
  next_page: string;
}

/**
 * Statistics about the work queue for an environment.
 *
 * Uses Redis Stream consumer group metrics for O(1) queries.
 */
export interface SelfHostedWorkQueueStats {
  /**
   * Number of work items waiting to be picked up (lag from consumer group)
   */
  depth: number;
  /**
   * RFC 3339 timestamp of oldest item in the work stream (includes both queued and
   * pending items), null if stream empty
   */
  oldest_queued_at: string;
  /**
   * Number of work items being processed (polled but not acknowledged)
   */
  pending: number;
  /**
   * The type of object
   */
  type?: "work_queue_stats";
  /**
   * Number of workers that have polled for work in the last 30 seconds. Requires
   * worker_id to be sent with poll requests.
   */
  workers_polling: number;
}

/**
 * Request to stop a work item.
 */
export interface SelfHostedWorkStopRequestParam {
  /**
   * If true, immediately stop work without graceful shutdown
   */
  force?: boolean | null;
}

/**
 * Request to update work item metadata.
 */
export interface SelfHostedWorkUpdateRequestParam {
  /**
   * Metadata patch. Set a key to a string to upsert it, or to null to delete it.
   * Omit the field to preserve existing metadata.
   */
  metadata: Record<string, unknown>;
}

/**
 * Work data for session work items.
 *
 * This resource type is used when work represents a session that needs to be
 * executed in a self-hosted environment.
 */
export interface SessionWorkData {
  /**
   * Session identifier (e.g., 'session\_...')
   */
  id: string;
  /**
   * Type of work data
   */
  type?: "session";
}

export interface EnvironmentWorkGetParams {
  environment_id: string;
  workspace_id?: string;
  /**
   * Optional header to specify the beta version(s) you want to use.
   */
  betas?: Array<QoderBeta>;
}

export interface EnvironmentWorkUpdateParams {
  environment_id: string;
  /**
   * Metadata patch. Set a key to a string to upsert it, or to null to delete it.
   * Omit the field to preserve existing metadata.
   */
  metadata: Record<string, unknown>;
  workspace_id?: string;
  /**
   * Optional header to specify the beta version(s) you want to use.
   */
  betas?: Array<QoderBeta>;
}

export interface EnvironmentWorkListParams {
  before_id?: string;
  after_id?: string;
  /**
   * Opaque cursor from previous response for pagination
   */
  page?: string;
  /**
   * Maximum number of work items to return
   */
  limit?: number;
  /**
   * Optional header to specify the beta version(s) you want to use.
   */
  betas?: Array<QoderBeta>;
}

export interface EnvironmentWorkAckParams {
  environment_id: string;
  /**
   * Optional header to specify the beta version(s) you want to use.
   */
  betas?: Array<QoderBeta>;
}

export interface EnvironmentWorkHeartbeatParams {
  environment_id: string;
  /**
   * Desired TTL in seconds
   */
  desired_ttl_seconds?: number;
  /**
   * Expected last_heartbeat for conditional update (optimistic concurrency). Use
   * literal 'NO_HEARTBEAT' to claim an unclaimed lease (first heartbeat). For
   * subsequent heartbeats, echo the server's previous last_heartbeat value exactly.
   * Returns 412 Precondition Failed if the actual value doesn't match.
   */
  expected_last_heartbeat?: string;
  /**
   * Optional header to specify the beta version(s) you want to use.
   */
  betas?: Array<QoderBeta>;
}

export interface EnvironmentWorkPollParams {
  /**
   * How long to wait for work to arrive before returning. Must be 1-999 in
   * milliseconds. Defaults to non-blocking (returns immediately if no work is
   * available).
   */
  block_ms?: number;
  /**
   * Reclaim unacknowledged work items older than this many milliseconds. If omitted,
   * uses the default (5000ms).
   */
  reclaim_older_than_ms?: number;
  /**
   * Unique identifier for the specific worker polling, used to track aggregated
   * environment-level work metrics in Console
   */
  qoder_worker_id?: string;
  /**
   * Optional header to specify the beta version(s) you want to use.
   */
  betas?: Array<QoderBeta>;
}

export interface EnvironmentWorkStatsParams {
  workspace_id?: string;
  /**
   * Optional header to specify the beta version(s) you want to use.
   */
  betas?: Array<QoderBeta>;
}

export interface EnvironmentWorkStopParams {
  environment_id: string;
  /**
   * If true, immediately stop work without graceful shutdown
   */
  force?: boolean | null;
  workspace_id?: string;
  /**
   * Optional header to specify the beta version(s) you want to use.
   */
  betas?: Array<QoderBeta>;
}

export interface DeletedFile {
  /**
   * ID of the deleted file.
   */
  id: string;
  /**
   * Deleted object type.
   *
   * For file deletion, this is always `"file_deleted"`.
   *
   * Any of "file_deleted".
   */
  type?: DeletedFileType;
}

/**
 * Deleted object type.
 *
 * For file deletion, this is always `"file_deleted"`.
 */
export type DeletedFileType = "file_deleted";

export interface FileMetadata {
  metadata?: Record<string, string>;
  status?: string;
  /**
   * Unique object identifier.
   *
   * The format and length of IDs may change over time.
   */
  id: string;
  /**
   * RFC 3339 datetime string representing when the file was created.
   */
  created_at: string;
  /**
   * Original filename of the uploaded file.
   */
  filename: string;
  /**
   * MIME type of the file.
   */
  mime_type: string;
  /**
   * Size of the file in bytes.
   */
  size_bytes: number;
  /**
   * Object type.
   *
   * For files, this is always `"file"`.
   */
  type?: "file";
  /**
   * Whether the file can be downloaded.
   */
  downloadable?: boolean;
  /**
   * RFC 3339 datetime string representing when the file will expire and become
   * unavailable for download. Null if the file does not expire. For files uploaded
   * with `expires_in_seconds`, this is the upload time plus that value.
   */
  expires_at?: string | null;
  /**
   * The scope of this file, indicating the context in which it was created (e.g., a
   * session).
   */
  scope?: FileScope | null;
}

export interface FileScope {
  /**
   * The ID of the scoping resource (e.g., the session ID).
   */
  id: string;
  /**
   * The type of scope (e.g., `"session"`).
   */
  type?: "session";
}

export interface FileListParams {
  name?: string;
  before_id?: string;
  after_id?: string;
  /**
   * Opaque page cursor returned in a prior list response's `next_page`. Prefixed
   * `page_`.
   */
  page?: string;
  /**
   * Number of items to return per page.
   *
   * Defaults to `20`. Ranges from `1` to `1000`.
   */
  limit?: number;
  /**
   * Filter by scope ID. Only returns files associated with the specified scope
   * (e.g., a session ID).
   */
  scope_id?: string;
  workspace_id?: string;
  /**
   * Restrict the result set to Files whose `id` is in this list. At most 100 entries
   * (after de-duplication). Mutually exclusive with `page` and `limit`. When
   * supplied, the response is always a single page (`next_page` is null). IDs that
   * do not resolve to a visible File — including deleted Files — are silently
   * omitted.
   */
  ids?: Array<string>;
  /**
   * Optional header to specify the beta version(s) you want to use.
   */
  betas?: Array<QoderBeta>;
}

export interface FileDeleteParams {
  workspace_id?: string;
  /**
   * Optional header to specify the beta version(s) you want to use.
   */
  betas?: Array<QoderBeta>;
}

export interface FileDownloadParams {
  workspace_id?: string;
  /**
   * Optional header to specify the beta version(s) you want to use.
   */
  betas?: Array<QoderBeta>;
}

export interface FileGetMetadataParams {
  workspace_id?: string;
  /**
   * Optional header to specify the beta version(s) you want to use.
   */
  betas?: Array<QoderBeta>;
}

export interface FileUploadParams {
  name?: string | null;
  metadata?: Record<string, string> | null;
  /**
   * The file to upload. Only the final path component of the part's `filename` is
   * kept; an absent or empty `filename` is replaced with `unnamed` plus the
   * extension for the file's stored `mime_type`, when known.
   */
  file: Uploadable;
  /**
   * Seconds from upload until the file expires and its bytes become permanently
   * unavailable. Must be between 3600 (one hour) and 7776000 (ninety days).
   */
  expires_in_seconds?: number | null;
  workspace_id?: string;
  /**
   * Optional header to specify the beta version(s) you want to use.
   */
  betas?: Array<QoderBeta>;
}

/**
 * Confirmation that a `memory_store` was deleted.
 */
export interface ManagedAgentsDeletedMemoryStore {
  /**
   * ID of the deleted memory store (a `memstore_...` identifier). The store and all
   * its memories and versions are no longer retrievable.
   */
  id: string;
  /**
   * Any of "memory_store_deleted".
   */
  type: ManagedAgentsDeletedMemoryStoreType;
}

export type ManagedAgentsDeletedMemoryStoreType = "memory_store_deleted";

/**
 * A `memory_store`: a named container for agent memories, scoped to a workspace.
 * Attach a store to a session via `resources[]` to mount it as a directory the
 * agent can read and write.
 */
export interface ManagedAgentsMemoryStore {
  /**
   * Unique identifier for the memory store (a `memstore_...` tagged ID). Use this
   * when attaching the store to a session, or in the `{memory_store_id}` path
   * parameter of subsequent calls.
   */
  id: string;
  /**
   * A timestamp in RFC 3339 format
   */
  created_at: string;
  /**
   * Human-readable name for the store. 1–255 characters. The store's mount-path slug
   * under `/mnt/memory/` is derived from this name.
   */
  name: string;
  /**
   * Any of "memory_store".
   */
  type: ManagedAgentsMemoryStoreType;
  /**
   * A timestamp in RFC 3339 format
   */
  updated_at: string;
  /**
   * A timestamp in RFC 3339 format
   */
  archived_at?: string | null;
  /**
   * Free-text description of what the store contains, up to 1024 characters.
   * Included in the agent's system prompt when the store is attached, so word it to
   * be useful to the agent. Empty string when unset.
   */
  description?: string;
  /**
   * Arbitrary key-value tags for your own bookkeeping (such as the end user a store
   * belongs to). Up to 16 pairs; keys 1–64 characters; values up to 512 characters.
   * Returned on retrieve/list but not filterable.
   */
  metadata?: Record<string, string>;
}

export type ManagedAgentsMemoryStoreType = "memory_store";

export interface MemoryStoreNewParams {
  /**
   * Human-readable name for the store. Required; 1–255 characters; no control
   * characters. The mount-path slug under `/mnt/memory/` is derived from this name
   * (lowercased, non-alphanumeric runs collapsed to a hyphen). Names need not be
   * unique within a workspace.
   */
  name: string;
  /**
   * Free-text description of what the store contains, up to 1024 characters.
   * Included in the agent's system prompt when the store is attached, so word it to
   * be useful to the agent.
   */
  description?: string | null;
  workspace_id?: string;
  /**
   * Arbitrary key-value tags for your own bookkeeping (such as the end user a store
   * belongs to). Up to 16 pairs; keys 1–64 characters; values up to 512 characters.
   * Not visible to the agent.
   */
  metadata?: Record<string, string> | null;
  /**
   * Optional header to specify the beta version(s) you want to use.
   */
  betas?: Array<QoderBeta>;
}

export interface MemoryStoreGetParams {
  workspace_id?: string;
  /**
   * Optional header to specify the beta version(s) you want to use.
   */
  betas?: Array<QoderBeta>;
}

export interface MemoryStoreUpdateParams {
  /**
   * New description for the store, up to 1024 characters. Pass an empty string to
   * clear it.
   */
  description?: string | null;
  /**
   * New human-readable name for the store. 1–255 characters; no control characters.
   * Renaming changes the slug used for the store's `mount_path` in sessions created
   * after the update.
   */
  name?: string | null;
  workspace_id?: string;
  /**
   * Metadata patch. Set a key to a string to upsert it, or to null to delete it.
   * Omit the field to preserve. The stored bag is limited to 16 keys (up to 64 chars
   * each) with values up to 512 chars.
   */
  metadata?: Record<string, unknown> | null;
  /**
   * Optional header to specify the beta version(s) you want to use.
   */
  betas?: Array<QoderBeta>;
}

export interface MemoryStoreListParams {
  name?: string;
  /**
   * Return only stores whose `created_at` is at or after this time (inclusive). Sent
   * on the wire as `created_at`gte``.
   */
  "created_at[gte]"?: string;
  /**
   * Return only stores whose `created_at` is at or before this time (inclusive).
   * Sent on the wire as `created_at`lte``.
   */
  "created_at[lte]"?: string;
  /**
   * When `true`, archived stores are included in the results. Defaults to `false`
   * (archived stores are excluded).
   */
  include_archived?: boolean;
  /**
   * Maximum number of stores to return per page. Must be between 1 and 100. Defaults
   * to 20 when omitted.
   */
  limit?: number;
  /**
   * Opaque pagination cursor (a `page_...` value). Pass the `next_page` value from a
   * previous response to fetch the next page; omit for the first page.
   */
  page?: string;
  workspace_id?: string;
  /**
   * Optional header to specify the beta version(s) you want to use.
   */
  betas?: Array<QoderBeta>;
}

export interface MemoryStoreDeleteParams {
  workspace_id?: string;
  /**
   * Optional header to specify the beta version(s) you want to use.
   */
  betas?: Array<QoderBeta>;
}

export interface MemoryStoreArchiveParams {
  workspace_id?: string;
  /**
   * Optional header to specify the beta version(s) you want to use.
   */
  betas?: Array<QoderBeta>;
}

/**
 * Tombstone returned by
 * [Delete a memory](/en/api/beta/memory_stores/memories/delete). Deleting a memory
 * does not erase its version history: its versions remain listable via
 * [List memory versions](/en/api/beta/memory_stores/memory_versions/list) while
 * they are retained (each version is kept for at least the version retention
 * period after it was written, unless the store itself is deleted).
 */
export interface ManagedAgentsDeletedMemory {
  /**
   * ID of the deleted memory (a `mem_...` value).
   */
  id: string;
  /**
   * Any of "memory_deleted".
   */
  type: ManagedAgentsDeletedMemoryType;
}

export type ManagedAgentsDeletedMemoryType = "memory_deleted";

/**
 * A `memory` object: a single text document at a hierarchical path inside a memory
 * store. The `content` field is populated when `view=full` and `null` when
 * `view=basic`; the `content_size_bytes` and `content_sha256` fields are always
 * populated so sync clients can diff without fetching content. Memories are
 * addressed by their `mem_...` ID; the path is the create key and can be changed
 * via update.
 */
export interface ManagedAgentsMemory {
  metadata?: Record<string, string>;
  /**
   * Unique identifier for this memory (a `mem_...` value). Stable across renames;
   * use this ID, not the path, to read, update, or delete the memory.
   */
  id: string;
  /**
   * Lowercase hex SHA-256 digest of the UTF-8 `content` bytes (64 characters). The
   * server applies no normalization, so clients can compute the same hash locally
   * for staleness checks and as the value for a `content_sha256` precondition on
   * update. Always populated, regardless of `view`.
   */
  content_sha256: string;
  /**
   * Size of `content` in bytes (the UTF-8 plaintext length). Always populated,
   * regardless of `view`.
   */
  content_size_bytes: number;
  /**
   * A timestamp in RFC 3339 format
   */
  created_at: string;
  /**
   * ID of the memory store this memory belongs to (a `memstore_...` value).
   */
  memory_store_id: string;
  /**
   * ID of the `memory_version` representing this memory's current content (a
   * `memver_...` value). This is the authoritative head pointer; `memory_version`
   * objects do not carry an `is_latest` flag, so compare against this field instead.
   * Enumerate the history via
   * [List memory versions](/en/api/beta/memory_stores/memory_versions/list).
   */
  memory_version_id: string;
  /**
   * Hierarchical path of the memory within the store, e.g. `/projects/foo/notes.md`.
   * Always starts with `/`. Paths are case-sensitive and unique within a store.
   * Maximum 1,024 bytes.
   */
  path: string;
  /**
   * Any of "memory".
   */
  type: ManagedAgentsMemoryType;
  /**
   * A timestamp in RFC 3339 format
   */
  updated_at: string;
  /**
   * The memory's UTF-8 text content. Populated when `view=full`; `null` when
   * `view=basic`. Maximum 100 kB (102,400 bytes).
   */
  content?: string | null;
}

export type ManagedAgentsMemoryType = "memory";

export type ManagedAgentsMemoryListItemUnion = ManagedAgentsMemory | ManagedAgentsMemoryPrefix;

/**
 * A rolled-up directory marker returned by
 * [List memories](/en/api/beta/memory_stores/memories/list) when `depth` is set.
 * Indicates that one or more memories exist deeper than the requested depth under
 * this prefix. This is a list-time rollup, not a stored resource; it has no ID and
 * no lifecycle. Each prefix counts toward the page `limit` and interleaves with
 * `memory` items in path order.
 */
export interface ManagedAgentsMemoryPrefix {
  /**
   * The rolled-up path prefix, including a trailing `/` (e.g. `/projects/foo/`).
   * Pass this value as `path_prefix` on a subsequent list call to drill into the
   * directory.
   */
  path: string;
  /**
   * Any of "memory_prefix".
   */
  type: ManagedAgentsMemoryPrefixType;
}

export type ManagedAgentsMemoryPrefixType = "memory_prefix";

/**
 * Selects which projection of a `memory` or `memory_version` the server returns.
 * `basic` returns the object with `content` set to `null`; `full` populates
 * `content`. When omitted, the default is endpoint-specific: retrieve operations
 * default to `full`; list, create, and update operations default to `basic`.
 * Listing with `view=full` caps `limit` at 20.
 */
export type ManagedAgentsMemoryView = "basic" | "full";

/**
 * Optimistic-concurrency precondition: the update applies only if the memory's
 * stored `content_sha256` equals the supplied value. On mismatch, the request
 * returns `memory_precondition_failed_error` (HTTP 409); re-read the memory and
 * retry against the fresh state. If the precondition fails but the stored state
 * already exactly matches the requested `content` and `path`, the server returns
 * 200 instead of 409.
 */
export interface ManagedAgentsPreconditionParam {
  /**
   * Any of "content_sha256".
   */
  type: ManagedAgentsPreconditionType;
  /**
   * Expected `content_sha256` of the stored memory (64 lowercase hexadecimal
   * characters). Typically the `content_sha256` returned by a prior read or list
   * call. Because the server applies no content normalization, clients can also
   * compute this locally as the SHA-256 of the UTF-8 content bytes.
   */
  content_sha256?: string | null;
}

export type ManagedAgentsPreconditionType = "content_sha256";

export interface MemoryStoreMemoryNewParams {
  metadata?: Record<string, string> | null;
  /**
   * UTF-8 text content for the new memory. Maximum 100 kB (102,400 bytes). Required;
   * pass `""` explicitly to create an empty memory.
   */
  content: string;
  /**
   * Hierarchical path for the new memory, e.g. `/projects/foo/notes.md`. Must start
   * with `/`, contain at least one non-empty segment, and be at most 1,024 bytes.
   * Must not contain empty segments, `.` or `..` segments, control or format
   * characters, or the Unicode line and paragraph separators (U+2028, U+2029), and
   * must be NFC-normalized. Paths are case-sensitive.
   */
  path: string;
  workspace_id?: string;
  /**
   * Query parameter for view
   *
   * Any of "basic", "full".
   */
  view?: ManagedAgentsMemoryView;
  /**
   * Optional header to specify the beta version(s) you want to use.
   */
  betas?: Array<QoderBeta>;
}

export interface MemoryStoreMemoryGetParams {
  memory_store_id: string;
  workspace_id?: string;
  /**
   * Query parameter for view
   *
   * Any of "basic", "full".
   */
  view?: ManagedAgentsMemoryView;
  /**
   * Optional header to specify the beta version(s) you want to use.
   */
  betas?: Array<QoderBeta>;
}

export interface MemoryStoreMemoryUpdateParams {
  content_sha256?: string | null;
  metadata?: Record<string, unknown> | null;
  memory_store_id: string;
  /**
   * New UTF-8 text content for the memory. Maximum 100 kB (102,400 bytes). Omit to
   * leave the content unchanged (e.g., for a rename-only update).
   */
  content?: string | null;
  /**
   * New path for the memory (a rename). Must start with `/`, contain at least one
   * non-empty segment, and be at most 1,024 bytes. Must not contain empty segments,
   * `.` or `..` segments, control or format characters, or the Unicode line and
   * paragraph separators (U+2028, U+2029), and must be NFC-normalized. Paths are
   * case-sensitive. The memory's `id` is preserved across renames. Omit to leave the
   * path unchanged.
   */
  path?: string | null;
  workspace_id?: string;
  /**
   * Query parameter for view
   *
   * Any of "basic", "full".
   */
  view?: ManagedAgentsMemoryView;
  /**
   * Optimistic-concurrency precondition: the update applies only if the memory's
   * stored `content_sha256` equals the supplied value. On mismatch, the request
   * returns `memory_precondition_failed_error` (HTTP 409); re-read the memory and
   * retry against the fresh state. If the precondition fails but the stored state
   * already exactly matches the requested `content` and `path`, the server returns
   * 200 instead of 409.
   */
  precondition?: ManagedAgentsPreconditionParam | null;
  /**
   * Optional header to specify the beta version(s) you want to use.
   */
  betas?: Array<QoderBeta>;
}

export interface MemoryStoreMemoryListParams {
  /**
   * `0` (or omitted) returns all descendants below `path_prefix` (recursive). `1`
   * returns immediate children only; deeper entries roll up as `memory_prefix`
   * items. `depth=1` behaves like `ls`; omitting `depth` behaves like `find`.
   */
  depth?: number;
  /**
   * Maximum number of items to return per page. Must be between 1 and 100. Defaults
   * to 20 when omitted. Capped at 20 when `view=full`. Both `memory` and
   * `memory_prefix` items count toward the limit.
   */
  limit?: number;
  /**
   * Opaque pagination cursor (a `page_...` value). Pass the `next_page` value from a
   * previous response to fetch the next page; omit for the first page.
   */
  page?: string;
  /**
   * Optional path prefix filter. Must end with `/` (segment-aligned), e.g.,
   * `/notes/`. This value appears in request URLs. Do not include secrets or
   * personally identifiable information.
   */
  path_prefix?: string;
  workspace_id?: string;
  /**
   * Which projection of each `memory` to return. Defaults to `basic` (content
   * omitted). `full` populates `content` on each item and caps `limit` at 20; use
   * this as the bulk-read path for export and sync.
   *
   * Any of "basic", "full".
   */
  view?: ManagedAgentsMemoryView;
  /**
   * Optional header to specify the beta version(s) you want to use.
   */
  betas?: Array<QoderBeta>;
}

export interface MemoryStoreMemoryDeleteParams {
  memory_store_id: string;
  /**
   * Query parameter for expected_content_sha256
   */
  expected_content_sha256?: string;
  workspace_id?: string;
  /**
   * Optional header to specify the beta version(s) you want to use.
   */
  betas?: Array<QoderBeta>;
}

export type ManagedAgentsActorUnion = ManagedAgentsSessionActor | ManagedAgentsAPIActor | ManagedAgentsUserActor | ManagedAgentsServiceAccountActor;

/**
 * Attribution for a write made directly via the public API (outside of any
 * session).
 */
export interface ManagedAgentsAPIActor {
  /**
   * ID of the API key that performed the write. This identifies the key, not the
   * secret.
   */
  api_key_id: string;
  /**
   * Any of "api_actor".
   */
  type: ManagedAgentsAPIActorType;
}

export type ManagedAgentsAPIActorType = "api_actor";

/**
 * A `memory_version` object: one immutable, attributed row in a memory's
 * append-only history. Every non-no-op mutation to a memory produces a new
 * version. Versions belong to the store (not the individual memory) and are not
 * deleted with the memory; each version is retained for at least the version
 * retention period after it was written, unless the store itself is deleted.
 * Retrieving a redacted version returns 200 with `content`, `path`,
 * `content_size_bytes`, and `content_sha256` set to `null`; branch on
 * `redacted_at`, not HTTP status.
 */
export interface ManagedAgentsMemoryVersion {
  /**
   * Unique identifier for this version (a `memver_...` value).
   */
  id: string;
  /**
   * A timestamp in RFC 3339 format
   */
  created_at: string;
  /**
   * ID of the memory this version snapshots (a `mem_...` value). Remains valid after
   * the memory is deleted; pass it as `memory_id` to
   * [List memory versions](/en/api/beta/memory_stores/memory_versions/list) to
   * retrieve the memory's retained versions, including the `deleted` row while the
   * lineage is retained.
   */
  memory_id: string;
  /**
   * ID of the memory store this version belongs to (a `memstore_...` value).
   */
  memory_store_id: string;
  /**
   * The kind of mutation a `memory_version` records. Every non-no-op mutation to a
   * memory appends exactly one version row with one of these values.
   *
   * Any of "created", "modified", "deleted".
   */
  operation: ManagedAgentsMemoryVersionOperation;
  /**
   * Any of "memory_version".
   */
  type: ManagedAgentsMemoryVersionType;
  /**
   * The memory's UTF-8 text content as of this version. `null` when `view=basic`,
   * when `operation` is `deleted`, or when `redacted_at` is set.
   */
  content?: string | null;
  /**
   * Lowercase hex SHA-256 digest of `content` as of this version (64 characters).
   * `null` when `redacted_at` is set or `operation` is `deleted`. Populated
   * regardless of `view` otherwise.
   */
  content_sha256?: string | null;
  /**
   * Size of `content` in bytes as of this version. `null` when `redacted_at` is set
   * or `operation` is `deleted`. Populated regardless of `view` otherwise.
   */
  content_size_bytes?: number | null;
  /**
   * Identifies who performed a write or redact operation. Captured at write time on
   * the `memory_version` row. The API key that created a session is not recorded on
   * agent writes; attribution answers who made the write, not who is ultimately
   * responsible. Look up session provenance separately via the
   * [Sessions API](/en/api/beta/sessions/retrieve).
   */
  created_by?: ManagedAgentsActorUnion;
  /**
   * The memory's path at the time of this write. `null` if and only if `redacted_at`
   * is set.
   */
  path?: string | null;
  /**
   * A timestamp in RFC 3339 format
   */
  redacted_at?: string | null;
  /**
   * Identifies who performed a write or redact operation. Captured at write time on
   * the `memory_version` row. The API key that created a session is not recorded on
   * agent writes; attribution answers who made the write, not who is ultimately
   * responsible. Look up session provenance separately via the
   * [Sessions API](/en/api/beta/sessions/retrieve).
   */
  redacted_by?: ManagedAgentsActorUnion;
}

export type ManagedAgentsMemoryVersionType = "memory_version";

/**
 * The kind of mutation a `memory_version` records. Every non-no-op mutation to a
 * memory appends exactly one version row with one of these values.
 */
export type ManagedAgentsMemoryVersionOperation = "created" | "modified" | "deleted";

/**
 * Attribution for a write made by a workload authenticated as a service account,
 * for example via Workload Identity Federation.
 */
export interface ManagedAgentsServiceAccountActor {
  /**
   * ID of the service account that performed the write (a `svac_...` value).
   */
  service_account_id: string;
  type?: "service_account_actor";
}

/**
 * Attribution for a write made by an agent during a session, through the mounted
 * filesystem at `/mnt/memory/`.
 */
export interface ManagedAgentsSessionActor {
  /**
   * ID of the session that performed the write (a `sesn_...` value). Look up the
   * session via [Retrieve a session](/en/api/beta/sessions/retrieve) for further
   * provenance.
   */
  session_id: string;
  /**
   * Any of "session_actor".
   */
  type: ManagedAgentsSessionActorType;
}

export type ManagedAgentsSessionActorType = "session_actor";

/**
 * Attribution for a write made by a human user through the Qoder Console.
 */
export interface ManagedAgentsUserActor {
  /**
   * Any of "user_actor".
   */
  type: ManagedAgentsUserActorType;
  /**
   * ID of the user who performed the write (a `user_...` value).
   */
  user_id: string;
}

export type ManagedAgentsUserActorType = "user_actor";

export interface MemoryStoreMemoryVersionGetParams {
  memory_store_id: string;
  workspace_id?: string;
  /**
   * Query parameter for view
   *
   * Any of "basic", "full".
   */
  view?: ManagedAgentsMemoryView;
  /**
   * Optional header to specify the beta version(s) you want to use.
   */
  betas?: Array<QoderBeta>;
}

export interface MemoryStoreMemoryVersionListParams {
  /**
   * Query parameter for api_key_id
   */
  api_key_id?: string;
  /**
   * Return versions created at or after this time (inclusive).
   */
  "created_at[gte]"?: string;
  /**
   * Return versions created at or before this time (inclusive).
   */
  "created_at[lte]"?: string;
  /**
   * Query parameter for limit
   */
  limit?: number;
  /**
   * Query parameter for memory_id
   */
  memory_id?: string;
  /**
   * Query parameter for page
   */
  page?: string;
  /**
   * Query parameter for service_account_id
   */
  service_account_id?: string;
  /**
   * Query parameter for session_id
   */
  session_id?: string;
  workspace_id?: string;
  /**
   * Query parameter for operation
   *
   * Any of "created", "modified", "deleted".
   */
  operation?: ManagedAgentsMemoryVersionOperation;
  /**
   * Query parameter for view
   *
   * Any of "basic", "full".
   */
  view?: ManagedAgentsMemoryView;
  /**
   * Optional header to specify the beta version(s) you want to use.
   */
  betas?: Array<QoderBeta>;
}

export interface MemoryStoreMemoryVersionRedactParams {
  memory_store_id: string;
  workspace_id?: string;
  /**
   * Optional header to specify the beta version(s) you want to use.
   */
  betas?: Array<QoderBeta>;
}

/**
 * The properties EncryptedContent, Type are required.
 */
export interface AdvisorRedactedResultBlockParam {
  /**
   * Opaque blob produced by a prior response; must be round-tripped verbatim.
   */
  encrypted_content: string;
  stop_reason?: string | null;
  /**
   * This field can be elided, and will marshal its zero value as
   * "advisor_redacted_result".
   */
  type?: "advisor_redacted_result" | null;
}

/**
 * The properties Text, Type are required.
 */
export interface AdvisorResultBlockParam {
  text: string;
  stop_reason?: string | null;
  /**
   * This field can be elided, and will marshal its zero value as "advisor_result".
   */
  type?: "advisor_result" | null;
}

/**
 * The properties Content, ToolUseID, Type are required.
 */
export interface AdvisorToolResultBlockParam {
  content: AdvisorToolResultBlockParamContentUnion;
  tool_use_id: string;
  /**
   * Create a cache control breakpoint at this content block.
   */
  cache_control?: CacheControlEphemeralParam | null;
  /**
   * This field can be elided, and will marshal its zero value as
   * "advisor_tool_result".
   */
  type?: "advisor_tool_result" | null;
}

export type AdvisorToolResultBlockParamContentUnion = AdvisorToolResultErrorParam | AdvisorResultBlockParam | AdvisorRedactedResultBlockParam;

/**
 * The properties ErrorCode, Type are required.
 */
export interface AdvisorToolResultErrorParam {
  /**
   * Any of "max_uses_exceeded", "prompt_too_long", "too_many_requests",
   * "overloaded", "unavailable", "execution_time_exceeded", "model_not_found".
   */
  error_code: AdvisorToolResultErrorParamErrorCode;
  /**
   * This field can be elided, and will marshal its zero value as
   * "advisor_tool_result_error".
   */
  type?: "advisor_tool_result_error" | null;
}

export type AdvisorToolResultErrorParamErrorCode = string;

/**
 * The properties Data, MediaType, Type are required.
 */
export interface Base64ImageSourceParam {
  data: string;
  /**
   * Any of "image/jpeg", "image/png", "image/gif", "image/webp".
   */
  media_type: Base64ImageSourceMediaType;
  /**
   * This field can be elided, and will marshal its zero value as "base64".
   */
  type?: "base64" | null;
}

export type Base64ImageSourceMediaType = string;

/**
 * The properties Data, MediaType, Type are required.
 */
export interface Base64PDFSourceParam {
  data: string;
  /**
   * This field can be elided, and will marshal its zero value as "application/pdf".
   */
  media_type?: "application/pdf" | null;
  /**
   * This field can be elided, and will marshal its zero value as "base64".
   */
  type?: "base64" | null;
}

/**
 * The properties FileID, Type are required.
 */
export interface BashCodeExecutionOutputBlockParam {
  file_id: string;
  /**
   * This field can be elided, and will marshal its zero value as
   * "bash_code_execution_output".
   */
  type?: "bash_code_execution_output" | null;
}

/**
 * The properties Content, ReturnCode, Stderr, Stdout, Type are required.
 */
export interface BashCodeExecutionResultBlockParam {
  content: Array<BashCodeExecutionOutputBlockParam>;
  return_code: number;
  stderr: string;
  stdout: string;
  /**
   * This field can be elided, and will marshal its zero value as
   * "bash_code_execution_result".
   */
  type?: "bash_code_execution_result" | null;
}

/**
 * The properties Content, ToolUseID, Type are required.
 */
export interface BashCodeExecutionToolResultBlockParam {
  content: BashCodeExecutionToolResultBlockParamContentUnion;
  tool_use_id: string;
  /**
   * Create a cache control breakpoint at this content block.
   */
  cache_control?: CacheControlEphemeralParam | null;
  /**
   * This field can be elided, and will marshal its zero value as
   * "bash_code_execution_tool_result".
   */
  type?: "bash_code_execution_tool_result" | null;
}

export type BashCodeExecutionToolResultBlockParamContentUnion = BashCodeExecutionToolResultErrorParam | BashCodeExecutionResultBlockParam;

/**
 * The properties ErrorCode, Type are required.
 */
export interface BashCodeExecutionToolResultErrorParam {
  /**
   * Any of "invalid_tool_input", "unavailable", "too_many_requests",
   * "execution_time_exceeded", "output_file_too_large".
   */
  error_code: BashCodeExecutionToolResultErrorParamErrorCode;
  /**
   * This field can be elided, and will marshal its zero value as
   * "bash_code_execution_tool_result_error".
   */
  type?: "bash_code_execution_tool_result_error" | null;
}

export type BashCodeExecutionToolResultErrorParamErrorCode = string;

/**
 * The caller's browser state after a browser toolset member call — the full
 * inventory of open tabs, which tab is active, and any side effects (tabs opened,
 * download state changes) the call produced.
 *
 * At most one per `tool_result`, only on a non-error result answering a browser
 * toolset member `tool_use`. The server renders the model-visible text from it;
 * the model never sees the raw fields.
 */
export interface BrowserStateBlockParam {
  /**
   * All tabs open in the browser after this call — the full inventory, not a delta.
   * May be empty. Whenever non-empty, exactly one entry carries `active: true`.
   */
  tabs: Array<BrowserStateTabEntryParam>;
  /**
   * Tabs opened and download state changes during this call. "Nothing to report" is
   * expressed by omitting the field, never by an empty list.
   */
  state_changes?: Array<BrowserStateChangeUnionParam> | null;
  /**
   * Create a cache control breakpoint at this content block.
   */
  cache_control?: CacheControlEphemeralParam | null;
  /**
   * This field can be elided, and will marshal its zero value as "browser_state".
   */
  type?: "browser_state" | null;
}

export type BrowserStateChangeUnionParam = BrowserStateChangeTabOpenedParam | BrowserStateChangeDownloadStartedParam | BrowserStateChangeDownloadCompletedParam | BrowserStateChangeDownloadFailedParam;

/**
 * A file download that finished during this call, reported with the same
 * `download_id` as its `download_started` — or without a prior `download_started`,
 * when the download finished during the call that started it (at most one state
 * change per `download_id` per result).
 */
export interface BrowserStateChangeDownloadCompletedParam {
  /**
   * The caller-assigned identifier for this download, stable across the state
   * changes reporting it.
   */
  download_id: string;
  /**
   * The final post-redirect URL the download was served from.
   */
  url: string;
  /**
   * Where the executor saved the file, on the executor's filesystem. Only included
   * when another tool in the same environment can read the file at that path.
   */
  path?: string | null;
  /**
   * The completed download's size.
   */
  size_bytes?: number | null;
  /**
   * This field can be elided, and will marshal its zero value as
   * "download_completed".
   */
  type?: "download_completed" | null;
}

/**
 * A file download that failed — or was cancelled — during this call.
 */
export interface BrowserStateChangeDownloadFailedParam {
  /**
   * The caller-assigned identifier for this download, stable across the state
   * changes reporting it.
   */
  download_id: string;
  /**
   * The final post-redirect URL the download was served from.
   */
  url: string;
  /**
   * The failure or cancellation detail, when known.
   */
  error?: string | null;
  /**
   * This field can be elided, and will marshal its zero value as "download_failed".
   */
  type?: "download_failed" | null;
}

/**
 * A file download that started during this call.
 */
export interface BrowserStateChangeDownloadStartedParam {
  /**
   * The caller-assigned identifier for this download, stable across the state
   * changes reporting it.
   */
  download_id: string;
  /**
   * The final post-redirect URL the download was served from.
   */
  url: string;
  /**
   * This field can be elided, and will marshal its zero value as "download_started".
   */
  type?: "download_started" | null;
}

/**
 * A tab this call's execution opened that remains open at its end — the creation
 * delta of the `tabs` inventory, not an event log.
 *
 * Carries only the `tab_id`; the tab's `title` and `url` live on its `tabs` entry,
 * which must include the same `tab_id`. A tab opened during a failed call gets no
 * deferred `tab_opened`; it simply appears in the next result's `tabs` inventory.
 */
export interface BrowserStateChangeTabOpenedParam {
  /**
   * The `tab_id` of the opened tab, present in `tabs`.
   */
  tab_id: string;
  /**
   * This field can be elided, and will marshal its zero value as "tab_opened".
   */
  type?: "tab_opened" | null;
}

/**
 * One open browser tab reported in a `browser_state` block's `tabs` inventory.
 *
 * `tab_id` is the caller-assigned identifier for the tab; `title` and `url`
 * describe the page the tab is currently showing and may be empty strings (a blank
 * tab legitimately has both empty). `active` marks the tab that is active after
 * this call; whenever `tabs` is non-empty, exactly one entry is marked.
 */
export interface BrowserStateTabEntryParam {
  /**
   * The caller-assigned identifier for this tab, unique within the inventory.
   */
  tab_id: string;
  /**
   * The title of the page the tab is showing. May be empty.
   */
  title: string;
  /**
   * The URL of the page the tab is showing. May be empty.
   */
  url: string;
  /**
   * Whether this tab is the active tab after this call. Whenever `tabs` is
   * non-empty, exactly one entry is marked `active: true`.
   */
  active?: boolean | null;
}

/**
 * This struct has a constant value, construct it with
 * `NewCacheControlEphemeralParam`.
 */
export interface CacheControlEphemeralParam {
  /**
   * The time-to-live for the cache control breakpoint.
   *
   * This may be one the following values:
   *
   * - `5m`: 5 minutes
   * - `1h`: 1 hour
   *
   * Defaults to `5m`.
   *
   * Any of "5m", "1h".
   */
  ttl?: CacheControlEphemeralTTL | null;
  type?: "ephemeral" | null;
}

/**
 * The time-to-live for the cache control breakpoint.
 *
 * This may be one the following values:
 *
 * - `5m`: 5 minutes
 * - `1h`: 1 hour
 *
 * Defaults to `5m`.
 */
export type CacheControlEphemeralTTL = string;

/**
 * The properties CitedText, DocumentIndex, DocumentTitle, EndCharIndex,
 * StartCharIndex, Type are required.
 */
export interface CitationCharLocationParam {
  document_title: string;
  cited_text: string;
  document_index: number;
  end_char_index: number;
  start_char_index: number;
  /**
   * This field can be elided, and will marshal its zero value as "char_location".
   */
  type?: "char_location" | null;
}

/**
 * The properties CitedText, DocumentIndex, DocumentTitle, EndBlockIndex,
 * StartBlockIndex, Type are required.
 */
export interface CitationContentBlockLocationParam {
  document_title: string;
  /**
   * The full text of the cited block range, concatenated.
   *
   * Always equals the contents of `content`start_block_index:end_block_index``
   * joined together. The text block is the minimal citable unit; this field is never
   * a substring of a single block. Not counted toward output tokens, and not counted
   * toward input tokens when sent back in subsequent turns.
   */
  cited_text: string;
  document_index: number;
  /**
   * Exclusive 0-based end index of the cited block range in the source's `content`
   * array.
   *
   * Always greater than `start_block_index`; a single-block citation has
   * `end_block_index = start_block_index + 1`.
   */
  end_block_index: number;
  /**
   * 0-based index of the first cited block in the source's `content` array.
   */
  start_block_index: number;
  /**
   * This field can be elided, and will marshal its zero value as
   * "content_block_location".
   */
  type?: "content_block_location" | null;
}

/**
 * The properties CitedText, DocumentIndex, DocumentTitle, EndPageNumber,
 * StartPageNumber, Type are required.
 */
export interface CitationPageLocationParam {
  document_title: string;
  cited_text: string;
  document_index: number;
  end_page_number: number;
  start_page_number: number;
  /**
   * This field can be elided, and will marshal its zero value as "page_location".
   */
  type?: "page_location" | null;
}

/**
 * The properties CitedText, EndBlockIndex, SearchResultIndex, Source,
 * StartBlockIndex, Title, Type are required.
 */
export interface CitationSearchResultLocationParam {
  title: string;
  /**
   * The full text of the cited block range, concatenated.
   *
   * Always equals the contents of `content`start_block_index:end_block_index``
   * joined together. The text block is the minimal citable unit; this field is never
   * a substring of a single block. Not counted toward output tokens, and not counted
   * toward input tokens when sent back in subsequent turns.
   */
  cited_text: string;
  /**
   * Exclusive 0-based end index of the cited block range in the source's `content`
   * array.
   *
   * Always greater than `start_block_index`; a single-block citation has
   * `end_block_index = start_block_index + 1`.
   */
  end_block_index: number;
  /**
   * 0-based index of the cited search result among all `search_result` content
   * blocks in the request, in the order they appear across messages and tool
   * results.
   *
   * Counted separately from `document_index`; server-side web search results are not
   * included in this count.
   */
  search_result_index: number;
  source: string;
  /**
   * 0-based index of the first cited block in the source's `content` array.
   */
  start_block_index: number;
  /**
   * This field can be elided, and will marshal its zero value as
   * "search_result_location".
   */
  type?: "search_result_location" | null;
}

/**
 * The properties CitedText, EncryptedIndex, Title, Type, URL are required.
 */
export interface CitationWebSearchResultLocationParam {
  title: string;
  cited_text: string;
  encrypted_index: string;
  url: string;
  /**
   * This field can be elided, and will marshal its zero value as
   * "web_search_result_location".
   */
  type?: "web_search_result_location" | null;
}

export interface CitationsConfigParam {
  enabled?: boolean | null;
}

/**
 * The properties FileID, Type are required.
 */
export interface CodeExecutionOutputBlockParam {
  file_id: string;
  /**
   * This field can be elided, and will marshal its zero value as
   * "code_execution_output".
   */
  type?: "code_execution_output" | null;
}

/**
 * The properties Content, ReturnCode, Stderr, Stdout, Type are required.
 */
export interface CodeExecutionResultBlockParam {
  content: Array<CodeExecutionOutputBlockParam>;
  return_code: number;
  stderr: string;
  stdout: string;
  /**
   * This field can be elided, and will marshal its zero value as
   * "code_execution_result".
   */
  type?: "code_execution_result" | null;
}

/**
 * The properties Content, ToolUseID, Type are required.
 */
export interface CodeExecutionToolResultBlockParam {
  /**
   * Code execution result with encrypted stdout for PFC + web_search results.
   */
  content: CodeExecutionToolResultBlockParamContentUnion;
  tool_use_id: string;
  /**
   * Create a cache control breakpoint at this content block.
   */
  cache_control?: CacheControlEphemeralParam | null;
  /**
   * This field can be elided, and will marshal its zero value as
   * "code_execution_tool_result".
   */
  type?: "code_execution_tool_result" | null;
}

export type CodeExecutionToolResultBlockParamContentUnion = CodeExecutionToolResultErrorParam | CodeExecutionResultBlockParam | EncryptedCodeExecutionResultBlockParam;

export type CodeExecutionToolResultErrorCode = string;

/**
 * The properties ErrorCode, Type are required.
 */
export interface CodeExecutionToolResultErrorParam {
  /**
   * Any of "invalid_tool_input", "unavailable", "too_many_requests",
   * "execution_time_exceeded".
   */
  error_code: CodeExecutionToolResultErrorCode;
  /**
   * This field can be elided, and will marshal its zero value as
   * "code_execution_tool_result_error".
   */
  type?: "code_execution_tool_result_error" | null;
}

/**
 * A compaction block containing summary of previous context.
 *
 * Users should round-trip these blocks from responses to subsequent requests to
 * maintain context across compaction boundaries.
 *
 * When content is None, the block represents a failed compaction. The server
 * treats these as no-ops. Empty string content is not allowed.
 */
export interface CompactionBlockParam {
  /**
   * Summary of previously compacted content, or null if compaction failed
   */
  content?: string | null;
  /**
   * Opaque metadata from prior compaction, to be round-tripped verbatim
   */
  encrypted_content?: string | null;
  /**
   * Create a cache control breakpoint at this content block.
   */
  cache_control?: CacheControlEphemeralParam | null;
  /**
   * This field can be elided, and will marshal its zero value as "compaction".
   */
  type?: "compaction" | null;
}

/**
 * A content block that represents a file to be uploaded to the container Files
 * uploaded via this block will be available in the container's input directory.
 */
export interface ContainerUploadBlockParam {
  file_id: string;
  /**
   * Create a cache control breakpoint at this content block.
   */
  cache_control?: CacheControlEphemeralParam | null;
  /**
   * This field can be elided, and will marshal its zero value as "container_upload".
   */
  type?: "container_upload" | null;
}

export type ContentBlockParamUnion = TextBlockParam | ImageBlockParam | RequestDocumentBlockParam | SearchResultBlockParam | ThinkingBlockParam | RedactedThinkingBlockParam | ToolUseBlockParam | ToolResultBlockParam | ServerToolUseBlockParam | WebSearchToolResultBlockParam | WebFetchToolResultBlockParam | AdvisorToolResultBlockParam | CodeExecutionToolResultBlockParam | BashCodeExecutionToolResultBlockParam | TextEditorCodeExecutionToolResultBlockParam | ToolSearchToolResultBlockParam | MCPToolUseBlockParam | RequestMCPToolResultBlockParam | ContainerUploadBlockParam | CompactionBlockParam | RequestToolAdditionBlockParam | RequestToolRemovalBlockParam | FallbackBlockParam;

/**
 * The properties Content, Type are required.
 */
export interface ContentBlockSourceParam {
  content: ContentBlockSourceContentUnionParam;
  /**
   * This field can be elided, and will marshal its zero value as "content".
   */
  type?: "content" | null;
}

export type ContentBlockSourceContentUnionParam = string | Array<ContentBlockSourceContentUnionParam>;

/**
 * Tool invocation directly from the model.
 *
 * This struct has a constant value, construct it with `NewDirectCallerParam`.
 */
export interface DirectCallerParam {
  type?: "direct" | null;
}

/**
 * Code execution result with encrypted stdout for PFC + web_search results.
 */
export interface EncryptedCodeExecutionResultBlockParam {
  content: Array<CodeExecutionOutputBlockParam>;
  encrypted_stdout: string;
  return_code: number;
  stderr: string;
  /**
   * This field can be elided, and will marshal its zero value as
   * "encrypted_code_execution_result".
   */
  type?: "encrypted_code_execution_result" | null;
}

/**
 * A `fallback` block echoed back from a prior response.
 *
 * Accepted in `messages[].content` and not rendered into the prompt; not validated
 * against the request's `fallbacks` chain or top-level `model`.
 *
 * Echo the assistant turn back verbatim, including this block in its original
 * position. The block marks the boundary between content produced before and after
 * a fallback hop, and the server relies on that boundary to validate the turn:
 * when thinking runs flank the boundary, omitting the block merges them into one
 * span the server cannot validate (the request is rejected), and moving it into
 * the middle of a single run is likewise rejected; between non-thinking blocks the
 * block's placement has no validation effect.
 */
export interface FallbackBlockParam {
  /**
   * Identifies one hop of a fallback transition.
   */
  from: FallbackInfoParam;
  /**
   * Identifies one hop of a fallback transition.
   */
  to: FallbackInfoParam;
  /**
   * The response block's `trigger`, echoed verbatim. Accepted and ignored by the
   * server; any object or `null` is allowed.
   */
  trigger?: unknown;
  /**
   * This field can be elided, and will marshal its zero value as "fallback".
   */
  type?: "fallback" | null;
}

/**
 * Identifies one hop of a fallback transition.
 */
export interface FallbackInfoParam {
  /**
   * The model that will complete your prompt.
   *
   * See [models](https://docs.qoder.com/cloud-agents/api/models/list) for additional
   * details and options.
   */
  model: Model;
}

/**
 * The properties FileID, Type are required.
 */
export interface FileDocumentSourceParam {
  file_id: string;
  /**
   * This field can be elided, and will marshal its zero value as "file".
   */
  type?: "file" | null;
}

/**
 * The properties FileID, Type are required.
 */
export interface FileImageSourceParam {
  file_id: string;
  /**
   * This field can be elided, and will marshal its zero value as "file".
   */
  type?: "file" | null;
}

/**
 * The properties Source, Type are required.
 */
export interface ImageBlockParam {
  source: ImageBlockParamSourceUnion;
  /**
   * Create a cache control breakpoint at this content block.
   */
  cache_control?: CacheControlEphemeralParam | null;
  /**
   * Configures the transformations the server applies to this image before the model
   * observes it. Each key names a condition the server transforms images for; its
   * value selects the transformation applied. Omitted keys keep their default
   * behavior, and an empty object is equivalent to omitting the field.
   */
  transformations?: ImageTransformationsParam | null;
  /**
   * This field can be elided, and will marshal its zero value as "image".
   */
  type?: "image" | null;
}

export type ImageBlockParamSourceUnion = Base64ImageSourceParam | URLImageSourceParam | FileImageSourceParam;

/**
 * Configures the transformations the server applies to this image before the model
 * observes it. Each key names a condition the server transforms images for; its
 * value selects the transformation applied. Omitted keys keep their default
 * behavior, and an empty object is equivalent to omitting the field.
 */
export interface ImageTransformationsParam {
  /**
   * What the server does when this image exceeds the model's maximum image size.
   * `"downsize"` (the default) scales the image down to fit, which changes the
   * dimensions the model observes without telling you. `"error"` instead rejects the
   * request with a 400 error naming the image's dimensions and the largest
   * dimensions that fit, so you can scale the image deliberately — your image is
   * never silently scaled down.
   *
   * Any of "downsize", "error".
   */
  oversized_image?: ImageTransformationsParamOversizedImage | null;
}

/**
 * What the server does when this image exceeds the model's maximum image size.
 * `"downsize"` (the default) scales the image down to fit, which changes the
 * dimensions the model observes without telling you. `"error"` instead rejects the
 * request with a 400 error naming the image's dimensions and the largest
 * dimensions that fit, so you can scale the image deliberately — your image is
 * never silently scaled down.
 */
export type ImageTransformationsParamOversizedImage = string;

/**
 * The properties ID, Input, Name, ServerName, Type are required.
 */
export interface MCPToolUseBlockParam {
  id: string;
  input: unknown;
  name: string;
  /**
   * The name of the MCP server
   */
  server_name: string;
  /**
   * Create a cache control breakpoint at this content block.
   */
  cache_control?: CacheControlEphemeralParam | null;
  /**
   * This field can be elided, and will marshal its zero value as "mcp_tool_use".
   */
  type?: "mcp_tool_use" | null;
}

/**
 * The properties Data, MediaType, Type are required.
 */
export interface PlainTextSourceParam {
  data: string;
  /**
   * This field can be elided, and will marshal its zero value as "text/plain".
   */
  media_type?: "text/plain" | null;
  /**
   * This field can be elided, and will marshal its zero value as "text".
   */
  type?: "text" | null;
}

/**
 * The properties Data, Type are required.
 */
export interface RedactedThinkingBlockParam {
  /**
   * The `data` value of this redacted thinking block, exactly as returned by the API
   * in a previous response. Opaque and encrypted; pass it back unchanged.
   */
  data: string;
  /**
   * This field can be elided, and will marshal its zero value as
   * "redacted_thinking".
   */
  type?: "redacted_thinking" | null;
}

/**
 * The properties Source, Type are required.
 */
export interface RequestDocumentBlockParam {
  source: RequestDocumentBlockSourceUnionParam;
  context?: string | null;
  title?: string | null;
  /**
   * Create a cache control breakpoint at this content block.
   */
  cache_control?: CacheControlEphemeralParam | null;
  citations?: CitationsConfigParam | null;
  /**
   * This field can be elided, and will marshal its zero value as "document".
   */
  type?: "document" | null;
}

export type RequestDocumentBlockSourceUnionParam = Base64PDFSourceParam | PlainTextSourceParam | ContentBlockSourceParam | URLPDFSourceParam | FileDocumentSourceParam;

/**
 * The properties ToolUseID, Type are required.
 */
export interface RequestMCPToolResultBlockParam {
  tool_use_id: string;
  is_error?: boolean | null;
  /**
   * Create a cache control breakpoint at this content block.
   */
  cache_control?: CacheControlEphemeralParam | null;
  content?: RequestMCPToolResultBlockParamContentUnion | null;
  /**
   * This field can be elided, and will marshal its zero value as "mcp_tool_result".
   */
  type?: "mcp_tool_result" | null;
}

export type RequestMCPToolResultBlockParamContentUnion = string | Array<TextBlockParam>;

/**
 * Mid-conversation directive to surface a declared tool.
 *
 * `tool` references a tool (or MCP toolset) by name from the request's `tools`; it
 * is offered to the model from this point in the conversation onward.
 */
export interface RequestToolAdditionBlockParam {
  /**
   * Reference to a single tool the caller declared directly in `tools[]`. Does not
   * accept the composed `{server}_{name}` form the server assigns to MCP-resolved
   * tools — use `mcp_tool_reference` or `mcp_toolset_reference` for those.
   */
  tool: RequestToolAdditionBlockToolUnionParam;
  /**
   * Create a cache control breakpoint at this content block.
   */
  cache_control?: CacheControlEphemeralParam | null;
  /**
   * This field can be elided, and will marshal its zero value as "tool_addition".
   */
  type?: "tool_addition" | null;
}

export type RequestToolAdditionBlockToolUnionParam = ToolChangeToolReferenceParam | ToolChangeMCPToolReferenceParam | ToolChangeMCPToolsetReferenceParam;

/**
 * Mid-conversation directive to withdraw a tool.
 *
 * `tool` references a tool (or MCP toolset) by name from the request's `tools`; it
 * is no longer offered to the model from this point in the conversation onward.
 */
export interface RequestToolRemovalBlockParam {
  /**
   * Reference to a single tool the caller declared directly in `tools[]`. Does not
   * accept the composed `{server}_{name}` form the server assigns to MCP-resolved
   * tools — use `mcp_tool_reference` or `mcp_toolset_reference` for those.
   */
  tool: RequestToolRemovalBlockToolUnionParam;
  /**
   * Create a cache control breakpoint at this content block.
   */
  cache_control?: CacheControlEphemeralParam | null;
  /**
   * This field can be elided, and will marshal its zero value as "tool_removal".
   */
  type?: "tool_removal" | null;
}

export type RequestToolRemovalBlockToolUnionParam = ToolChangeToolReferenceParam | ToolChangeMCPToolReferenceParam | ToolChangeMCPToolsetReferenceParam;

/**
 * The properties Content, Source, Title, Type are required.
 */
export interface SearchResultBlockParam {
  content: Array<TextBlockParam>;
  source: string;
  title: string;
  /**
   * Create a cache control breakpoint at this content block.
   */
  cache_control?: CacheControlEphemeralParam | null;
  citations?: CitationsConfigParam | null;
  /**
   * This field can be elided, and will marshal its zero value as "search_result".
   */
  type?: "search_result" | null;
}

/**
 * Tool invocation generated by a server-side tool.
 */
export interface ServerToolCallerParam {
  tool_id: string;
  /**
   * This field can be elided, and will marshal its zero value as
   * "code_execution_20250825".
   */
  type?: "code_execution_20250825" | null;
}

/**
 * The properties ToolID, Type are required.
 */
export interface ServerToolCaller20260120Param {
  tool_id: string;
  /**
   * This field can be elided, and will marshal its zero value as
   * "code_execution_20260120".
   */
  type?: "code_execution_20260120" | null;
}

/**
 * The properties ID, Input, Name, Type are required.
 */
export interface ServerToolUseBlockParam {
  id: string;
  input: unknown;
  /**
   * Any of "advisor", "web_search", "web_fetch", "code_execution",
   * "bash_code_execution", "text_editor_code_execution", "tool_search_tool_regex",
   * "tool_search_tool_bm25".
   */
  name: ServerToolUseBlockParamName;
  /**
   * Create a cache control breakpoint at this content block.
   */
  cache_control?: CacheControlEphemeralParam | null;
  /**
   * Tool invocation directly from the model.
   */
  caller?: ServerToolUseBlockParamCallerUnion | null;
  /**
   * This field can be elided, and will marshal its zero value as "server_tool_use".
   */
  type?: "server_tool_use" | null;
}

export type ServerToolUseBlockParamName = string;

export type ServerToolUseBlockParamCallerUnion = DirectCallerParam | ServerToolCallerParam | ServerToolCaller20260120Param;

/**
 * The properties Text, Type are required.
 */
export interface TextBlockParam {
  text: string;
  citations?: Array<TextCitationParamUnion> | null;
  /**
   * Create a cache control breakpoint at this content block.
   */
  cache_control?: CacheControlEphemeralParam | null;
  /**
   * This field can be elided, and will marshal its zero value as "text".
   */
  type?: "text" | null;
}

export type TextCitationParamUnion = CitationCharLocationParam | CitationPageLocationParam | CitationContentBlockLocationParam | CitationWebSearchResultLocationParam | CitationSearchResultLocationParam;

/**
 * The properties IsFileUpdate, Type are required.
 */
export interface TextEditorCodeExecutionCreateResultBlockParam {
  is_file_update: boolean;
  /**
   * This field can be elided, and will marshal its zero value as
   * "text_editor_code_execution_create_result".
   */
  type?: "text_editor_code_execution_create_result" | null;
}

/**
 * The property Type is required.
 */
export interface TextEditorCodeExecutionStrReplaceResultBlockParam {
  new_lines?: number | null;
  new_start?: number | null;
  old_lines?: number | null;
  old_start?: number | null;
  lines?: Array<string> | null;
  /**
   * This field can be elided, and will marshal its zero value as
   * "text_editor_code_execution_str_replace_result".
   */
  type?: "text_editor_code_execution_str_replace_result" | null;
}

/**
 * The properties Content, ToolUseID, Type are required.
 */
export interface TextEditorCodeExecutionToolResultBlockParam {
  content: TextEditorCodeExecutionToolResultBlockParamContentUnion;
  tool_use_id: string;
  /**
   * Create a cache control breakpoint at this content block.
   */
  cache_control?: CacheControlEphemeralParam | null;
  /**
   * This field can be elided, and will marshal its zero value as
   * "text_editor_code_execution_tool_result".
   */
  type?: "text_editor_code_execution_tool_result" | null;
}

export type TextEditorCodeExecutionToolResultBlockParamContentUnion = TextEditorCodeExecutionToolResultErrorParam | TextEditorCodeExecutionViewResultBlockParam | TextEditorCodeExecutionCreateResultBlockParam | TextEditorCodeExecutionStrReplaceResultBlockParam;

/**
 * The properties ErrorCode, Type are required.
 */
export interface TextEditorCodeExecutionToolResultErrorParam {
  /**
   * Any of "invalid_tool_input", "unavailable", "too_many_requests",
   * "execution_time_exceeded", "file_not_found".
   */
  error_code: TextEditorCodeExecutionToolResultErrorParamErrorCode;
  error_message?: string | null;
  /**
   * This field can be elided, and will marshal its zero value as
   * "text_editor_code_execution_tool_result_error".
   */
  type?: "text_editor_code_execution_tool_result_error" | null;
}

export type TextEditorCodeExecutionToolResultErrorParamErrorCode = string;

/**
 * The properties Content, FileType, Type are required.
 */
export interface TextEditorCodeExecutionViewResultBlockParam {
  content: string;
  /**
   * Any of "text", "image", "pdf".
   */
  file_type: TextEditorCodeExecutionViewResultBlockParamFileType;
  num_lines?: number | null;
  start_line?: number | null;
  total_lines?: number | null;
  /**
   * This field can be elided, and will marshal its zero value as
   * "text_editor_code_execution_view_result".
   */
  type?: "text_editor_code_execution_view_result" | null;
}

export type TextEditorCodeExecutionViewResultBlockParamFileType = string;

/**
 * The properties Signature, Thinking, Type are required.
 */
export interface ThinkingBlockParam {
  /**
   * The `signature` value of this thinking block, exactly as returned by the API in
   * a previous response. Used to verify that the block was generated by Claude.
   *
   * Thinking blocks must be passed back unmodified and in their original order; a
   * modified block results in a 400 `invalid_request_error`.
   */
  signature: string;
  /**
   * The `thinking` text of this block as returned by the API.
   */
  thinking: string;
  /**
   * This field can be elided, and will marshal its zero value as "thinking".
   */
  type?: "thinking" | null;
}

/**
 * Reference to a single MCP tool by its server and remote name — the same
 * `server_name`/`name` pair `mcp_tool_use` carries.
 */
export interface ToolChangeMCPToolReferenceParam {
  name: string;
  server_name: string;
  /**
   * This field can be elided, and will marshal its zero value as
   * "mcp_tool_reference".
   */
  type?: "mcp_tool_reference" | null;
}

/**
 * Reference to every tool in the named MCP server's toolset.
 */
export interface ToolChangeMCPToolsetReferenceParam {
  server_name: string;
  /**
   * This field can be elided, and will marshal its zero value as
   * "mcp_toolset_reference".
   */
  type?: "mcp_toolset_reference" | null;
}

/**
 * Reference to a single tool the caller declared directly in `tools[]`. Does not
 * accept the composed `{server}_{name}` form the server assigns to MCP-resolved
 * tools — use `mcp_tool_reference` or `mcp_toolset_reference` for those.
 */
export interface ToolChangeToolReferenceParam {
  name: string;
  /**
   * This field can be elided, and will marshal its zero value as "tool_reference".
   */
  type?: "tool_reference" | null;
}

/**
 * Tool reference block that can be included in tool_result content.
 */
export interface ToolReferenceBlockParam {
  tool_name: string;
  /**
   * Create a cache control breakpoint at this content block.
   */
  cache_control?: CacheControlEphemeralParam | null;
  /**
   * This field can be elided, and will marshal its zero value as "tool_reference".
   */
  type?: "tool_reference" | null;
}

/**
 * The properties ToolUseID, Type are required.
 */
export interface ToolResultBlockParam {
  tool_use_id: string;
  /**
   * For a toolset member tool_result, the toolset family of the paired tool_use.
   */
  toolset_name?: string | null;
  is_error?: boolean | null;
  /**
   * Create a cache control breakpoint at this content block.
   */
  cache_control?: CacheControlEphemeralParam | null;
  content?: Array<ToolResultBlockParamContentUnion> | null;
  /**
   * This field can be elided, and will marshal its zero value as "tool_result".
   */
  type?: "tool_result" | null;
}

export type ToolResultBlockParamContentUnion = TextBlockParam | ImageBlockParam | SearchResultBlockParam | RequestDocumentBlockParam | ToolReferenceBlockParam | BrowserStateBlockParam;

/**
 * The properties Content, ToolUseID, Type are required.
 */
export interface ToolSearchToolResultBlockParam {
  content: ToolSearchToolResultBlockParamContentUnion;
  tool_use_id: string;
  /**
   * Create a cache control breakpoint at this content block.
   */
  cache_control?: CacheControlEphemeralParam | null;
  /**
   * This field can be elided, and will marshal its zero value as
   * "tool_search_tool_result".
   */
  type?: "tool_search_tool_result" | null;
}

export type ToolSearchToolResultBlockParamContentUnion = ToolSearchToolResultErrorParam | ToolSearchToolSearchResultBlockParam;

/**
 * The properties ErrorCode, Type are required.
 */
export interface ToolSearchToolResultErrorParam {
  /**
   * Any of "invalid_tool_input", "unavailable", "too_many_requests",
   * "execution_time_exceeded".
   */
  error_code: ToolSearchToolResultErrorParamErrorCode;
  error_message?: string | null;
  /**
   * This field can be elided, and will marshal its zero value as
   * "tool_search_tool_result_error".
   */
  type?: "tool_search_tool_result_error" | null;
}

export type ToolSearchToolResultErrorParamErrorCode = string;

/**
 * The properties ToolReferences, Type are required.
 */
export interface ToolSearchToolSearchResultBlockParam {
  tool_references: Array<ToolReferenceBlockParam>;
  /**
   * This field can be elided, and will marshal its zero value as
   * "tool_search_tool_search_result".
   */
  type?: "tool_search_tool_search_result" | null;
}

/**
 * The properties ID, Input, Name, Type are required.
 */
export interface ToolUseBlockParam {
  id: string;
  input: unknown;
  name: string;
  /**
   * For a toolset member tool_use, the toolset family this member belongs to.
   */
  toolset_name?: string | null;
  /**
   * Create a cache control breakpoint at this content block.
   */
  cache_control?: CacheControlEphemeralParam | null;
  /**
   * Tool invocation directly from the model.
   */
  caller?: ToolUseBlockParamCallerUnion | null;
  /**
   * This field can be elided, and will marshal its zero value as "tool_use".
   */
  type?: "tool_use" | null;
}

export type ToolUseBlockParamCallerUnion = DirectCallerParam | ServerToolCallerParam | ServerToolCaller20260120Param;

/**
 * The properties Type, URL are required.
 */
export interface URLImageSourceParam {
  url: string;
  /**
   * This field can be elided, and will marshal its zero value as "url".
   */
  type?: "url" | null;
}

/**
 * The properties Type, URL are required.
 */
export interface URLPDFSourceParam {
  url: string;
  /**
   * This field can be elided, and will marshal its zero value as "url".
   */
  type?: "url" | null;
}

/**
 * The properties Content, Type, URL are required.
 */
export interface WebFetchBlockParam {
  content: RequestDocumentBlockParam;
  /**
   * Fetched content URL
   */
  url: string;
  /**
   * ISO 8601 timestamp when the content was retrieved
   */
  retrieved_at?: string | null;
  /**
   * This field can be elided, and will marshal its zero value as "web_fetch_result".
   */
  type?: "web_fetch_result" | null;
}

/**
 * The properties Content, ToolUseID, Type are required.
 */
export interface WebFetchToolResultBlockParam {
  content: WebFetchToolResultBlockParamContentUnion;
  tool_use_id: string;
  /**
   * Create a cache control breakpoint at this content block.
   */
  cache_control?: CacheControlEphemeralParam | null;
  /**
   * Tool invocation directly from the model.
   */
  caller?: WebFetchToolResultBlockParamCallerUnion | null;
  /**
   * This field can be elided, and will marshal its zero value as
   * "web_fetch_tool_result".
   */
  type?: "web_fetch_tool_result" | null;
}

export type WebFetchToolResultBlockParamContentUnion = WebFetchToolResultErrorBlockParam | WebFetchBlockParam;

export type WebFetchToolResultBlockParamCallerUnion = DirectCallerParam | ServerToolCallerParam | ServerToolCaller20260120Param;

/**
 * The properties ErrorCode, Type are required.
 */
export interface WebFetchToolResultErrorBlockParam {
  /**
   * Any of "invalid_tool_input", "url_too_long", "url_not_allowed",
   * "url_not_in_prior_context", "url_not_accessible", "unsupported_content_type",
   * "too_many_requests", "max_uses_exceeded", "unavailable".
   */
  error_code: WebFetchToolResultErrorCode;
  /**
   * This field can be elided, and will marshal its zero value as
   * "web_fetch_tool_result_error".
   */
  type?: "web_fetch_tool_result_error" | null;
}

export type WebFetchToolResultErrorCode = string;

/**
 * The properties EncryptedContent, Title, Type, URL are required.
 */
export interface WebSearchResultBlockParam {
  encrypted_content: string;
  title: string;
  url: string;
  page_age?: string | null;
  /**
   * This field can be elided, and will marshal its zero value as
   * "web_search_result".
   */
  type?: "web_search_result" | null;
}

/**
 * The properties ErrorCode, Type are required.
 */
export interface WebSearchToolRequestErrorParam {
  /**
   * Any of "invalid_tool_input", "unavailable", "max_uses_exceeded",
   * "too_many_requests", "query_too_long", "request_too_large".
   */
  error_code: WebSearchToolResultErrorCode;
  /**
   * This field can be elided, and will marshal its zero value as
   * "web_search_tool_result_error".
   */
  type?: "web_search_tool_result_error" | null;
}

/**
 * The properties Content, ToolUseID, Type are required.
 */
export interface WebSearchToolResultBlockParam {
  content: WebSearchToolResultBlockParamContentUnion;
  tool_use_id: string;
  /**
   * Create a cache control breakpoint at this content block.
   */
  cache_control?: CacheControlEphemeralParam | null;
  /**
   * Tool invocation directly from the model.
   */
  caller?: WebSearchToolResultBlockParamCallerUnion | null;
  /**
   * This field can be elided, and will marshal its zero value as
   * "web_search_tool_result".
   */
  type?: "web_search_tool_result" | null;
}

export type WebSearchToolResultBlockParamCallerUnion = DirectCallerParam | ServerToolCallerParam | ServerToolCaller20260120Param;

export type WebSearchToolResultBlockParamContentUnion = Array<WebSearchResultBlockParam> | WebSearchToolRequestErrorParam;

export type WebSearchToolResultErrorCode = string;

/**
 * Model identifies a model available to the API.
 */
export type Model = string;

/**
 * Indicates whether a capability is supported.
 */
export interface CapabilitySupport {
  /**
   * Whether this capability is supported by the model.
   */
  supported: boolean;
}

/**
 * Context management capability details.
 */
export interface ContextManagementCapability {
  /**
   * Indicates whether a capability is supported.
   */
  clear_thinking_20251015: CapabilitySupport;
  /**
   * Indicates whether a capability is supported.
   */
  clear_tool_uses_20250919: CapabilitySupport;
  /**
   * Indicates whether a capability is supported.
   */
  compact_20260112: CapabilitySupport;
  /**
   * Whether this capability is supported by the model.
   */
  supported: boolean;
}

/**
 * Effort (reasoning_effort) capability details.
 */
export interface EffortCapability {
  /**
   * Whether the model supports high effort level.
   */
  high: CapabilitySupport;
  /**
   * Whether the model supports low effort level.
   */
  low: CapabilitySupport;
  /**
   * Whether the model supports max effort level.
   */
  max: CapabilitySupport;
  /**
   * Whether the model supports medium effort level.
   */
  medium: CapabilitySupport;
  /**
   * Whether this capability is supported by the model.
   */
  supported: boolean;
  /**
   * Indicates whether a capability is supported.
   */
  xhigh: CapabilitySupport;
}

/**
 * Model capability information.
 */
export interface ModelCapabilities {
  /**
   * Whether the model supports the Batch API.
   */
  batch: CapabilitySupport;
  /**
   * Whether the model supports citation generation.
   */
  citations: CapabilitySupport;
  /**
   * Whether the model supports code execution tools.
   */
  code_execution: CapabilitySupport;
  /**
   * Context management support and available strategies.
   */
  context_management: ContextManagementCapability;
  /**
   * Effort (reasoning_effort) support and available levels.
   */
  effort: EffortCapability;
  /**
   * Whether the model accepts image content blocks.
   */
  image_input: CapabilitySupport;
  /**
   * Whether the model accepts PDF content blocks.
   */
  pdf_input: CapabilitySupport;
  /**
   * Whether the model supports structured output / JSON mode / strict tool schemas.
   */
  structured_outputs: CapabilitySupport;
  /**
   * Thinking capability and supported type configurations.
   */
  thinking: ThinkingCapability;
}

export interface ModelInfo {
  source?: string;
  is_enabled?: boolean;
  is_new?: boolean;
  price_factor?: number;
  efforts?: Array<string>;
  default_effort?: string;
  default_context_window?: number;
  available_context_windows?: Array<number>;
  /**
   * Unique model identifier.
   */
  id: string;
  /**
   * Model IDs this model accepts as `fallbacks`i`.model` on the Messages API. An
   * empty list means the `fallbacks` parameter is not supported for this model as
   * primary.
   */
  allowed_fallback_models: Array<string>;
  /**
   * Model capability information.
   */
  capabilities: ModelCapabilities;
  /**
   * RFC 3339 datetime string representing the time at which the model was released.
   * May be set to an epoch value if the release date is unknown.
   */
  created_at: string;
  /**
   * A human-readable name for the model.
   */
  display_name: string;
  /**
   * Maximum input context window size in tokens for this model.
   */
  max_input_tokens: number;
  /**
   * Maximum value for the `max_tokens` parameter when using this model.
   */
  max_tokens: number;
  /**
   * Object type.
   *
   * For Models, this is always `"model"`.
   */
  type?: "model";
}

/**
 * Thinking capability details.
 */
export interface ThinkingCapability {
  /**
   * Whether this capability is supported by the model.
   */
  supported: boolean;
  /**
   * Supported thinking type configurations.
   */
  types: ThinkingTypes;
}

/**
 * Supported thinking type configurations.
 */
export interface ThinkingTypes {
  /**
   * Whether the model supports thinking with type 'adaptive' (auto).
   */
  adaptive: CapabilitySupport;
  /**
   * Whether the model supports thinking with type 'enabled'.
   */
  enabled: CapabilitySupport;
}

export interface ModelListParams {
  /**
   * ID of the object to use as a cursor for pagination. When provided, returns the
   * page of results immediately after this object.
   */
  after_id?: string;
  /**
   * ID of the object to use as a cursor for pagination. When provided, returns the
   * page of results immediately before this object.
   */
  before_id?: string;
  /**
   * Number of items to return per page.
   *
   * Defaults to `20`. Ranges from `1` to `1000`.
   */
  limit?: number;
  workspace_id?: string;
  /**
   * Optional header to specify the beta version(s) you want to use.
   */
  betas?: Array<QoderBeta>;
}

export type QoderBeta = string;

export type Currency = "USD";

/**
 * A monetary amount in a specific currency.
 */
export interface MonetaryAmount {
  /**
   * Amount in minor units of the currency, as an integer decimal string with no
   * leading zeros: "2500" is $25.00 and "50" is fifty cents. A string rather than a
   * number so no float rounding is ever applied.
   */
  amount: string;
  /**
   * Uppercase ISO-4217 currency code. `USD` is the only currency currently
   * supported; the accepted set is closed and grows only when a new currency is
   * priced.
   *
   * Any of "USD".
   */
  currency: Currency;
}

/**
 * A monetary amount in a specific currency.
 */
export interface MonetaryAmountParam {
  /**
   * Amount in minor units of the currency, as an integer decimal string with no
   * leading zeros: "2500" is $25.00 and "50" is fifty cents. A string rather than a
   * number so no float rounding is ever applied.
   */
  amount: string;
  /**
   * Uppercase ISO-4217 currency code. `USD` is the only currency currently
   * supported; the accepted set is closed and grows only when a new currency is
   * priced.
   *
   * Any of "USD".
   */
  currency: Currency;
}

/**
 * Platform advisor roster entry: a model the session's primary thread may consult
 * mid-turn. At most one per roster; the entry occupies the roster name
 * `qoder.advisor`.
 */
export interface ManagedAgentsAdvisorParams {
  /**
   * A Claude model id. The model must be permitted as an advisor for this agent's
   * model — see the sessions/threads/advisor spec.
   */
  model: string;
  /**
   * Any of "advisor".
   */
  type: ManagedAgentsAdvisorParamsType;
}

export type ManagedAgentsAdvisorParamsType = "advisor";

export interface ManagedAgentsAgentMessagePreview {
  /**
   * The id the buffered agent.message will carry if it is emitted. Matches the
   * event_id on this preview's event_delta events.
   */
  id: string;
  /**
   * Any of "agent.message".
   */
  type: ManagedAgentsAgentMessagePreviewType;
}

export type ManagedAgentsAgentMessagePreviewType = "agent.message";

/**
 * Specification for an Agent. Provide a specific `version` or use the short-form
 * `agent="agent_id"` for the most recent version
 */
export interface ManagedAgentsAgentParams {
  /**
   * The `agent` ID.
   */
  id: string;
  /**
   * Any of "agent".
   */
  type: ManagedAgentsAgentParamsType;
  /**
   * The specific `agent` version to use. Omit to use the latest version. Must be at
   * least 1 if specified.
   */
  version?: number | null;
}

export type ManagedAgentsAgentParamsType = "agent";

export interface ManagedAgentsAgentThinkingPreview {
  /**
   * The id the buffered agent.thinking will carry if it is emitted. Start-only — no
   * event_delta events follow.
   */
  id: string;
  /**
   * Any of "agent.thinking".
   */
  type: ManagedAgentsAgentThinkingPreviewType;
}

export type ManagedAgentsAgentThinkingPreviewType = "agent.thinking";

/**
 * Reference to an `agent` plus optional configuration overrides. Each provided
 * field replaces the agent's value for the caller's use; the agent resource is
 * unchanged.
 */
export interface ManagedAgentsAgentWithOverridesParams {
  /**
   * The `agent` ID.
   */
  id: string;
  /**
   * Any of "agent_with_overrides".
   */
  type: ManagedAgentsAgentWithOverridesParamsType;
  /**
   * Replacement system prompt. Up to 100,000 characters. Set to null to clear the
   * agent's system prompt; omit to preserve it.
   */
  system?: string | null;
  /**
   * The specific `agent` version to use. Omit to use the latest version.
   */
  version?: number | null;
  /**
   * Replacement MCP server list. Full replacement: the provided array becomes the
   * MCP servers. Send an empty array to clear; omit to preserve the agent's servers.
   */
  mcp_servers?: Array<ManagedAgentsURLMCPServerParams> | null;
  /**
   * Replacement model. Accepts the model string, e.g. `claude-opus-5`, or a
   * `model_config` object. Omit to use the agent's model.
   */
  model?: ManagedAgentsModelConfigParams | null;
  /**
   * Replacement skill list. Full replacement: the provided array becomes the skills.
   * Send an empty array to clear; omit to preserve the agent's skills.
   */
  skills?: Array<ManagedAgentsSkillParamsUnion> | null;
  /**
   * Replacement tool list. Full replacement: the provided array becomes the tool
   * configuration. Send an empty array to clear; omit to preserve the agent's tools.
   */
  tools?: Array<ManagedAgentsAgentWithOverridesParamsToolUnion> | null;
}

export type ManagedAgentsAgentWithOverridesParamsType = "agent_with_overrides";

export type ManagedAgentsAgentWithOverridesParamsToolUnion = ManagedAgentsAgentToolset20260401Params | ManagedAgentsMCPToolsetParams | ManagedAgentsCustomToolParams;

export interface ManagedAgentsBranchCheckout {
  /**
   * Branch name to check out.
   */
  name: string;
  /**
   * Any of "branch".
   */
  type: ManagedAgentsBranchCheckoutType;
}

export type ManagedAgentsBranchCheckoutType = "branch";

/**
 * The properties Name, Type are required.
 */
export interface ManagedAgentsBranchCheckoutParam {
  /**
   * Branch name to check out.
   */
  name: string;
  /**
   * Any of "branch".
   */
  type: ManagedAgentsBranchCheckoutType;
}

/**
 * A hard spend ceiling. The session stops issuing new model requests once the
 * tracked list cost reaches `max_list_cost`.
 */
export interface ManagedAgentsBudgetLimit {
  /**
   * A monetary amount in a specific currency.
   */
  max_list_cost: MonetaryAmount;
  /**
   * Any of "limit".
   */
  type: ManagedAgentsBudgetLimitType;
}

export type ManagedAgentsBudgetLimitType = "limit";

/**
 * A hard spend ceiling. The session stops issuing new model requests once the
 * tracked list cost reaches `max_list_cost`.
 */
export interface ManagedAgentsBudgetLimitParam {
  /**
   * A monetary amount in a specific currency.
   */
  max_list_cost: MonetaryAmountParam;
  /**
   * Any of "limit".
   */
  type: ManagedAgentsBudgetLimitType;
}

/**
 * Prompt-cache creation token usage broken down by cache lifetime.
 */
export interface ManagedAgentsCacheCreationUsage {
  /**
   * Tokens used to create 1-hour ephemeral cache entries.
   */
  ephemeral_1h_input_tokens?: number;
  /**
   * Tokens used to create 5-minute ephemeral cache entries.
   */
  ephemeral_5m_input_tokens?: number;
}

export interface ManagedAgentsCommitCheckout {
  /**
   * Full commit SHA to check out.
   */
  sha: string;
  /**
   * Any of "commit".
   */
  type: ManagedAgentsCommitCheckoutType;
}

export type ManagedAgentsCommitCheckoutType = "commit";

/**
 * The properties Sha, Type are required.
 */
export interface ManagedAgentsCommitCheckoutParam {
  /**
   * Full commit SHA to check out.
   */
  sha: string;
  /**
   * Any of "commit".
   */
  type: ManagedAgentsCommitCheckoutType;
}

/**
 * Confirmation that a `session` has been permanently deleted.
 */
export interface ManagedAgentsDeletedSession {
  id: string;
  /**
   * Any of "session_deleted".
   */
  type: ManagedAgentsDeletedSessionType;
}

export type ManagedAgentsDeletedSessionType = "session_deleted";

export interface ManagedAgentsDeltaContent {
  /**
   * Regular text content.
   */
  content: ManagedAgentsTextBlock;
  /**
   * Any of "content_delta".
   */
  type: ManagedAgentsDeltaContentType;
  /**
   * Which entry in the previewed event's content array this fragment lands in.
   * Insert content as that entry when the index is new; append to the existing entry
   * otherwise.
   */
  index?: number;
}

export type ManagedAgentsDeltaContentType = "content_delta";

/**
 * An incremental update to an event that is still being streamed. Deltas are
 * best-effort and may stop early; when the buffered event with id == event_id is
 * produced it carries the complete content. A model request that ends early (an
 * error or interrupt) produces no buffered event — its terminal
 * span.model_request_end closes the preview. Only sent on stream connections that
 * opt in via event_deltas; never appears in event history.
 */
export interface ManagedAgentsDeltaEvent {
  /**
   * One fragment of the previewed event. The delta type is named for the previewed
   * event's field it streams into: agent.message events stream content_delta
   * fragments, each a partial element of the content array.
   */
  delta: ManagedAgentsDeltaContent;
  /**
   * The id of the event being previewed. Matches event.id on the corresponding
   * event_start and the buffered event that reconciles the preview.
   */
  event_id: string;
  /**
   * Any of "event_delta".
   */
  type: ManagedAgentsDeltaEventType;
}

export type ManagedAgentsDeltaEventType = "event_delta";

/**
 * EventDeltaType enum
 */
export type ManagedAgentsDeltaType = "agent.message" | "agent.thinking";

/**
 * Mount a file uploaded via the Files API into the session.
 */
export interface ManagedAgentsFileResourceParams {
  /**
   * ID of a previously uploaded file.
   */
  file_id: string;
  /**
   * Any of "file".
   */
  type: ManagedAgentsFileResourceParamsType;
  /**
   * Mount path in the container. Defaults to `/mnt/session/uploads/<file_id>`.
   */
  mount_path?: string | null;
}

export type ManagedAgentsFileResourceParamsType = "file";

/**
 * Mount a GitHub repository into the session's container.
 */
export interface ManagedAgentsGitHubRepositoryResourceParams {
  /**
   * GitHub authorization token used to clone the repository.
   */
  authorization_token: string;
  /**
   * Any of "github_repository".
   */
  type: ManagedAgentsGitHubRepositoryResourceParamsType;
  /**
   * Github URL of the repository
   */
  url: string;
  /**
   * Mount path in the container. Defaults to `/workspace/<repo-name>`.
   */
  mount_path?: string | null;
  /**
   * Branch or commit to check out. Defaults to the repository's default branch.
   */
  checkout?: ManagedAgentsGitHubRepositoryResourceParamsCheckoutUnion | null;
}

export type ManagedAgentsGitHubRepositoryResourceParamsType = "github_repository";

export type ManagedAgentsGitHubRepositoryResourceParamsCheckoutUnion = ManagedAgentsBranchCheckoutParam | ManagedAgentsCommitCheckoutParam;

/**
 * Parameters for attaching a memory store to an agent session.
 */
export interface ManagedAgentsMemoryStoreResourceParam {
  /**
   * The memory store ID (memstore\_...). Must belong to the caller's organization
   * and workspace.
   */
  memory_store_id: string;
  /**
   * Any of "memory_store".
   */
  type: ManagedAgentsMemoryStoreResourceParamType;
  /**
   * Per-attachment guidance for the agent on how to use this store. Rendered into
   * the memory section of the system prompt. Max 4096 chars.
   */
  instructions?: string | null;
  /**
   * Access mode for an attached memory store.
   *
   * Any of "read_write", "read_only".
   */
  access?: ManagedAgentsMemoryStoreResourceParamAccess | null;
}

export type ManagedAgentsMemoryStoreResourceParamType = "memory_store";

/**
 * Access mode for an attached memory store.
 */
export type ManagedAgentsMemoryStoreResourceParamAccess = "read_write" | "read_only";

/**
 * Resolved coordinator topology with a concrete agent roster.
 */
export interface ManagedAgentsMultiagent {
  /**
   * Agents the coordinator may spawn as session threads, each resolved to a specific
   * version.
   */
  agents: Array<ManagedAgentsMultiagentAgentUnion>;
  /**
   * Any of "coordinator".
   */
  type: ManagedAgentsMultiagentType;
}

export type ManagedAgentsMultiagentAgentUnion = ManagedAgentsAgentReference | ManagedAgentsAdvisor;

export type ManagedAgentsMultiagentType = "coordinator";

/**
 * A coordinator topology: the session's primary thread orchestrates work by
 * spawning session threads, each running an agent drawn from the `agents` roster.
 */
export interface ManagedAgentsMultiagentParams {
  /**
   * Agents the coordinator may spawn as session threads. 1–20 entries. Each entry is
   * an agent ID string, a versioned `{"type":"agent","id","version"}` reference, or
   * `{"type":"self"}` to allow recursive self-invocation. Entries must reference
   * distinct agents (after resolving `self` and string forms); at most one `self`.
   * Referenced agents must exist, must not be archived, and must not themselves have
   * `multiagent` set (depth limit 1).
   */
  agents: Array<ManagedAgentsMultiagentRosterEntryParamsUnion>;
  /**
   * Any of "coordinator".
   */
  type: ManagedAgentsMultiagentParamsType;
}

export type ManagedAgentsMultiagentParamsType = "coordinator";

export type ManagedAgentsMultiagentRosterEntryParamsUnion = string | ManagedAgentsAgentParams | ManagedAgentsMultiagentSelfParams | ManagedAgentsAdvisorParams;

/**
 * Evaluation state for a single outcome defined via a `define_outcome` event.
 */
export interface ManagedAgentsOutcomeEvaluationResource {
  /**
   * A timestamp in RFC 3339 format
   */
  completed_at: string;
  /**
   * What the agent should produce.
   */
  description: string;
  /**
   * Grader's verdict text from the most recent evaluation. For `satisfied`, explains
   * why criteria are met; for `needs_revision` (intermediate), what's missing; for
   * `failed`, why unrecoverable.
   */
  explanation: string;
  /**
   * 0-indexed revision cycle the outcome is currently on.
   */
  iteration: number;
  /**
   * Server-generated outc\_ ID for this outcome.
   */
  outcome_id: string;
  /**
   * Current evaluation state. `pending` before the agent begins work; `running`
   * while producing or revising; `evaluating` while the grader scores;
   * `satisfied`/`max_iterations_reached`/`failed`/`interrupted` are terminal.
   */
  result: string;
  /**
   * Any of "outcome_evaluation".
   */
  type: ManagedAgentsOutcomeEvaluationResourceType;
}

export type ManagedAgentsOutcomeEvaluationResourceType = "outcome_evaluation";

/**
 * Cumulative count of server-executed tool invocations, broken down by tool.
 */
export interface ManagedAgentsServerToolUsage {
  /**
   * Number of server-executed web fetch requests.
   */
  web_fetch_requests?: number;
  /**
   * Number of server-executed web search requests.
   */
  web_search_requests?: number;
}

/**
 * A Managed Agents `session`.
 */
export interface ManagedAgentsSession {
  environment_variables?: Record<string, string>;
  id: string;
  /**
   * Resolved `agent` definition for a `session`. Snapshot of the `agent` at
   * `session` creation time.
   */
  agent: ManagedAgentsSessionAgent;
  /**
   * A timestamp in RFC 3339 format
   */
  archived_at: string | null;
  /**
   * A hard spend ceiling. The session stops issuing new model requests once the
   * tracked list cost reaches `max_list_cost`.
   */
  budget: ManagedAgentsBudgetLimit;
  /**
   * A timestamp in RFC 3339 format
   */
  created_at: string;
  environment_id: string;
  metadata: Record<string, string>;
  /**
   * Per-outcome evaluation state. One entry per `define_outcome` event sent to the
   * session.
   */
  outcome_evaluations: Array<ManagedAgentsOutcomeEvaluationResource>;
  resources: Array<ManagedAgentsSessionResourceUnion>;
  /**
   * Timing statistics for a session.
   */
  stats: ManagedAgentsSessionStats;
  /**
   * SessionStatus enum
   *
   * Any of "rescheduling", "running", "idle", "terminated".
   */
  status: ManagedAgentsSessionStatus;
  title: string;
  /**
   * Any of "session".
   */
  type: ManagedAgentsSessionType;
  /**
   * A timestamp in RFC 3339 format
   */
  updated_at: string;
  /**
   * Cumulative token usage for a session across all turns.
   */
  usage: ManagedAgentsSessionUsage;
  /**
   * Vault IDs attached to the session at creation. Empty when no vaults were
   * supplied.
   */
  vault_ids: Array<string>;
  /**
   * Deployment ID when the session was created from a deployment reference. Null
   * otherwise.
   */
  deployment_id?: string | null;
}

/**
 * SessionStatus enum
 */
export type ManagedAgentsSessionStatus = "rescheduling" | "running" | "idle" | "terminated";

export type ManagedAgentsSessionType = "session";

/**
 * Resolved `agent` definition for a `session`. Snapshot of the `agent` at
 * `session` creation time.
 */
export interface ManagedAgentsSessionAgent {
  id: string;
  description: string;
  mcp_servers: Array<ManagedAgentsMCPServerURLDefinition>;
  /**
   * Model identifier and configuration.
   */
  model: ManagedAgentsModelConfig;
  /**
   * Resolved coordinator topology with full agent definitions for each roster
   * member.
   */
  multiagent: ManagedAgentsSessionMultiagentCoordinator;
  name: string;
  skills: Array<ManagedAgentsSessionAgentSkillUnion>;
  system: string;
  tools: Array<ManagedAgentsSessionAgentToolUnion>;
  /**
   * Any of "agent".
   */
  type: ManagedAgentsSessionAgentType;
  version: number;
}

export type ManagedAgentsSessionAgentSkillUnion = ManagedAgentsQoderSkill | ManagedAgentsCustomSkill;

export type ManagedAgentsSessionAgentToolUnion = ManagedAgentsAgentToolset20260401 | ManagedAgentsMCPToolset | ManagedAgentsCustomTool;

export type ManagedAgentsSessionAgentToolUnionConfigs = Array<ManagedAgentsAgentToolConfigUnion> | Array<ManagedAgentsMCPToolConfig>;

export interface ManagedAgentsSessionAgentToolUnionDefaultConfig {
  enabled?: boolean;
  /**
   * This field is a union of
   * `ManagedAgentsAgentToolsetDefaultConfigPermissionPolicyUnion`,
   * `ManagedAgentsMCPToolsetDefaultConfigPermissionPolicyUnion`
   */
  permission_policy?: ManagedAgentsSessionAgentToolUnionDefaultConfigPermissionPolicy;
}

export interface ManagedAgentsSessionAgentToolUnionDefaultConfigPermissionPolicy {
  type?: string;
}

export type ManagedAgentsSessionAgentType = "agent";

/**
 * Mid-session agent configuration update. Only `tools` and `mcp_servers` are
 * updatable. Full replacement: the provided array becomes the new value. To
 * preserve existing entries, GET the session, modify the array, and POST it back.
 */
export interface ManagedAgentsSessionAgentUpdateParam {
  model?: ManagedAgentsModelConfigParams | null;
  system?: string | null;
  skills?: Array<ManagedAgentsSkillParamsUnion> | null;
  /**
   * Replacement MCP server list. Full replacement: the provided array becomes the
   * new value. Send an empty array to clear; omit to preserve.
   */
  mcp_servers?: Array<ManagedAgentsURLMCPServerParams> | null;
  /**
   * Replacement tool list. Full replacement: the provided array becomes the new
   * value. Send an empty array to clear; omit to preserve.
   */
  tools?: Array<ManagedAgentsSessionAgentUpdateToolUnionParam> | null;
}

export type ManagedAgentsSessionAgentUpdateToolUnionParam = ManagedAgentsAgentToolset20260401Params | ManagedAgentsMCPToolsetParams | ManagedAgentsCustomToolParams;

/**
 * Resolved coordinator topology with full agent definitions for each roster
 * member.
 */
export interface ManagedAgentsSessionMultiagentCoordinator {
  /**
   * Full `agent` definitions the coordinator may spawn as session threads.
   */
  agents: Array<ManagedAgentsSessionMultiagentCoordinatorAgentUnion>;
  /**
   * Any of "coordinator".
   */
  type: ManagedAgentsSessionMultiagentCoordinatorType;
}

/**
 * ManagedAgentsSessionMultiagentCoordinatorAgentUnion contains all possible
 * properties and values from `ManagedAgentsSessionThreadAgent`,
 * `ManagedAgentsAdvisor`.
 */
export type ManagedAgentsSessionMultiagentCoordinatorAgentUnion = ManagedAgentsSessionThreadAgent | ManagedAgentsAdvisor;

/**
 * ManagedAgentsSessionMultiagentCoordinatorAgentUnionModel is an implicit
 * subunion of `ManagedAgentsSessionMultiagentCoordinatorAgentUnion`.
 * ManagedAgentsSessionMultiagentCoordinatorAgentUnionModel provides convenient
 * access to the sub-properties of the union.
 */
export type ManagedAgentsSessionMultiagentCoordinatorAgentUnionModel = string | {
  /**
   * This field is from variant `ManagedAgentsModelConfig`.
   */
  id?: ManagedAgentsModel;
  /**
   * This field is from variant `ManagedAgentsModelConfig`.
   */
  effort?: ManagedAgentsModelConfigEffortUnion;
  /**
   * This field is from variant `ManagedAgentsModelConfig`.
   */
  inference_geo?: string;
  /**
   * This field is from variant `ManagedAgentsModelConfig`.
   */
  speed?: ManagedAgentsModelConfigSpeed;
};

export type ManagedAgentsSessionMultiagentCoordinatorType = "coordinator";

/**
 * Timing statistics for a session.
 */
export interface ManagedAgentsSessionStats {
  /**
   * Cumulative time in seconds the session spent in `running` status. Excludes idle
   * time.
   */
  active_seconds?: number;
  /**
   * Elapsed time since session creation in seconds. For terminated sessions, frozen
   * at the final update.
   */
  duration_seconds?: number;
}

/**
 * Emitted when an UpdateSession request changed at least one field. Carries only
 * the fields that changed; absent fields were not part of the update. The new
 * configuration applies from the next turn.
 */
export interface ManagedAgentsSessionUpdatedEvent {
  /**
   * Unique identifier for this event.
   */
  id: string;
  /**
   * A timestamp in RFC 3339 format
   */
  processed_at: string;
  /**
   * Any of "session.updated".
   */
  type: ManagedAgentsSessionUpdatedEventType;
  /**
   * Resolved `agent` definition for a `session`. Snapshot of the `agent` at
   * `session` creation time.
   */
  agent?: ManagedAgentsSessionAgent | null;
  /**
   * A hard spend ceiling. The session stops issuing new model requests once the
   * tracked list cost reaches `max_list_cost`.
   */
  budget?: ManagedAgentsBudgetLimit | null;
  /**
   * The session's full metadata bag after the update. Present when the update set
   * non-empty metadata; absent when metadata was unchanged or cleared to empty.
   */
  metadata?: Record<string, string>;
  /**
   * The session's new title. Present only when the update changed it.
   */
  title?: string | null;
}

export type ManagedAgentsSessionUpdatedEventType = "session.updated";

/**
 * Cumulative token usage for a session across all turns.
 */
export interface ManagedAgentsSessionUsage {
  /**
   * Cumulative time in seconds during which the session had at least one thread in
   * running status. Overlapping activity from concurrent threads is counted once,
   * unlike `stats.active_seconds`, which sums each thread's own active time. This is
   * the duration the session's runtime cost is priced on.
   */
  active_seconds?: number;
  /**
   * Prompt-cache creation token usage broken down by cache lifetime.
   */
  cache_creation?: ManagedAgentsCacheCreationUsage;
  /**
   * Total tokens read from prompt cache.
   */
  cache_read_input_tokens?: number;
  /**
   * Total input tokens consumed across all turns.
   */
  input_tokens?: number;
  /**
   * A monetary amount in a specific currency.
   */
  list_cost?: MonetaryAmount | null;
  /**
   * Total output tokens generated across all turns.
   */
  output_tokens?: number;
  /**
   * Cumulative count of server-executed tool invocations, broken down by tool.
   */
  server_tool_use?: ManagedAgentsServerToolUsage | null;
}

/**
 * Periodic snapshot of the session's cumulative usage and tracked list cost.
 */
export interface ManagedAgentsSessionUsageEvent {
  /**
   * Unique identifier for this event.
   */
  id: string;
  /**
   * A timestamp in RFC 3339 format
   */
  processed_at: string;
  /**
   * Any of "session.usage".
   */
  type: ManagedAgentsSessionUsageEventType;
  /**
   * Point-in-time snapshot of a session's cumulative usage.
   */
  usage: ManagedAgentsSessionUsageSnapshot;
  /**
   * A hard spend ceiling. The session stops issuing new model requests once the
   * tracked list cost reaches `max_list_cost`.
   */
  budget?: ManagedAgentsBudgetLimit | null;
}

export type ManagedAgentsSessionUsageEventType = "session.usage";

/**
 * Opens a preview of a buffered event. Carries the previewed event's type and id
 * only. Followed by zero or more event_delta events with the same event id,
 * normally concluded by the buffered event carrying that id. If the producing
 * model request ends without that event (an error or interrupt mid-stream), its
 * terminal span.model_request_end closes the preview. Only sent on stream
 * connections that opt in via event_deltas; never appears in event history.
 */
export interface ManagedAgentsStartEvent {
  /**
   * The previewed event's type and id. The event type determines which delta types
   * the preview's event_delta events carry: agent.message events stream
   * content_delta fragments; agent.thinking previews are start-only — no deltas
   * follow, and the buffered agent.thinking with the same id concludes them.
   */
  event: ManagedAgentsStartEventPreviewUnion;
  /**
   * Any of "event_start".
   */
  type: ManagedAgentsStartEventType;
}

export type ManagedAgentsStartEventType = "event_start";

export type ManagedAgentsStartEventPreviewUnion = ManagedAgentsAgentMessagePreview | ManagedAgentsAgentThinkingPreview;

/**
 * Regular text content.
 */
export interface ManagedAgentsSystemContentBlock {
  /**
   * The text content.
   */
  text: string;
  /**
   * Any of "text".
   */
  type: ManagedAgentsSystemContentBlockType;
}

export type ManagedAgentsSystemContentBlockType = "text";

/**
 * Regular text content.
 */
export interface ManagedAgentsSystemContentBlockParam {
  /**
   * The text content.
   */
  text: string;
  /**
   * Any of "text".
   */
  type: ManagedAgentsSystemContentBlockType;
}

/**
 * A mid-conversation system message event. Carries system-role content that is
 * appended to the session as a `role: "system"` turn.
 */
export interface ManagedAgentsSystemMessageEvent {
  /**
   * Unique identifier for this event.
   */
  id: string;
  /**
   * System content blocks. Text-only.
   */
  content: Array<ManagedAgentsSystemContentBlock>;
  /**
   * Any of "system.message".
   */
  type: ManagedAgentsSystemMessageEventType;
  /**
   * A timestamp in RFC 3339 format
   */
  processed_at?: string | null;
}

export type ManagedAgentsSystemMessageEventType = "system.message";

/**
 * Event sent by the client providing the result of an agent-toolset tool
 * execution. Only valid on `self_hosted` environments, where sandbox-routed tools
 * are executed by the client rather than the server.
 */
export interface ManagedAgentsUserToolResultEvent {
  /**
   * Unique identifier for this event.
   */
  id: string;
  /**
   * The id of the `agent.tool_use` event this result corresponds to, which can be
   * found in the last `session.status_idle`
   * [event's](https://docs.qoder.com/cloud-agents/api/sessions/schemas)
   * `stop_reason.event_ids` field.
   */
  tool_use_id: string;
  /**
   * Any of "user.tool_result".
   */
  type: ManagedAgentsUserToolResultEventType;
  /**
   * The result content returned by the tool.
   */
  content?: Array<ManagedAgentsUserToolResultEventContentUnion>;
  /**
   * Whether the tool execution resulted in an error.
   */
  is_error?: boolean | null;
  /**
   * A timestamp in RFC 3339 format
   */
  processed_at?: string | null;
  /**
   * Routes this result to a subagent thread. Copy from the `agent.tool_use` event's
   * `session_thread_id`.
   */
  session_thread_id?: string | null;
}

export type ManagedAgentsUserToolResultEventType = "user.tool_result";

/**
 * ManagedAgentsUserToolResultEventContentUnion contains all possible
 * properties and values from `ManagedAgentsTextBlock`,
 * `ManagedAgentsImageBlock`, `ManagedAgentsDocumentBlock`,
 * `ManagedAgentsSearchResultBlock`.
 */
export type ManagedAgentsUserToolResultEventContentUnion = ManagedAgentsTextBlock | ManagedAgentsImageBlock | ManagedAgentsDocumentBlock | ManagedAgentsSearchResultBlock;

export type ManagedAgentsUserToolResultEventContentUnionSource = string | {
  data?: string;
  media_type?: string;
  type?: string;
  url?: string;
  file_id?: string;
};

export interface SessionNewParams {
  environment_variables?: Record<string, string> | null;
  /**
   * Agent identifier. Accepts the `agent` ID string, which pins the latest version
   * for the session, or an `agent` object with both id and version specified.
   */
  agent: SessionNewParamsAgentUnion;
  /**
   * ID of the `environment` defining the container configuration for this session.
   */
  environment_id: string;
  /**
   * Human-readable session title.
   */
  title?: string | null;
  workspace_id?: string;
  /**
   * A hard spend ceiling. The session stops issuing new model requests once the
   * tracked list cost reaches `max_list_cost`.
   */
  budget?: ManagedAgentsBudgetLimitParam | null;
  /**
   * Initial events to send to the `session` at creation, processed in order.
   * Supports `user.message` and `user.define_outcome` events. Maximum 50 events.
   */
  initial_events?: Array<SessionNewParamsInitialEventUnion> | null;
  /**
   * Arbitrary key-value metadata attached to the session. Maximum 16 pairs, keys up
   * to 64 chars, values up to 512 chars.
   */
  metadata?: Record<string, string> | null;
  /**
   * Resources (e.g. repositories, files) to mount into the session's container.
   */
  resources?: Array<SessionNewParamsResourceUnion> | null;
  /**
   * Vault IDs for stored credentials the agent can use during the session.
   */
  vault_ids?: Array<string> | null;
  /**
   * Optional header to specify the beta version(s) you want to use.
   */
  betas?: Array<QoderBeta>;
}

export type SessionNewParamsAgentUnion = string | ManagedAgentsAgentParams | ManagedAgentsAgentWithOverridesParams;

export type SessionNewParamsInitialEventUnion = ManagedAgentsUserMessageEventParams | ManagedAgentsUserDefineOutcomeEventParams;

export type SessionNewParamsResourceUnion = ManagedAgentsGitHubRepositoryResourceParams | ManagedAgentsFileResourceParams | ManagedAgentsMemoryStoreResourceParam;

export interface SessionGetParams {
  workspace_id?: string;
  /**
   * Optional header to specify the beta version(s) you want to use.
   */
  betas?: Array<QoderBeta>;
}

export interface SessionUpdateParams {
  environment_variables?: Record<string, string> | null;
  /**
   * Human-readable session title.
   */
  title?: string | null;
  workspace_id?: string;
  /**
   * Metadata patch. Set a key to a string to upsert it, or to null to delete it.
   * Omit the field to preserve.
   */
  metadata?: Record<string, unknown> | null;
  /**
   * Mid-session agent configuration update. Only `tools` and `mcp_servers` are
   * updatable. Full replacement: the provided array becomes the new value. To
   * preserve existing entries, GET the session, modify the array, and POST it back.
   */
  agent?: ManagedAgentsSessionAgentUpdateParam | null;
  /**
   * A hard spend ceiling. The session stops issuing new model requests once the
   * tracked list cost reaches `max_list_cost`.
   */
  budget?: ManagedAgentsBudgetLimitParam | null;
  /**
   * Vault IDs (`vlt_*`) to attach to the session. Not yet supported; requests
   * setting this field are rejected. Reserved for future use.
   */
  vault_ids?: Array<string> | null;
  /**
   * Optional header to specify the beta version(s) you want to use.
   */
  betas?: Array<QoderBeta>;
}

export interface SessionListParams {
  /**
   * Filter sessions created with this agent ID.
   */
  agent_id?: string;
  /**
   * Filter by agent version. Only applies when `agent_id` is also set.
   */
  agent_version?: number;
  /**
   * Return sessions created after this time (exclusive).
   */
  "created_at[gt]"?: string;
  /**
   * Return sessions created at or after this time (inclusive).
   */
  "created_at[gte]"?: string;
  /**
   * Return sessions created before this time (exclusive).
   */
  "created_at[lt]"?: string;
  /**
   * Return sessions created at or before this time (inclusive).
   */
  "created_at[lte]"?: string;
  /**
   * Filter sessions created by this deployment ID.
   */
  deployment_id?: string;
  /**
   * When true, includes archived sessions. Default: false (exclude archived).
   */
  include_archived?: boolean;
  /**
   * Maximum number of results to return.
   */
  limit?: number;
  /**
   * Filter sessions whose resources contain a `memory_store` with this memory store
   * ID.
   */
  memory_store_id?: string;
  /**
   * Opaque pagination cursor from a previous response.
   */
  page?: string;
  workspace_id?: string;
  /**
   * Sort direction for results, ordered by `created_at`. Defaults to `desc` (newest
   * first).
   *
   * Any of "asc", "desc".
   */
  order?: SessionListParamsOrder;
  /**
   * Filter by session status. Repeat the parameter to match any of multiple
   * statuses.
   *
   * Any of "rescheduling", "running", "idle", "terminated".
   */
  statuses?: Array<string>;
  /**
   * Optional header to specify the beta version(s) you want to use.
   */
  betas?: Array<QoderBeta>;
}

/**
 * Sort direction for results, ordered by `created_at`. Defaults to `desc` (newest
 * first).
 */
export type SessionListParamsOrder = "asc" | "desc";

export interface SessionDeleteParams {
  workspace_id?: string;
  /**
   * Optional header to specify the beta version(s) you want to use.
   */
  betas?: Array<QoderBeta>;
}

export interface SessionArchiveParams {
  workspace_id?: string;
  /**
   * Optional header to specify the beta version(s) you want to use.
   */
  betas?: Array<QoderBeta>;
}

/**
 * Event emitted when the agent calls a custom tool. The session goes idle until
 * the client sends a `user.custom_tool_result` event with the result.
 */
export interface ManagedAgentsAgentCustomToolUseEvent {
  /**
   * Unique identifier for this event.
   */
  id: string;
  /**
   * Input parameters for the tool call.
   */
  input: Record<string, unknown>;
  /**
   * Name of the custom tool being called.
   */
  name: string;
  /**
   * A timestamp in RFC 3339 format
   */
  processed_at: string;
  /**
   * Any of "agent.custom_tool_use".
   */
  type: ManagedAgentsAgentCustomToolUseEventType;
  /**
   * When set, this event was cross-posted from a subagent's thread to surface its
   * custom tool use on the primary thread's stream. Empty on the thread's own
   * events. Echo this on a `user.custom_tool_result` event to route the result back.
   */
  session_thread_id?: string | null;
}

export type ManagedAgentsAgentCustomToolUseEventType = "agent.custom_tool_use";

/**
 * Event representing the result of an MCP tool execution.
 */
export interface ManagedAgentsAgentMCPToolResultEvent {
  /**
   * Unique identifier for this event.
   */
  id: string;
  /**
   * The id of the `agent.mcp_tool_use` event this result corresponds to.
   */
  mcp_tool_use_id: string;
  /**
   * A timestamp in RFC 3339 format
   */
  processed_at: string;
  /**
   * Any of "agent.mcp_tool_result".
   */
  type: ManagedAgentsAgentMCPToolResultEventType;
  /**
   * The result content returned by the tool.
   */
  content?: Array<ManagedAgentsAgentMCPToolResultEventContentUnion>;
  /**
   * Whether the tool execution resulted in an error.
   */
  is_error?: boolean | null;
}

export type ManagedAgentsAgentMCPToolResultEventType = "agent.mcp_tool_result";

/**
 * ManagedAgentsAgentMCPToolResultEventContentUnion contains all possible
 * properties and values from `ManagedAgentsTextBlock`,
 * `ManagedAgentsImageBlock`, `ManagedAgentsDocumentBlock`,
 * `ManagedAgentsSearchResultBlock`.
 */
export type ManagedAgentsAgentMCPToolResultEventContentUnion = ManagedAgentsTextBlock | ManagedAgentsImageBlock | ManagedAgentsDocumentBlock | ManagedAgentsSearchResultBlock;

/**
 * ManagedAgentsAgentMCPToolResultEventContentUnionSource is an implicit
 * subunion of `ManagedAgentsAgentMCPToolResultEventContentUnion`.
 * ManagedAgentsAgentMCPToolResultEventContentUnionSource provides convenient
 * access to the sub-properties of the union.
 */
export type ManagedAgentsAgentMCPToolResultEventContentUnionSource = string | {
  data?: string;
  media_type?: string;
  type?: string;
  url?: string;
  file_id?: string;
};

/**
 * Event emitted when the agent invokes a tool provided by an MCP server.
 */
export interface ManagedAgentsAgentMCPToolUseEvent {
  /**
   * Unique identifier for this event.
   */
  id: string;
  /**
   * Input parameters for the tool call.
   */
  input: Record<string, unknown>;
  /**
   * Name of the MCP server providing the tool.
   */
  mcp_server_name: string;
  /**
   * Name of the MCP tool being used.
   */
  name: string;
  /**
   * A timestamp in RFC 3339 format
   */
  processed_at: string;
  /**
   * Any of "agent.mcp_tool_use".
   */
  type: ManagedAgentsAgentMCPToolUseEventType;
  /**
   * AgentEvaluatedPermission enum
   *
   * Any of "allow", "ask", "deny".
   */
  evaluated_permission?: ManagedAgentsAgentMCPToolUseEventEvaluatedPermission;
  /**
   * When set, this event was cross-posted from a subagent's thread to surface its
   * permission request on the primary thread's stream. Empty on the thread's own
   * events. Echo this on a `user.tool_confirmation` event to route the approval
   * back.
   */
  session_thread_id?: string | null;
}

export type ManagedAgentsAgentMCPToolUseEventType = "agent.mcp_tool_use";

/**
 * AgentEvaluatedPermission enum
 */
export type ManagedAgentsAgentMCPToolUseEventEvaluatedPermission = "allow" | "ask" | "deny";

/**
 * An agent response event in the session conversation.
 */
export interface ManagedAgentsAgentMessageEvent {
  /**
   * Unique identifier for this event.
   */
  id: string;
  /**
   * Array of text blocks comprising the agent response.
   */
  content: Array<ManagedAgentsAgentMessageEventContentUnion>;
  /**
   * A timestamp in RFC 3339 format
   */
  processed_at: string;
  /**
   * Any of "agent.message".
   */
  type: ManagedAgentsAgentMessageEventType;
}

export type ManagedAgentsAgentMessageEventContentUnion = ManagedAgentsTextBlock | ManagedAgentsRedactedBlock;

export type ManagedAgentsAgentMessageEventType = "agent.message";

/**
 * Indicates the agent is making forward progress via extended thinking. A progress
 * signal, not a content carrier.
 */
export interface ManagedAgentsAgentThinkingEvent {
  /**
   * Unique identifier for this event.
   */
  id: string;
  /**
   * A timestamp in RFC 3339 format
   */
  processed_at: string;
  /**
   * Any of "agent.thinking".
   */
  type: ManagedAgentsAgentThinkingEventType;
}

export type ManagedAgentsAgentThinkingEventType = "agent.thinking";

/**
 * Indicates that context compaction (summarization) occurred during the session.
 */
export interface ManagedAgentsAgentThreadContextCompactedEvent {
  /**
   * Unique identifier for this event.
   */
  id: string;
  /**
   * A timestamp in RFC 3339 format
   */
  processed_at: string;
  /**
   * Any of "agent.thread_context_compacted".
   */
  type: ManagedAgentsAgentThreadContextCompactedEventType;
}

export type ManagedAgentsAgentThreadContextCompactedEventType = "agent.thread_context_compacted";

/**
 * Delivery event written to the target thread's input stream when an
 * agent-to-agent message arrives.
 */
export interface ManagedAgentsAgentThreadMessageReceivedEvent {
  /**
   * Unique identifier for this event.
   */
  id: string;
  /**
   * Message content blocks.
   */
  content: Array<ManagedAgentsAgentThreadMessageReceivedEventContentUnion>;
  /**
   * Public `sthr_` ID of the thread that sent the message.
   */
  from_session_thread_id: string;
  /**
   * A timestamp in RFC 3339 format
   */
  processed_at: string;
  /**
   * Any of "agent.thread_message_received".
   */
  type: ManagedAgentsAgentThreadMessageReceivedEventType;
  /**
   * Name of the callable agent this message came from. Absent when received from the
   * primary agent.
   */
  from_agent_name?: string | null;
}

/**
 * ManagedAgentsAgentThreadMessageReceivedEventContentUnion contains all
 * possible properties and values from `ManagedAgentsTextBlock`,
 * `ManagedAgentsImageBlock`, `ManagedAgentsDocumentBlock`,
 * `ManagedAgentsRedactedBlock`.
 */
export type ManagedAgentsAgentThreadMessageReceivedEventContentUnion = ManagedAgentsTextBlock | ManagedAgentsImageBlock | ManagedAgentsDocumentBlock | ManagedAgentsRedactedBlock;

export interface ManagedAgentsAgentThreadMessageReceivedEventContentUnionSource {
  data?: string;
  media_type?: string;
  type?: string;
  url?: string;
  file_id?: string;
}

export type ManagedAgentsAgentThreadMessageReceivedEventType = "agent.thread_message_received";

/**
 * Observability event emitted to the sender's output stream when an agent-to-agent
 * message is sent.
 */
export interface ManagedAgentsAgentThreadMessageSentEvent {
  /**
   * Unique identifier for this event.
   */
  id: string;
  /**
   * Message content blocks.
   */
  content: Array<ManagedAgentsAgentThreadMessageSentEventContentUnion>;
  /**
   * A timestamp in RFC 3339 format
   */
  processed_at: string;
  /**
   * Public `sthr_` ID of the thread the message was sent to.
   */
  to_session_thread_id: string;
  /**
   * Any of "agent.thread_message_sent".
   */
  type: ManagedAgentsAgentThreadMessageSentEventType;
  /**
   * Name of the callable agent this message was sent to. Absent when sent to the
   * primary agent.
   */
  to_agent_name?: string | null;
}

/**
 * ManagedAgentsAgentThreadMessageSentEventContentUnion contains all possible
 * properties and values from `ManagedAgentsTextBlock`,
 * `ManagedAgentsImageBlock`, `ManagedAgentsDocumentBlock`,
 * `ManagedAgentsRedactedBlock`.
 */
export type ManagedAgentsAgentThreadMessageSentEventContentUnion = ManagedAgentsTextBlock | ManagedAgentsImageBlock | ManagedAgentsDocumentBlock | ManagedAgentsRedactedBlock;

/**
 * ManagedAgentsAgentThreadMessageSentEventContentUnionSource is an implicit
 * subunion of `ManagedAgentsAgentThreadMessageSentEventContentUnion`.
 * ManagedAgentsAgentThreadMessageSentEventContentUnionSource provides
 * convenient access to the sub-properties of the union.
 */
export interface ManagedAgentsAgentThreadMessageSentEventContentUnionSource {
  data?: string;
  media_type?: string;
  type?: string;
  url?: string;
  file_id?: string;
}

export type ManagedAgentsAgentThreadMessageSentEventType = "agent.thread_message_sent";

/**
 * Event representing the result of an agent tool execution.
 */
export interface ManagedAgentsAgentToolResultEvent {
  /**
   * Unique identifier for this event.
   */
  id: string;
  /**
   * A timestamp in RFC 3339 format
   */
  processed_at: string;
  /**
   * The id of the `agent.tool_use` event this result corresponds to.
   */
  tool_use_id: string;
  /**
   * Any of "agent.tool_result".
   */
  type: ManagedAgentsAgentToolResultEventType;
  /**
   * The result content returned by the tool.
   */
  content?: Array<ManagedAgentsAgentToolResultEventContentUnion>;
  /**
   * Whether the tool execution resulted in an error.
   */
  is_error?: boolean | null;
}

export type ManagedAgentsAgentToolResultEventType = "agent.tool_result";

/**
 * ManagedAgentsAgentToolResultEventContentUnion contains all possible
 * properties and values from `ManagedAgentsTextBlock`,
 * `ManagedAgentsImageBlock`, `ManagedAgentsDocumentBlock`,
 * `ManagedAgentsSearchResultBlock`.
 */
export type ManagedAgentsAgentToolResultEventContentUnion = ManagedAgentsTextBlock | ManagedAgentsImageBlock | ManagedAgentsDocumentBlock | ManagedAgentsSearchResultBlock;

export type ManagedAgentsAgentToolResultEventContentUnionSource = string | {
  data?: string;
  media_type?: string;
  type?: string;
  url?: string;
  file_id?: string;
};

/**
 * Event emitted when the agent invokes a built-in agent tool.
 */
export interface ManagedAgentsAgentToolUseEvent {
  /**
   * Unique identifier for this event.
   */
  id: string;
  /**
   * Input parameters for the tool call.
   */
  input: Record<string, unknown>;
  /**
   * Name of the agent tool being used.
   */
  name: string;
  /**
   * A timestamp in RFC 3339 format
   */
  processed_at: string;
  /**
   * Any of "agent.tool_use".
   */
  type: ManagedAgentsAgentToolUseEventType;
  /**
   * AgentEvaluatedPermission enum
   *
   * Any of "allow", "ask", "deny".
   */
  evaluated_permission?: ManagedAgentsAgentToolUseEventEvaluatedPermission;
  /**
   * When set, this event was cross-posted from a subagent's thread to surface its
   * permission request on the primary thread's stream. Empty on the thread's own
   * events. Echo this on a `user.tool_confirmation` event to route the approval
   * back.
   */
  session_thread_id?: string | null;
}

export type ManagedAgentsAgentToolUseEventType = "agent.tool_use";

/**
 * AgentEvaluatedPermission enum
 */
export type ManagedAgentsAgentToolUseEventEvaluatedPermission = "allow" | "ask" | "deny";

/**
 * Base64-encoded document data.
 */
export interface ManagedAgentsBase64DocumentSource {
  /**
   * Base64-encoded document data.
   */
  data: string;
  /**
   * MIME type of the document (e.g., "application/pdf").
   */
  media_type: string;
  /**
   * Any of "base64".
   */
  type: ManagedAgentsBase64DocumentSourceType;
}

export type ManagedAgentsBase64DocumentSourceType = "base64";

/**
 * Base64-encoded document data.
 */
export interface ManagedAgentsBase64DocumentSourceParam {
  /**
   * Base64-encoded document data.
   */
  data: string;
  /**
   * MIME type of the document (e.g., "application/pdf").
   */
  media_type: string;
  /**
   * Any of "base64".
   */
  type: ManagedAgentsBase64DocumentSourceType;
}

/**
 * Base64-encoded image data.
 */
export interface ManagedAgentsBase64ImageSource {
  /**
   * Base64-encoded image data.
   */
  data: string;
  /**
   * MIME type of the image (e.g., "image/png", "image/jpeg", "image/gif",
   * "image/webp").
   */
  media_type: string;
  /**
   * Any of "base64".
   */
  type: ManagedAgentsBase64ImageSourceType;
}

export type ManagedAgentsBase64ImageSourceType = "base64";

/**
 * Base64-encoded image data.
 */
export interface ManagedAgentsBase64ImageSourceParam {
  /**
   * Base64-encoded image data.
   */
  data: string;
  /**
   * MIME type of the image (e.g., "image/png", "image/jpeg", "image/gif",
   * "image/webp").
   */
  media_type: string;
  /**
   * Any of "base64".
   */
  type: ManagedAgentsBase64ImageSourceType;
}

/**
 * The caller's organization or workspace cannot make model requests — out of
 * credits or spend limit reached. Retrying with the same credentials will not
 * succeed; the caller must resolve the billing state.
 */
export interface ManagedAgentsBillingError {
  /**
   * Human-readable error description.
   */
  message: string;
  /**
   * What the client should do next in response to this error.
   */
  retry_status: ManagedAgentsBillingErrorRetryStatusUnion;
  /**
   * Any of "billing_error".
   */
  type: ManagedAgentsBillingErrorType;
}

export type ManagedAgentsBillingErrorRetryStatusUnion = ManagedAgentsRetryStatusRetrying | ManagedAgentsRetryStatusExhausted | ManagedAgentsRetryStatusTerminal;

export type ManagedAgentsBillingErrorType = "billing_error";

/**
 * An `environment_variable` credential's `auth.networking.allowed_hosts` includes
 * a host the environment's network policy does not permit.
 */
export interface ManagedAgentsCredentialHostUnreachableError {
  /**
   * ID of the affected credential.
   */
  credential_id: string;
  /**
   * Human-readable error description.
   */
  message: string;
  /**
   * What the client should do next in response to this error.
   */
  retry_status: ManagedAgentsCredentialHostUnreachableErrorRetryStatusUnion;
  /**
   * Any of "credential_host_unreachable_error".
   */
  type: ManagedAgentsCredentialHostUnreachableErrorType;
  /**
   * ID of the vault containing the affected credential.
   */
  vault_id: string;
}

/**
 * ManagedAgentsCredentialHostUnreachableErrorRetryStatusUnion contains all
 * possible properties and values from `ManagedAgentsRetryStatusRetrying`,
 * `ManagedAgentsRetryStatusExhausted`, `ManagedAgentsRetryStatusTerminal`.
 */
export type ManagedAgentsCredentialHostUnreachableErrorRetryStatusUnion = ManagedAgentsRetryStatusRetrying | ManagedAgentsRetryStatusExhausted | ManagedAgentsRetryStatusTerminal;

export type ManagedAgentsCredentialHostUnreachableErrorType = "credential_host_unreachable_error";

/**
 * Document content, either specified directly as base64 data, as text, or as a
 * reference via a URL.
 */
export interface ManagedAgentsDocumentBlock {
  /**
   * Union type for document source variants.
   */
  source: ManagedAgentsDocumentBlockSourceUnion;
  /**
   * Any of "document".
   */
  type: ManagedAgentsDocumentBlockType;
  /**
   * Additional context about the document for the model.
   */
  context?: string | null;
  /**
   * The title of the document.
   */
  title?: string | null;
}

export type ManagedAgentsDocumentBlockSourceUnion = ManagedAgentsBase64DocumentSource | ManagedAgentsPlainTextDocumentSource | ManagedAgentsURLDocumentSource | ManagedAgentsFileDocumentSource;

export type ManagedAgentsDocumentBlockType = "document";

/**
 * Document content, either specified directly as base64 data, as text, or as a
 * reference via a URL.
 */
export interface ManagedAgentsDocumentBlockParam {
  /**
   * Union type for document source variants.
   */
  source: ManagedAgentsDocumentBlockSourceUnionParam;
  /**
   * Any of "document".
   */
  type: ManagedAgentsDocumentBlockType;
  /**
   * Additional context about the document for the model.
   */
  context?: string | null;
  /**
   * The title of the document.
   */
  title?: string | null;
}

export type ManagedAgentsDocumentBlockSourceUnionParam = ManagedAgentsBase64DocumentSourceParam | ManagedAgentsPlainTextDocumentSourceParam | ManagedAgentsURLDocumentSourceParam | ManagedAgentsFileDocumentSourceParam;

export type ManagedAgentsEventParamsUnion = ManagedAgentsUserMessageEventParams | ManagedAgentsUserInterruptEventParams | ManagedAgentsUserToolConfirmationEventParams | ManagedAgentsUserCustomToolResultEventParams | ManagedAgentsUserDefineOutcomeEventParams | ManagedAgentsUserToolResultEventParams | ManagedAgentsSystemMessageEventParams;

/**
 * Document referenced by file ID.
 */
export interface ManagedAgentsFileDocumentSource {
  /**
   * ID of a previously uploaded file.
   */
  file_id: string;
  /**
   * Any of "file".
   */
  type: ManagedAgentsFileDocumentSourceType;
}

export type ManagedAgentsFileDocumentSourceType = "file";

/**
 * Document referenced by file ID.
 */
export interface ManagedAgentsFileDocumentSourceParam {
  /**
   * ID of a previously uploaded file.
   */
  file_id: string;
  /**
   * Any of "file".
   */
  type: ManagedAgentsFileDocumentSourceType;
}

/**
 * Image referenced by file ID.
 */
export interface ManagedAgentsFileImageSource {
  /**
   * ID of a previously uploaded file.
   */
  file_id: string;
  /**
   * Any of "file".
   */
  type: ManagedAgentsFileImageSourceType;
}

export type ManagedAgentsFileImageSourceType = "file";

/**
 * Image referenced by file ID.
 */
export interface ManagedAgentsFileImageSourceParam {
  /**
   * ID of a previously uploaded file.
   */
  file_id: string;
  /**
   * Any of "file".
   */
  type: ManagedAgentsFileImageSourceType;
}

/**
 * Rubric referenced by a file uploaded via the Files API.
 */
export interface ManagedAgentsFileRubric {
  /**
   * ID of the rubric file.
   */
  file_id: string;
  /**
   * Any of "file".
   */
  type: ManagedAgentsFileRubricType;
}

export type ManagedAgentsFileRubricType = "file";

/**
 * Rubric referenced by a file uploaded via the Files API.
 */
export interface ManagedAgentsFileRubricParams {
  /**
   * ID of the rubric file.
   */
  file_id: string;
  /**
   * Any of "file".
   */
  type: ManagedAgentsFileRubricParamsType;
}

export type ManagedAgentsFileRubricParamsType = "file";

/**
 * Image content specified directly as base64 data or as a reference via a URL.
 */
export interface ManagedAgentsImageBlock {
  /**
   * Union type for image source variants.
   */
  source: ManagedAgentsImageBlockSourceUnion;
  /**
   * Any of "image".
   */
  type: ManagedAgentsImageBlockType;
}

export type ManagedAgentsImageBlockSourceUnion = ManagedAgentsBase64ImageSource | ManagedAgentsURLImageSource | ManagedAgentsFileImageSource;

export type ManagedAgentsImageBlockType = "image";

/**
 * Image content specified directly as base64 data or as a reference via a URL.
 */
export interface ManagedAgentsImageBlockParam {
  /**
   * Union type for image source variants.
   */
  source: ManagedAgentsImageBlockSourceUnionParam;
  /**
   * Any of "image".
   */
  type: ManagedAgentsImageBlockType;
}

export type ManagedAgentsImageBlockSourceUnionParam = ManagedAgentsBase64ImageSourceParam | ManagedAgentsURLImageSourceParam | ManagedAgentsFileImageSourceParam;

/**
 * Authentication to an MCP server failed.
 */
export interface ManagedAgentsMCPAuthenticationFailedError {
  /**
   * Name of the MCP server that failed authentication.
   */
  mcp_server_name: string;
  /**
   * Human-readable error description.
   */
  message: string;
  /**
   * What the client should do next in response to this error.
   */
  retry_status: ManagedAgentsMCPAuthenticationFailedErrorRetryStatusUnion;
  /**
   * Any of "mcp_authentication_failed_error".
   */
  type: ManagedAgentsMCPAuthenticationFailedErrorType;
}

/**
 * ManagedAgentsMCPAuthenticationFailedErrorRetryStatusUnion contains all
 * possible properties and values from `ManagedAgentsRetryStatusRetrying`,
 * `ManagedAgentsRetryStatusExhausted`, `ManagedAgentsRetryStatusTerminal`.
 */
export type ManagedAgentsMCPAuthenticationFailedErrorRetryStatusUnion = ManagedAgentsRetryStatusRetrying | ManagedAgentsRetryStatusExhausted | ManagedAgentsRetryStatusTerminal;

export type ManagedAgentsMCPAuthenticationFailedErrorType = "mcp_authentication_failed_error";

/**
 * Failed to connect to an MCP server.
 */
export interface ManagedAgentsMCPConnectionFailedError {
  /**
   * Name of the MCP server that failed to connect.
   */
  mcp_server_name: string;
  /**
   * Human-readable error description.
   */
  message: string;
  /**
   * What the client should do next in response to this error.
   */
  retry_status: ManagedAgentsMCPConnectionFailedErrorRetryStatusUnion;
  /**
   * Any of "mcp_connection_failed_error".
   */
  type: ManagedAgentsMCPConnectionFailedErrorType;
}

/**
 * ManagedAgentsMCPConnectionFailedErrorRetryStatusUnion contains all possible
 * properties and values from `ManagedAgentsRetryStatusRetrying`,
 * `ManagedAgentsRetryStatusExhausted`, `ManagedAgentsRetryStatusTerminal`.
 */
export type ManagedAgentsMCPConnectionFailedErrorRetryStatusUnion = ManagedAgentsRetryStatusRetrying | ManagedAgentsRetryStatusExhausted | ManagedAgentsRetryStatusTerminal;

export type ManagedAgentsMCPConnectionFailedErrorType = "mcp_connection_failed_error";

/**
 * The model is currently overloaded. Emitted after automatic retries are
 * exhausted.
 */
export interface ManagedAgentsModelOverloadedError {
  /**
   * Human-readable error description.
   */
  message: string;
  /**
   * What the client should do next in response to this error.
   */
  retry_status: ManagedAgentsModelOverloadedErrorRetryStatusUnion;
  /**
   * Any of "model_overloaded_error".
   */
  type: ManagedAgentsModelOverloadedErrorType;
}

/**
 * ManagedAgentsModelOverloadedErrorRetryStatusUnion contains all possible
 * properties and values from `ManagedAgentsRetryStatusRetrying`,
 * `ManagedAgentsRetryStatusExhausted`, `ManagedAgentsRetryStatusTerminal`.
 */
export type ManagedAgentsModelOverloadedErrorRetryStatusUnion = ManagedAgentsRetryStatusRetrying | ManagedAgentsRetryStatusExhausted | ManagedAgentsRetryStatusTerminal;

export type ManagedAgentsModelOverloadedErrorType = "model_overloaded_error";

/**
 * The model request was rate-limited.
 */
export interface ManagedAgentsModelRateLimitedError {
  /**
   * Human-readable error description.
   */
  message: string;
  /**
   * What the client should do next in response to this error.
   */
  retry_status: ManagedAgentsModelRateLimitedErrorRetryStatusUnion;
  /**
   * Any of "model_rate_limited_error".
   */
  type: ManagedAgentsModelRateLimitedErrorType;
}

/**
 * ManagedAgentsModelRateLimitedErrorRetryStatusUnion contains all possible
 * properties and values from `ManagedAgentsRetryStatusRetrying`,
 * `ManagedAgentsRetryStatusExhausted`, `ManagedAgentsRetryStatusTerminal`.
 */
export type ManagedAgentsModelRateLimitedErrorRetryStatusUnion = ManagedAgentsRetryStatusRetrying | ManagedAgentsRetryStatusExhausted | ManagedAgentsRetryStatusTerminal;

export type ManagedAgentsModelRateLimitedErrorType = "model_rate_limited_error";

/**
 * A model request failed for a reason other than overload or rate-limiting.
 */
export interface ManagedAgentsModelRequestFailedError {
  /**
   * Human-readable error description.
   */
  message: string;
  /**
   * What the client should do next in response to this error.
   */
  retry_status: ManagedAgentsModelRequestFailedErrorRetryStatusUnion;
  /**
   * Any of "model_request_failed_error".
   */
  type: ManagedAgentsModelRequestFailedErrorType;
}

/**
 * ManagedAgentsModelRequestFailedErrorRetryStatusUnion contains all possible
 * properties and values from `ManagedAgentsRetryStatusRetrying`,
 * `ManagedAgentsRetryStatusExhausted`, `ManagedAgentsRetryStatusTerminal`.
 */
export type ManagedAgentsModelRequestFailedErrorRetryStatusUnion = ManagedAgentsRetryStatusRetrying | ManagedAgentsRetryStatusExhausted | ManagedAgentsRetryStatusTerminal;

export type ManagedAgentsModelRequestFailedErrorType = "model_request_failed_error";

/**
 * Plain text document content.
 */
export interface ManagedAgentsPlainTextDocumentSource {
  /**
   * The plain text content.
   */
  data: string;
  /**
   * MIME type of the text content. Must be "text/plain".
   *
   * Any of "text/plain".
   */
  media_type: ManagedAgentsPlainTextDocumentSourceMediaType;
  /**
   * Any of "text".
   */
  type: ManagedAgentsPlainTextDocumentSourceType;
}

/**
 * MIME type of the text content. Must be "text/plain".
 */
export type ManagedAgentsPlainTextDocumentSourceMediaType = "text/plain";

export type ManagedAgentsPlainTextDocumentSourceType = "text";

/**
 * Plain text document content.
 */
export interface ManagedAgentsPlainTextDocumentSourceParam {
  /**
   * The plain text content.
   */
  data: string;
  /**
   * MIME type of the text content. Must be "text/plain".
   *
   * Any of "text/plain".
   */
  media_type: ManagedAgentsPlainTextDocumentSourceMediaType;
  /**
   * Any of "text".
   */
  type: ManagedAgentsPlainTextDocumentSourceType;
}

/**
 * Placeholder for content withheld by Qoder model policy.
 */
export interface ManagedAgentsRedactedBlock {
  /**
   * Any of "redacted".
   */
  type: ManagedAgentsRedactedBlockType;
}

export type ManagedAgentsRedactedBlockType = "redacted";

/**
 * Placeholder for content withheld by Qoder model policy.
 */
export interface ManagedAgentsRedactedBlockParam {
  /**
   * Any of "redacted".
   */
  type: ManagedAgentsRedactedBlockType;
}

/**
 * This turn is dead; queued inputs are flushed and the session returns to idle.
 * Client may send a new prompt.
 */
export interface ManagedAgentsRetryStatusExhausted {
  /**
   * Any of "exhausted".
   */
  type: ManagedAgentsRetryStatusExhaustedType;
}

export type ManagedAgentsRetryStatusExhaustedType = "exhausted";

/**
 * The server is retrying automatically. Client should wait; the same error type
 * may fire again as retrying, then once as exhausted when the retry budget runs
 * out.
 */
export interface ManagedAgentsRetryStatusRetrying {
  /**
   * Any of "retrying".
   */
  type: ManagedAgentsRetryStatusRetryingType;
}

export type ManagedAgentsRetryStatusRetryingType = "retrying";

/**
 * The session encountered a terminal error and will transition to `terminated`
 * state.
 */
export interface ManagedAgentsRetryStatusTerminal {
  /**
   * Any of "terminal".
   */
  type: ManagedAgentsRetryStatusTerminalType;
}

export type ManagedAgentsRetryStatusTerminalType = "terminal";

/**
 * A block containing a web search result.
 */
export interface ManagedAgentsSearchResultBlock {
  /**
   * Citation settings for a search result.
   */
  citations: ManagedAgentsSearchResultCitations;
  /**
   * Array of text content blocks from the search result.
   */
  content: Array<ManagedAgentsSearchResultContent>;
  /**
   * The URL source of the search result.
   */
  source: string;
  /**
   * The title of the search result.
   */
  title: string;
  /**
   * Any of "search_result".
   */
  type: ManagedAgentsSearchResultBlockType;
}

export type ManagedAgentsSearchResultBlockType = "search_result";

/**
 * A block containing a web search result.
 */
export interface ManagedAgentsSearchResultBlockParam {
  /**
   * Citation settings for a search result.
   */
  citations: ManagedAgentsSearchResultCitationsParam;
  /**
   * Array of text content blocks from the search result.
   */
  content: Array<ManagedAgentsSearchResultContentParam>;
  /**
   * The URL source of the search result.
   */
  source: string;
  /**
   * The title of the search result.
   */
  title: string;
  /**
   * Any of "search_result".
   */
  type: ManagedAgentsSearchResultBlockType;
}

/**
 * Citation settings for a search result.
 */
export interface ManagedAgentsSearchResultCitations {
  /**
   * Whether citations are enabled for this search result.
   */
  enabled: boolean;
}

/**
 * Citation settings for a search result.
 */
export interface ManagedAgentsSearchResultCitationsParam {
  /**
   * Whether citations are enabled for this search result.
   */
  enabled: boolean;
}

/**
 * Text content within a search result.
 */
export interface ManagedAgentsSearchResultContent {
  /**
   * The text content.
   */
  text: string;
  /**
   * Any of "text".
   */
  type: ManagedAgentsSearchResultContentType;
}

export type ManagedAgentsSearchResultContentType = "text";

/**
 * Text content within a search result.
 */
export interface ManagedAgentsSearchResultContentParam {
  /**
   * The text content.
   */
  text: string;
  /**
   * Any of "text".
   */
  type: ManagedAgentsSearchResultContentType;
}

/**
 * Events that were successfully sent to the session.
 */
export interface ManagedAgentsSendSessionEvents {
  /**
   * Sent events
   */
  data?: Array<ManagedAgentsSendSessionEventsDataUnion>;
}

export type ManagedAgentsSendSessionEventsDataUnion = ManagedAgentsUserMessageEvent | ManagedAgentsUserInterruptEvent | ManagedAgentsUserToolConfirmationEvent | ManagedAgentsUserCustomToolResultEvent | ManagedAgentsUserDefineOutcomeEvent | ManagedAgentsUserToolResultEvent | ManagedAgentsSystemMessageEvent;

export type ManagedAgentsSendSessionEventsDataUnionContent = Array<ManagedAgentsUserMessageEventContentUnion> | Array<ManagedAgentsUserCustomToolResultEventContentUnion> | Array<ManagedAgentsUserToolResultEventContentUnion> | Array<ManagedAgentsSystemContentBlock>;

/**
 * The agent stopped because the session's tracked list cost reached its budget, or
 * because its usage includes a model with no list price (which the budget cannot
 * measure). Raise the budget to continue — or, if raising is rejected because a
 * model has no list price, remove the budget.
 */
export interface ManagedAgentsSessionBudgetReached {
  /**
   * Any of "budget_reached".
   */
  type: ManagedAgentsSessionBudgetReachedType;
}

export type ManagedAgentsSessionBudgetReachedType = "budget_reached";

/**
 * Emitted when a session has been deleted. Terminates any active event stream — no
 * further events will be emitted for this session.
 */
export interface ManagedAgentsSessionDeletedEvent {
  /**
   * Unique identifier for this event.
   */
  id: string;
  /**
   * A timestamp in RFC 3339 format
   */
  processed_at: string;
  /**
   * Any of "session.deleted".
   */
  type: ManagedAgentsSessionDeletedEventType;
}

export type ManagedAgentsSessionDeletedEventType = "session.deleted";

/**
 * The agent completed its turn naturally and is ready for the next user message.
 */
export interface ManagedAgentsSessionEndTurn {
  /**
   * Any of "end_turn".
   */
  type: ManagedAgentsSessionEndTurnType;
}

export type ManagedAgentsSessionEndTurnType = "end_turn";

/**
 * An error event indicating a problem occurred during session execution.
 */
export interface ManagedAgentsSessionErrorEvent {
  /**
   * Unique identifier for this event.
   */
  id: string;
  /**
   * An unknown or unexpected error occurred during session execution. A fallback
   * variant; clients that don't recognize a new error code can match on
   * `retry_status` and `message` alone.
   */
  error: ManagedAgentsSessionErrorEventErrorUnion;
  /**
   * A timestamp in RFC 3339 format
   */
  processed_at: string;
  /**
   * Any of "session.error".
   */
  type: ManagedAgentsSessionErrorEventType;
}

export type ManagedAgentsSessionErrorEventErrorUnion = ManagedAgentsUnknownError | ManagedAgentsModelOverloadedError | ManagedAgentsModelRateLimitedError | ManagedAgentsModelRequestFailedError | ManagedAgentsMCPConnectionFailedError | ManagedAgentsMCPAuthenticationFailedError | ManagedAgentsBillingError | ManagedAgentsCredentialHostUnreachableError;

export interface ManagedAgentsSessionErrorEventErrorUnionRetryStatus {
  type?: string;
}

export type ManagedAgentsSessionErrorEventType = "session.error";

export type ManagedAgentsSessionEventUnion = ManagedAgentsUserMessageEvent | ManagedAgentsUserInterruptEvent | ManagedAgentsUserToolConfirmationEvent | ManagedAgentsUserCustomToolResultEvent | ManagedAgentsAgentCustomToolUseEvent | ManagedAgentsAgentMessageEvent | ManagedAgentsAgentThinkingEvent | ManagedAgentsAgentMCPToolUseEvent | ManagedAgentsAgentMCPToolResultEvent | ManagedAgentsAgentToolUseEvent | ManagedAgentsAgentToolResultEvent | ManagedAgentsAgentThreadMessageReceivedEvent | ManagedAgentsAgentThreadMessageSentEvent | ManagedAgentsAgentThreadContextCompactedEvent | ManagedAgentsSessionErrorEvent | ManagedAgentsSessionStatusRescheduledEvent | ManagedAgentsSessionStatusRunningEvent | ManagedAgentsSessionStatusIdleEvent | ManagedAgentsSessionStatusTerminatedEvent | ManagedAgentsSessionThreadCreatedEvent | ManagedAgentsSpanOutcomeEvaluationStartEvent | ManagedAgentsSpanOutcomeEvaluationEndEvent | ManagedAgentsSpanModelRequestStartEvent | ManagedAgentsSpanModelRequestEndEvent | ManagedAgentsSpanOutcomeEvaluationOngoingEvent | ManagedAgentsUserDefineOutcomeEvent | ManagedAgentsSessionDeletedEvent | ManagedAgentsSessionThreadStatusRunningEvent | ManagedAgentsSessionThreadStatusIdleEvent | ManagedAgentsSessionThreadStatusTerminatedEvent | ManagedAgentsUserToolResultEvent | ManagedAgentsSessionThreadStatusRescheduledEvent | ManagedAgentsSessionUpdatedEvent | ManagedAgentsSystemMessageEvent | ManagedAgentsSessionUsageEvent;

export type ManagedAgentsSessionEventUnionContent = Array<ManagedAgentsUserMessageEventContentUnion> | Array<ManagedAgentsUserCustomToolResultEventContentUnion> | Array<ManagedAgentsAgentMessageEventContentUnion> | Array<ManagedAgentsAgentMCPToolResultEventContentUnion> | Array<ManagedAgentsAgentToolResultEventContentUnion> | Array<ManagedAgentsAgentThreadMessageReceivedEventContentUnion> | Array<ManagedAgentsAgentThreadMessageSentEventContentUnion> | Array<ManagedAgentsUserToolResultEventContentUnion> | Array<ManagedAgentsSystemContentBlock>;

export interface ManagedAgentsSessionEventUnionStopReason {
  type?: string;
  /**
   * This field is from variant
   * `ManagedAgentsSessionStatusIdleEventStopReasonUnion`,
   * `ManagedAgentsSessionThreadStatusIdleEventStopReasonUnion`.
   */
  event_ids?: Array<string>;
}

export interface ManagedAgentsSessionEventUnionUsage {
  /**
   * This field is from variant `ManagedAgentsSpanModelUsage`.
   */
  cache_creation_input_tokens?: number;
  cache_read_input_tokens?: number;
  input_tokens?: number;
  output_tokens?: number;
  /**
   * This field is from variant `ManagedAgentsSpanModelUsage`.
   */
  speed?: ManagedAgentsSpanModelUsageSpeed;
  /**
   * This field is from variant `ManagedAgentsSessionUsageSnapshot`.
   */
  active_seconds?: number;
  /**
   * This field is from variant `ManagedAgentsSessionUsageSnapshot`.
   */
  cache_creation?: ManagedAgentsCacheCreationUsage;
  /**
   * This field is from variant `ManagedAgentsSessionUsageSnapshot`.
   */
  list_cost?: MonetaryAmount;
  /**
   * This field is from variant `ManagedAgentsSessionUsageSnapshot`.
   */
  server_tool_use?: ManagedAgentsServerToolUsage;
}

/**
 * The agent is idle waiting on one or more blocking user-input events (tool
 * confirmation, custom tool result, etc.). Resolving all of them transitions the
 * session back to running.
 */
export interface ManagedAgentsSessionRequiresAction {
  /**
   * The ids of events the agent is blocked on. Resolving fewer than all re-emits
   * `session.status_idle` with the remainder.
   */
  event_ids: Array<string>;
  /**
   * Any of "requires_action".
   */
  type: ManagedAgentsSessionRequiresActionType;
}

export type ManagedAgentsSessionRequiresActionType = "requires_action";

/**
 * The turn ended because repeated errors exhausted the retry budget or an error
 * escalated to `retry_status: 'exhausted'`.
 */
export interface ManagedAgentsSessionRetriesExhausted {
  /**
   * Any of "retries_exhausted".
   */
  type: ManagedAgentsSessionRetriesExhaustedType;
}

export type ManagedAgentsSessionRetriesExhaustedType = "retries_exhausted";

/**
 * Indicates the agent has paused and is awaiting user input.
 */
export interface ManagedAgentsSessionStatusIdleEvent {
  /**
   * Unique identifier for this event.
   */
  id: string;
  /**
   * A timestamp in RFC 3339 format
   */
  processed_at: string;
  /**
   * The agent completed its turn naturally and is ready for the next user message.
   */
  stop_reason: ManagedAgentsSessionStatusIdleEventStopReasonUnion;
  /**
   * Any of "session.status_idle".
   */
  type: ManagedAgentsSessionStatusIdleEventType;
}

/**
 * ManagedAgentsSessionStatusIdleEventStopReasonUnion contains all possible
 * properties and values from `ManagedAgentsSessionEndTurn`,
 * `ManagedAgentsSessionRequiresAction`,
 * `ManagedAgentsSessionRetriesExhausted`,
 * `ManagedAgentsSessionBudgetReached`.
 */
export type ManagedAgentsSessionStatusIdleEventStopReasonUnion = ManagedAgentsSessionEndTurn | ManagedAgentsSessionRequiresAction | ManagedAgentsSessionRetriesExhausted | ManagedAgentsSessionBudgetReached;

export type ManagedAgentsSessionStatusIdleEventType = "session.status_idle";

/**
 * Indicates the session is recovering from an error state and is rescheduled for
 * execution.
 */
export interface ManagedAgentsSessionStatusRescheduledEvent {
  /**
   * Unique identifier for this event.
   */
  id: string;
  /**
   * A timestamp in RFC 3339 format
   */
  processed_at: string;
  /**
   * Any of "session.status_rescheduled".
   */
  type: ManagedAgentsSessionStatusRescheduledEventType;
}

export type ManagedAgentsSessionStatusRescheduledEventType = "session.status_rescheduled";

/**
 * Indicates the session is actively running and the agent is working.
 */
export interface ManagedAgentsSessionStatusRunningEvent {
  /**
   * Unique identifier for this event.
   */
  id: string;
  /**
   * A timestamp in RFC 3339 format
   */
  processed_at: string;
  /**
   * Any of "session.status_running".
   */
  type: ManagedAgentsSessionStatusRunningEventType;
}

export type ManagedAgentsSessionStatusRunningEventType = "session.status_running";

/**
 * Indicates the session has terminated, either due to an error or completion.
 */
export interface ManagedAgentsSessionStatusTerminatedEvent {
  /**
   * Unique identifier for this event.
   */
  id: string;
  /**
   * A timestamp in RFC 3339 format
   */
  processed_at: string;
  /**
   * Any of "session.status_terminated".
   */
  type: ManagedAgentsSessionStatusTerminatedEventType;
}

export type ManagedAgentsSessionStatusTerminatedEventType = "session.status_terminated";

/**
 * Emitted when a subagent is spawned as a new thread. Written to the parent
 * thread's output stream so clients observing the session see child creation.
 */
export interface ManagedAgentsSessionThreadCreatedEvent {
  /**
   * Unique identifier for this event.
   */
  id: string;
  /**
   * Name of the callable agent the thread runs.
   */
  agent_name: string;
  /**
   * A timestamp in RFC 3339 format
   */
  processed_at: string;
  /**
   * Public `sthr_` ID of the newly created thread.
   */
  session_thread_id: string;
  /**
   * Any of "session.thread_created".
   */
  type: ManagedAgentsSessionThreadCreatedEventType;
}

export type ManagedAgentsSessionThreadCreatedEventType = "session.thread_created";

/**
 * A session thread has yielded and is awaiting input. Emitted on the thread's own
 * stream and cross-posted to the primary stream for child threads.
 */
export interface ManagedAgentsSessionThreadStatusIdleEvent {
  /**
   * Unique identifier for this event.
   */
  id: string;
  /**
   * Name of the agent the thread runs.
   */
  agent_name: string;
  /**
   * A timestamp in RFC 3339 format
   */
  processed_at: string;
  /**
   * Public sthr\_ ID of the thread that went idle.
   */
  session_thread_id: string;
  /**
   * The agent completed its turn naturally and is ready for the next user message.
   */
  stop_reason: ManagedAgentsSessionThreadStatusIdleEventStopReasonUnion;
  /**
   * Any of "session.thread_status_idle".
   */
  type: ManagedAgentsSessionThreadStatusIdleEventType;
}

/**
 * ManagedAgentsSessionThreadStatusIdleEventStopReasonUnion contains all
 * possible properties and values from `ManagedAgentsSessionEndTurn`,
 * `ManagedAgentsSessionRequiresAction`,
 * `ManagedAgentsSessionRetriesExhausted`,
 * `ManagedAgentsSessionBudgetReached`.
 */
export type ManagedAgentsSessionThreadStatusIdleEventStopReasonUnion = ManagedAgentsSessionEndTurn | ManagedAgentsSessionRequiresAction | ManagedAgentsSessionRetriesExhausted | ManagedAgentsSessionBudgetReached;

export type ManagedAgentsSessionThreadStatusIdleEventType = "session.thread_status_idle";

/**
 * A session thread hit a transient error and is retrying automatically. Emitted on
 * the thread's own stream and cross-posted to the primary stream for child
 * threads.
 */
export interface ManagedAgentsSessionThreadStatusRescheduledEvent {
  /**
   * Unique identifier for this event.
   */
  id: string;
  /**
   * Name of the agent the thread runs.
   */
  agent_name: string;
  /**
   * A timestamp in RFC 3339 format
   */
  processed_at: string;
  /**
   * Public sthr\_ ID of the thread that is retrying.
   */
  session_thread_id: string;
  /**
   * Any of "session.thread_status_rescheduled".
   */
  type: ManagedAgentsSessionThreadStatusRescheduledEventType;
}

export type ManagedAgentsSessionThreadStatusRescheduledEventType = "session.thread_status_rescheduled";

/**
 * A session thread has begun executing. Emitted on the thread's own stream and
 * cross-posted to the primary stream for child threads.
 */
export interface ManagedAgentsSessionThreadStatusRunningEvent {
  /**
   * Unique identifier for this event.
   */
  id: string;
  /**
   * Name of the agent the thread runs.
   */
  agent_name: string;
  /**
   * A timestamp in RFC 3339 format
   */
  processed_at: string;
  /**
   * Public sthr\_ ID of the thread that started running.
   */
  session_thread_id: string;
  /**
   * Any of "session.thread_status_running".
   */
  type: ManagedAgentsSessionThreadStatusRunningEventType;
}

export type ManagedAgentsSessionThreadStatusRunningEventType = "session.thread_status_running";

/**
 * A session thread has terminated and will accept no further input. Emitted on the
 * thread's own stream and cross-posted to the primary stream for child threads.
 */
export interface ManagedAgentsSessionThreadStatusTerminatedEvent {
  /**
   * Unique identifier for this event.
   */
  id: string;
  /**
   * Name of the agent the thread runs.
   */
  agent_name: string;
  /**
   * A timestamp in RFC 3339 format
   */
  processed_at: string;
  /**
   * Public sthr\_ ID of the thread that terminated.
   */
  session_thread_id: string;
  /**
   * Any of "session.thread_status_terminated".
   */
  type: ManagedAgentsSessionThreadStatusTerminatedEventType;
}

export type ManagedAgentsSessionThreadStatusTerminatedEventType = "session.thread_status_terminated";

/**
 * Point-in-time snapshot of a session's cumulative usage.
 */
export interface ManagedAgentsSessionUsageSnapshot {
  /**
   * Cumulative time in seconds during which the session had at least one thread in
   * running status. Overlapping activity from concurrent threads is counted once.
   * This is the duration the session's runtime cost is priced on.
   */
  active_seconds?: number;
  /**
   * Prompt-cache creation token usage broken down by cache lifetime.
   */
  cache_creation?: ManagedAgentsCacheCreationUsage;
  /**
   * Total tokens read from prompt cache.
   */
  cache_read_input_tokens?: number;
  /**
   * Total input tokens consumed across all turns.
   */
  input_tokens?: number;
  /**
   * A monetary amount in a specific currency.
   */
  list_cost?: MonetaryAmount;
  /**
   * Total output tokens generated across all turns.
   */
  output_tokens?: number;
  /**
   * Cumulative count of server-executed tool invocations, broken down by tool.
   */
  server_tool_use?: ManagedAgentsServerToolUsage;
}

/**
 * Emitted when a model request completes.
 */
export interface ManagedAgentsSpanModelRequestEndEvent {
  /**
   * Unique identifier for this event.
   */
  id: string;
  /**
   * Whether the model request resulted in an error.
   */
  is_error: boolean;
  /**
   * The id of the corresponding `span.model_request_start` event.
   */
  model_request_start_id: string;
  /**
   * Token usage for a single model request.
   */
  model_usage: ManagedAgentsSpanModelUsage;
  /**
   * A timestamp in RFC 3339 format
   */
  processed_at: string;
  /**
   * Any of "span.model_request_end".
   */
  type: ManagedAgentsSpanModelRequestEndEventType;
}

export type ManagedAgentsSpanModelRequestEndEventType = "span.model_request_end";

/**
 * Emitted when a model request is initiated by the agent.
 */
export interface ManagedAgentsSpanModelRequestStartEvent {
  /**
   * Unique identifier for this event.
   */
  id: string;
  /**
   * A timestamp in RFC 3339 format
   */
  processed_at: string;
  /**
   * Any of "span.model_request_start".
   */
  type: ManagedAgentsSpanModelRequestStartEventType;
}

export type ManagedAgentsSpanModelRequestStartEventType = "span.model_request_start";

/**
 * Token usage for a single model request.
 */
export interface ManagedAgentsSpanModelUsage {
  /**
   * Tokens used to create prompt cache in this request.
   */
  cache_creation_input_tokens: number;
  /**
   * Tokens read from prompt cache in this request.
   */
  cache_read_input_tokens: number;
  /**
   * Input tokens consumed by this request.
   */
  input_tokens: number;
  /**
   * Output tokens generated by this request.
   */
  output_tokens: number;
  /**
   * Inference speed mode. `fast` provides significantly faster output token
   * generation at premium pricing. Not all models support `fast`; invalid
   * combinations are rejected at create time.
   *
   * Any of "standard", "fast".
   */
  speed?: ManagedAgentsSpanModelUsageSpeed | null;
}

/**
 * Inference speed mode. `fast` provides significantly faster output token
 * generation at premium pricing. Not all models support `fast`; invalid
 * combinations are rejected at create time.
 */
export type ManagedAgentsSpanModelUsageSpeed = "standard" | "fast";

/**
 * Emitted when an outcome evaluation cycle completes. Carries the verdict and
 * aggregate token usage. A verdict of `needs_revision` means another evaluation
 * cycle follows; `satisfied`, `max_iterations_reached`, `failed`, or `interrupted`
 * are terminal — no further evaluation cycles follow.
 */
export interface ManagedAgentsSpanOutcomeEvaluationEndEvent {
  /**
   * Unique identifier for this event.
   */
  id: string;
  /**
   * Human-readable explanation of the verdict. For `needs_revision`, describes which
   * criteria failed and why.
   */
  explanation: string;
  /**
   * 0-indexed revision cycle, matching the corresponding
   * `span.outcome_evaluation_start`.
   */
  iteration: number;
  /**
   * The id of the corresponding `span.outcome_evaluation_start` event.
   */
  outcome_evaluation_start_id: string;
  /**
   * The `outc_` ID of the outcome being evaluated.
   */
  outcome_id: string;
  /**
   * A timestamp in RFC 3339 format
   */
  processed_at: string;
  /**
   * Evaluation verdict. 'satisfied': criteria met, session goes idle.
   * 'needs_revision': criteria not met, another revision cycle follows.
   * 'max_iterations_reached': evaluation budget exhausted with criteria still unmet
   * — one final acknowledgment turn follows before the session goes idle, but no
   * further evaluation runs. 'failed': grader determined the rubric does not apply
   * to the deliverables. 'interrupted': user sent an interrupt while evaluation was
   * in progress.
   */
  result: string;
  /**
   * Any of "span.outcome_evaluation_end".
   */
  type: ManagedAgentsSpanOutcomeEvaluationEndEventType;
  /**
   * Token usage for a single model request.
   */
  usage: ManagedAgentsSpanModelUsage;
}

export type ManagedAgentsSpanOutcomeEvaluationEndEventType = "span.outcome_evaluation_end";

/**
 * Periodic heartbeat emitted while an outcome evaluation cycle is in progress.
 * Distinguishes 'evaluation is actively running' from 'evaluation is stuck'
 * between the corresponding `span.outcome_evaluation_start` and
 * `span.outcome_evaluation_end` events.
 */
export interface ManagedAgentsSpanOutcomeEvaluationOngoingEvent {
  /**
   * Unique identifier for this event.
   */
  id: string;
  /**
   * 0-indexed revision cycle, matching the corresponding
   * `span.outcome_evaluation_start`.
   */
  iteration: number;
  /**
   * The `outc_` ID of the outcome being evaluated.
   */
  outcome_id: string;
  /**
   * A timestamp in RFC 3339 format
   */
  processed_at: string;
  /**
   * Any of "span.outcome_evaluation_ongoing".
   */
  type: ManagedAgentsSpanOutcomeEvaluationOngoingEventType;
}

export type ManagedAgentsSpanOutcomeEvaluationOngoingEventType = "span.outcome_evaluation_ongoing";

/**
 * Emitted when an outcome evaluation cycle begins.
 */
export interface ManagedAgentsSpanOutcomeEvaluationStartEvent {
  /**
   * Unique identifier for this event.
   */
  id: string;
  /**
   * 0-indexed revision cycle. 0 is the first evaluation; 1 is the re-evaluation
   * after the first revision; etc.
   */
  iteration: number;
  /**
   * The `outc_` ID of the outcome being evaluated.
   */
  outcome_id: string;
  /**
   * A timestamp in RFC 3339 format
   */
  processed_at: string;
  /**
   * Any of "span.outcome_evaluation_start".
   */
  type: ManagedAgentsSpanOutcomeEvaluationStartEventType;
}

export type ManagedAgentsSpanOutcomeEvaluationStartEventType = "span.outcome_evaluation_start";

export type ManagedAgentsStreamSessionEventsUnion = ManagedAgentsUserMessageEvent | ManagedAgentsUserInterruptEvent | ManagedAgentsUserToolConfirmationEvent | ManagedAgentsUserCustomToolResultEvent | ManagedAgentsAgentCustomToolUseEvent | ManagedAgentsAgentMessageEvent | ManagedAgentsAgentThinkingEvent | ManagedAgentsAgentMCPToolUseEvent | ManagedAgentsAgentMCPToolResultEvent | ManagedAgentsAgentToolUseEvent | ManagedAgentsAgentToolResultEvent | ManagedAgentsAgentThreadMessageReceivedEvent | ManagedAgentsAgentThreadMessageSentEvent | ManagedAgentsAgentThreadContextCompactedEvent | ManagedAgentsSessionErrorEvent | ManagedAgentsSessionStatusRescheduledEvent | ManagedAgentsSessionStatusRunningEvent | ManagedAgentsSessionStatusIdleEvent | ManagedAgentsSessionStatusTerminatedEvent | ManagedAgentsSessionThreadCreatedEvent | ManagedAgentsSpanOutcomeEvaluationStartEvent | ManagedAgentsSpanOutcomeEvaluationEndEvent | ManagedAgentsSpanModelRequestStartEvent | ManagedAgentsSpanModelRequestEndEvent | ManagedAgentsSpanOutcomeEvaluationOngoingEvent | ManagedAgentsUserDefineOutcomeEvent | ManagedAgentsSessionDeletedEvent | ManagedAgentsSessionThreadStatusRunningEvent | ManagedAgentsSessionThreadStatusIdleEvent | ManagedAgentsSessionThreadStatusTerminatedEvent | ManagedAgentsUserToolResultEvent | ManagedAgentsSessionThreadStatusRescheduledEvent | ManagedAgentsSessionUpdatedEvent | ManagedAgentsStartEvent | ManagedAgentsDeltaEvent | ManagedAgentsSystemMessageEvent | ManagedAgentsSessionUsageEvent;

export type ManagedAgentsStreamSessionEventsUnionContent = Array<ManagedAgentsUserMessageEventContentUnion> | Array<ManagedAgentsUserCustomToolResultEventContentUnion> | Array<ManagedAgentsAgentMessageEventContentUnion> | Array<ManagedAgentsAgentMCPToolResultEventContentUnion> | Array<ManagedAgentsAgentToolResultEventContentUnion> | Array<ManagedAgentsAgentThreadMessageReceivedEventContentUnion> | Array<ManagedAgentsAgentThreadMessageSentEventContentUnion> | Array<ManagedAgentsUserToolResultEventContentUnion> | Array<ManagedAgentsSystemContentBlock>;

export interface ManagedAgentsStreamSessionEventsUnionStopReason {
  type?: string;
  /**
   * This field is from variant
   * `ManagedAgentsSessionStatusIdleEventStopReasonUnion`,
   * `ManagedAgentsSessionThreadStatusIdleEventStopReasonUnion`.
   */
  event_ids?: Array<string>;
}

export interface ManagedAgentsStreamSessionEventsUnionUsage {
  /**
   * This field is from variant `ManagedAgentsSpanModelUsage`.
   */
  cache_creation_input_tokens?: number;
  cache_read_input_tokens?: number;
  input_tokens?: number;
  output_tokens?: number;
  /**
   * This field is from variant `ManagedAgentsSpanModelUsage`.
   */
  speed?: ManagedAgentsSpanModelUsageSpeed;
  /**
   * This field is from variant `ManagedAgentsSessionUsageSnapshot`.
   */
  active_seconds?: number;
  /**
   * This field is from variant `ManagedAgentsSessionUsageSnapshot`.
   */
  cache_creation?: ManagedAgentsCacheCreationUsage;
  /**
   * This field is from variant `ManagedAgentsSessionUsageSnapshot`.
   */
  list_cost?: MonetaryAmount;
  /**
   * This field is from variant `ManagedAgentsSessionUsageSnapshot`.
   */
  server_tool_use?: ManagedAgentsServerToolUsage;
}

/**
 * Privileged context for the accompanying turn and all subsequent turns, appended
 * to the session's system context as a `role: "system"` turn rather than replacing
 * the top-level system prompt. At most one per request: it must be the final event
 * and immediately follow the `user.message`, `user.tool_result`, or
 * `user.custom_tool_result` it accompanies. Only supported on models that accept
 * mid-conversation system messages.
 */
export interface ManagedAgentsSystemMessageEventParams {
  /**
   * System content blocks to append. Text-only.
   */
  content: Array<ManagedAgentsSystemContentBlockParam>;
  /**
   * Any of "system.message".
   */
  type: ManagedAgentsSystemMessageEventParamsType;
}

export type ManagedAgentsSystemMessageEventParamsType = "system.message";

/**
 * Regular text content.
 */
export interface ManagedAgentsTextBlock {
  /**
   * The text content.
   */
  text: string;
  /**
   * Any of "text".
   */
  type: ManagedAgentsTextBlockType;
}

export type ManagedAgentsTextBlockType = "text";

/**
 * Regular text content.
 */
export interface ManagedAgentsTextBlockParam {
  /**
   * The text content.
   */
  text: string;
  /**
   * Any of "text".
   */
  type: ManagedAgentsTextBlockType;
}

/**
 * Rubric content provided inline as text.
 */
export interface ManagedAgentsTextRubric {
  /**
   * Rubric content. Plain text or markdown — the grader treats it as freeform text.
   */
  content: string;
  /**
   * Any of "text".
   */
  type: ManagedAgentsTextRubricType;
}

export type ManagedAgentsTextRubricType = "text";

/**
 * Rubric content provided inline as text.
 */
export interface ManagedAgentsTextRubricParams {
  /**
   * Rubric content. Plain text or markdown — the grader treats it as freeform text.
   * Maximum 262144 characters.
   */
  content: string;
  /**
   * Any of "text".
   */
  type: ManagedAgentsTextRubricParamsType;
}

export type ManagedAgentsTextRubricParamsType = "text";

/**
 * An unknown or unexpected error occurred during session execution. A fallback
 * variant; clients that don't recognize a new error code can match on
 * `retry_status` and `message` alone.
 */
export interface ManagedAgentsUnknownError {
  /**
   * Human-readable error description.
   */
  message: string;
  /**
   * What the client should do next in response to this error.
   */
  retry_status: ManagedAgentsUnknownErrorRetryStatusUnion;
  /**
   * Any of "unknown_error".
   */
  type: ManagedAgentsUnknownErrorType;
}

export type ManagedAgentsUnknownErrorRetryStatusUnion = ManagedAgentsRetryStatusRetrying | ManagedAgentsRetryStatusExhausted | ManagedAgentsRetryStatusTerminal;

export type ManagedAgentsUnknownErrorType = "unknown_error";

/**
 * Document referenced by URL.
 */
export interface ManagedAgentsURLDocumentSource {
  /**
   * Any of "url".
   */
  type: ManagedAgentsURLDocumentSourceType;
  /**
   * URL of the document to fetch.
   */
  url: string;
}

export type ManagedAgentsURLDocumentSourceType = "url";

/**
 * Document referenced by URL.
 */
export interface ManagedAgentsURLDocumentSourceParam {
  /**
   * Any of "url".
   */
  type: ManagedAgentsURLDocumentSourceType;
  /**
   * URL of the document to fetch.
   */
  url: string;
}

/**
 * Image referenced by URL.
 */
export interface ManagedAgentsURLImageSource {
  /**
   * Any of "url".
   */
  type: ManagedAgentsURLImageSourceType;
  /**
   * URL of the image to fetch.
   */
  url: string;
}

export type ManagedAgentsURLImageSourceType = "url";

/**
 * Image referenced by URL.
 */
export interface ManagedAgentsURLImageSourceParam {
  /**
   * Any of "url".
   */
  type: ManagedAgentsURLImageSourceType;
  /**
   * URL of the image to fetch.
   */
  url: string;
}

/**
 * Event sent by the client providing the result of a custom tool execution.
 */
export interface ManagedAgentsUserCustomToolResultEvent {
  /**
   * Unique identifier for this event.
   */
  id: string;
  /**
   * The id of the `agent.custom_tool_use` event this result corresponds to, which
   * can be found in the last `session.status_idle`
   * [event's](https://docs.qoder.com/cloud-agents/api/sessions/schemas)
   * `stop_reason.event_ids` field.
   */
  custom_tool_use_id: string;
  /**
   * Any of "user.custom_tool_result".
   */
  type: ManagedAgentsUserCustomToolResultEventType;
  /**
   * The result content returned by the tool.
   */
  content?: Array<ManagedAgentsUserCustomToolResultEventContentUnion>;
  /**
   * Whether the tool execution resulted in an error.
   */
  is_error?: boolean | null;
  /**
   * A timestamp in RFC 3339 format
   */
  processed_at?: string | null;
  /**
   * Routes this result to a subagent thread. Copy from the `agent.custom_tool_use`
   * event's `session_thread_id`.
   */
  session_thread_id?: string | null;
}

export type ManagedAgentsUserCustomToolResultEventType = "user.custom_tool_result";

/**
 * ManagedAgentsUserCustomToolResultEventContentUnion contains all possible
 * properties and values from `ManagedAgentsTextBlock`,
 * `ManagedAgentsImageBlock`, `ManagedAgentsDocumentBlock`,
 * `ManagedAgentsSearchResultBlock`.
 */
export type ManagedAgentsUserCustomToolResultEventContentUnion = ManagedAgentsTextBlock | ManagedAgentsImageBlock | ManagedAgentsDocumentBlock | ManagedAgentsSearchResultBlock;

/**
 * ManagedAgentsUserCustomToolResultEventContentUnionSource is an implicit
 * subunion of `ManagedAgentsUserCustomToolResultEventContentUnion`.
 * ManagedAgentsUserCustomToolResultEventContentUnionSource provides convenient
 * access to the sub-properties of the union.
 */
export type ManagedAgentsUserCustomToolResultEventContentUnionSource = string | {
  data?: string;
  media_type?: string;
  type?: string;
  url?: string;
  file_id?: string;
};

/**
 * Parameters for providing the result of a custom tool execution.
 */
export interface ManagedAgentsUserCustomToolResultEventParams {
  /**
   * The id of the `agent.custom_tool_use` event this result corresponds to, which
   * can be found in the last `session.status_idle`
   * [event's](https://docs.qoder.com/cloud-agents/api/sessions/schemas)
   * `stop_reason.event_ids` field.
   */
  custom_tool_use_id: string;
  /**
   * Any of "user.custom_tool_result".
   */
  type: ManagedAgentsUserCustomToolResultEventParamsType;
  /**
   * Whether the tool execution resulted in an error.
   */
  is_error?: boolean | null;
  /**
   * The result content returned by the tool.
   */
  content?: Array<ManagedAgentsUserCustomToolResultEventParamsContentUnion> | null;
}

export type ManagedAgentsUserCustomToolResultEventParamsType = "user.custom_tool_result";

export type ManagedAgentsUserCustomToolResultEventParamsContentUnion = ManagedAgentsTextBlockParam | ManagedAgentsImageBlockParam | ManagedAgentsDocumentBlockParam | ManagedAgentsSearchResultBlockParam;

/**
 * Echo of a `user.define_outcome` input event. Carries the server-generated
 * `outcome_id` that subsequent `span.outcome_evaluation_*` events reference.
 */
export interface ManagedAgentsUserDefineOutcomeEvent {
  /**
   * Unique identifier for this event.
   */
  id: string;
  /**
   * What the agent should produce. Copied from the input event.
   */
  description: string;
  /**
   * Evaluate-then-revise cycles before giving up. Default 3, max 20.
   */
  max_iterations: number;
  /**
   * Server-generated `outc_` ID for this outcome. Referenced by
   * `span.outcome_evaluation_*` events and the session's `outcome_evaluations` list.
   */
  outcome_id: string;
  /**
   * A timestamp in RFC 3339 format
   */
  processed_at: string;
  /**
   * Rubric for grading the quality of an outcome.
   */
  rubric: ManagedAgentsUserDefineOutcomeEventRubricUnion;
  /**
   * Any of "user.define_outcome".
   */
  type: ManagedAgentsUserDefineOutcomeEventType;
}

/**
 * ManagedAgentsUserDefineOutcomeEventRubricUnion contains all possible
 * properties and values from `ManagedAgentsFileRubric`,
 * `ManagedAgentsTextRubric`.
 */
export type ManagedAgentsUserDefineOutcomeEventRubricUnion = ManagedAgentsFileRubric | ManagedAgentsTextRubric;

export type ManagedAgentsUserDefineOutcomeEventType = "user.define_outcome";

/**
 * Parameters for defining an outcome the agent should work toward. The agent
 * begins work on receipt.
 */
export interface ManagedAgentsUserDefineOutcomeEventParams {
  /**
   * What the agent should produce. This is the task specification.
   */
  description: string;
  /**
   * Rubric for grading the quality of an outcome.
   */
  rubric: ManagedAgentsUserDefineOutcomeEventParamsRubricUnion;
  /**
   * Any of "user.define_outcome".
   */
  type: ManagedAgentsUserDefineOutcomeEventParamsType;
  /**
   * Eval→revision cycles before giving up. Default 3, max 20.
   */
  max_iterations?: number | null;
}

export type ManagedAgentsUserDefineOutcomeEventParamsRubricUnion = ManagedAgentsFileRubricParams | ManagedAgentsTextRubricParams;

export type ManagedAgentsUserDefineOutcomeEventParamsType = "user.define_outcome";

/**
 * An interrupt event that pauses agent execution and returns control to the user.
 */
export interface ManagedAgentsUserInterruptEvent {
  /**
   * Unique identifier for this event.
   */
  id: string;
  /**
   * Any of "user.interrupt".
   */
  type: ManagedAgentsUserInterruptEventType;
  /**
   * A timestamp in RFC 3339 format
   */
  processed_at?: string | null;
  /**
   * If absent, interrupts every non-archived thread in a multiagent session (or the
   * primary alone in a single-agent session). If present, interrupts only the named
   * thread.
   */
  session_thread_id?: string | null;
}

export type ManagedAgentsUserInterruptEventType = "user.interrupt";

/**
 * Parameters for sending an interrupt to pause the agent.
 */
export interface ManagedAgentsUserInterruptEventParams {
  /**
   * Any of "user.interrupt".
   */
  type: ManagedAgentsUserInterruptEventParamsType;
  /**
   * If absent, interrupts every non-archived thread in a multiagent session (or the
   * primary alone in a single-agent session). If present, interrupts only the named
   * thread.
   */
  session_thread_id?: string | null;
}

export type ManagedAgentsUserInterruptEventParamsType = "user.interrupt";

/**
 * A user message event in the session conversation.
 */
export interface ManagedAgentsUserMessageEvent {
  /**
   * Unique identifier for this event.
   */
  id: string;
  /**
   * Array of content blocks comprising the user message.
   */
  content: Array<ManagedAgentsUserMessageEventContentUnion>;
  /**
   * Any of "user.message".
   */
  type: ManagedAgentsUserMessageEventType;
  /**
   * A timestamp in RFC 3339 format
   */
  processed_at?: string | null;
}

export type ManagedAgentsUserMessageEventContentUnion = ManagedAgentsTextBlock | ManagedAgentsImageBlock | ManagedAgentsDocumentBlock | ManagedAgentsRedactedBlock;

export interface ManagedAgentsUserMessageEventContentUnionSource {
  data?: string;
  media_type?: string;
  type?: string;
  url?: string;
  file_id?: string;
}

export type ManagedAgentsUserMessageEventType = "user.message";

/**
 * Parameters for sending a user message to the session.
 */
export interface ManagedAgentsUserMessageEventParams {
  /**
   * Array of content blocks for the user message.
   */
  content: Array<ManagedAgentsUserMessageEventParamsContentUnion>;
  /**
   * Any of "user.message".
   */
  type: ManagedAgentsUserMessageEventParamsType;
}

export type ManagedAgentsUserMessageEventParamsContentUnion = ManagedAgentsTextBlockParam | ManagedAgentsImageBlockParam | ManagedAgentsDocumentBlockParam | ManagedAgentsRedactedBlockParam;

export type ManagedAgentsUserMessageEventParamsType = "user.message";

/**
 * A tool confirmation event that approves or denies a pending tool execution.
 */
export interface ManagedAgentsUserToolConfirmationEvent {
  /**
   * Unique identifier for this event.
   */
  id: string;
  /**
   * UserToolConfirmationResult enum
   *
   * Any of "allow", "deny".
   */
  result: ManagedAgentsUserToolConfirmationEventResult;
  /**
   * The id of the `agent.tool_use` or `agent.mcp_tool_use` event this result
   * corresponds to, which can be found in the last `session.status_idle`
   * [event's](https://docs.qoder.com/cloud-agents/api/sessions/schemas)
   * `stop_reason.event_ids` field.
   */
  tool_use_id: string;
  /**
   * Any of "user.tool_confirmation".
   */
  type: ManagedAgentsUserToolConfirmationEventType;
  /**
   * Optional message providing context for a 'deny' decision. Only allowed when
   * result is 'deny'.
   */
  deny_message?: string | null;
  /**
   * A timestamp in RFC 3339 format
   */
  processed_at?: string | null;
  /**
   * When set, the confirmation routes to this subagent's thread rather than the
   * primary. Echo this from the `session_thread_id` on the `agent.tool_use` or
   * `agent.mcp_tool_use` event that prompted the approval.
   */
  session_thread_id?: string | null;
}

/**
 * UserToolConfirmationResult enum
 */
export type ManagedAgentsUserToolConfirmationEventResult = "allow" | "deny";

export type ManagedAgentsUserToolConfirmationEventType = "user.tool_confirmation";

/**
 * Parameters for confirming or denying a tool execution request.
 */
export interface ManagedAgentsUserToolConfirmationEventParams {
  /**
   * UserToolConfirmationResult enum
   *
   * Any of "allow", "deny".
   */
  result: ManagedAgentsUserToolConfirmationEventParamsResult;
  /**
   * The id of the `agent.tool_use` or `agent.mcp_tool_use` event this result
   * corresponds to, which can be found in the last `session.status_idle`
   * [event's](https://docs.qoder.com/cloud-agents/api/sessions/schemas)
   * `stop_reason.event_ids` field.
   */
  tool_use_id: string;
  /**
   * Any of "user.tool_confirmation".
   */
  type: ManagedAgentsUserToolConfirmationEventParamsType;
  /**
   * Optional message providing context for a 'deny' decision. Only allowed when
   * result is 'deny'.
   */
  deny_message?: string | null;
}

/**
 * UserToolConfirmationResult enum
 */
export type ManagedAgentsUserToolConfirmationEventParamsResult = "allow" | "deny";

export type ManagedAgentsUserToolConfirmationEventParamsType = "user.tool_confirmation";

/**
 * Parameters for providing the result of an agent-toolset tool execution. Only
 * valid on `self_hosted` environments, where sandbox-routed tools are executed by
 * the client rather than the server.
 */
export interface ManagedAgentsUserToolResultEventParams {
  /**
   * The id of the `agent.tool_use` event this result corresponds to, which can be
   * found in the last `session.status_idle`
   * [event's](https://docs.qoder.com/cloud-agents/api/sessions/schemas)
   * `stop_reason.event_ids` field.
   */
  tool_use_id: string;
  /**
   * Any of "user.tool_result".
   */
  type: ManagedAgentsUserToolResultEventParamsType;
  /**
   * Whether the tool execution resulted in an error.
   */
  is_error?: boolean | null;
  /**
   * The result content returned by the tool.
   */
  content?: Array<ManagedAgentsUserToolResultEventParamsContentUnion> | null;
}

export type ManagedAgentsUserToolResultEventParamsType = "user.tool_result";

export type ManagedAgentsUserToolResultEventParamsContentUnion = ManagedAgentsTextBlockParam | ManagedAgentsImageBlockParam | ManagedAgentsDocumentBlockParam | ManagedAgentsSearchResultBlockParam;

export interface SessionEventListParams {
  before_id?: string;
  after_id?: string;
  /**
   * Return events created after this time (exclusive). Compared against the event's
   * `processed_at` value.
   */
  "created_at[gt]"?: string;
  /**
   * Return events created at or after this time (inclusive). Compared against the
   * event's `processed_at` value.
   */
  "created_at[gte]"?: string;
  /**
   * Return events created before this time (exclusive). Compared against the event's
   * `processed_at` value.
   */
  "created_at[lt]"?: string;
  /**
   * Return events created at or before this time (inclusive). Compared against the
   * event's `processed_at` value.
   */
  "created_at[lte]"?: string;
  /**
   * Query parameter for limit
   */
  limit?: number;
  /**
   * Opaque pagination cursor from a previous response's `next_page`.
   */
  page?: string;
  workspace_id?: string;
  /**
   * Sort direction for results, ordered by the event's `processed_at`. Defaults to
   * `asc` (chronological).
   *
   * Any of "asc", "desc".
   */
  order?: SessionEventListParamsOrder;
  /**
   * Filter by event type. Values match the `type` field on returned events (for
   * example, `user.message` or `agent.tool_use`). Omit to return all event types.
   */
  types?: Array<string>;
  /**
   * Optional header to specify the beta version(s) you want to use.
   */
  betas?: Array<QoderBeta>;
}

/**
 * Sort direction for results, ordered by the event's `processed_at`. Defaults to
 * `asc` (chronological).
 */
export type SessionEventListParamsOrder = "asc" | "desc";

export interface SessionEventSendParams {
  /**
   * Events to send to the `session`.
   */
  events: Array<ManagedAgentsEventParamsUnion>;
  workspace_id?: string;
  /**
   * Optional header to specify the beta version(s) you want to use.
   */
  betas?: Array<QoderBeta>;
}

export interface SessionEventStreamParams {
  workspace_id?: string;
  /**
   * When set, this connection also receives streaming deltas (`event_start`,
   * `event_delta`) while an event is being produced, before the event itself
   * arrives. Deltas are best-effort; when the final event is produced it carries the
   * complete content. A model request that ends early (an error or interrupt)
   * produces no final event — its terminal `span.model_request_end` closes the
   * preview. Accepts one or more event types to preview and may be repeated:
   * `agent.message` streams `content_delta` fragments; `agent.thinking` is
   * start-only — a signal that the agent has begun extended thinking, concluded by
   * the `agent.thinking` event itself. Only previews of the requested event types
   * are sent.
   */
  event_deltas?: Array<ManagedAgentsDeltaType>;
  /**
   * Optional header to specify the beta version(s) you want to use.
   */
  betas?: Array<QoderBeta>;
}

/**
 * Confirmation of resource deletion.
 */
export interface ManagedAgentsDeleteSessionResource {
  id: string;
  /**
   * Any of "session_resource_deleted".
   */
  type: ManagedAgentsDeleteSessionResourceType;
}

export type ManagedAgentsDeleteSessionResourceType = "session_resource_deleted";

export interface ManagedAgentsFileResource {
  id: string;
  /**
   * A timestamp in RFC 3339 format
   */
  created_at: string;
  file_id: string;
  mount_path: string;
  /**
   * Any of "file".
   */
  type: ManagedAgentsFileResourceType;
  /**
   * A timestamp in RFC 3339 format
   */
  updated_at: string;
}

export type ManagedAgentsFileResourceType = "file";

export interface ManagedAgentsGitHubRepositoryResource {
  id: string;
  /**
   * A timestamp in RFC 3339 format
   */
  created_at: string;
  mount_path: string;
  /**
   * Any of "github_repository".
   */
  type: ManagedAgentsGitHubRepositoryResourceType;
  /**
   * A timestamp in RFC 3339 format
   */
  updated_at: string;
  url: string;
  checkout?: ManagedAgentsGitHubRepositoryResourceCheckoutUnion | null;
}

export type ManagedAgentsGitHubRepositoryResourceType = "github_repository";

/**
 * ManagedAgentsGitHubRepositoryResourceCheckoutUnion contains all possible
 * properties and values from `ManagedAgentsBranchCheckout`,
 * `ManagedAgentsCommitCheckout`.
 */
export type ManagedAgentsGitHubRepositoryResourceCheckoutUnion = ManagedAgentsBranchCheckout | ManagedAgentsCommitCheckout;

/**
 * A memory store attached to an agent session.
 */
export interface ManagedAgentsMemoryStoreResource {
  /**
   * The memory store ID (memstore\_...). Must belong to the caller's organization
   * and workspace.
   */
  memory_store_id: string;
  /**
   * Any of "memory_store".
   */
  type: ManagedAgentsMemoryStoreResourceType;
  /**
   * Access mode for an attached memory store.
   *
   * Any of "read_write", "read_only".
   */
  access?: ManagedAgentsMemoryStoreResourceAccess | null;
  /**
   * Description of the memory store, snapshotted at attach time. Rendered into the
   * agent's system prompt. Empty string when the store has no description.
   */
  description?: string;
  /**
   * Per-attachment guidance for the agent on how to use this store. Rendered into
   * the memory section of the system prompt. Max 4096 chars.
   */
  instructions?: string | null;
  /**
   * Filesystem path where the store is mounted in the session container, e.g.
   * /mnt/memory/user-preferences. Derived from the store's name. Output-only.
   */
  mount_path?: string | null;
  /**
   * Display name of the memory store, snapshotted at attach time. Later edits to the
   * store's name do not propagate to this resource.
   */
  name?: string | null;
}

export type ManagedAgentsMemoryStoreResourceType = "memory_store";

/**
 * Access mode for an attached memory store.
 */
export type ManagedAgentsMemoryStoreResourceAccess = "read_write" | "read_only";

export type ManagedAgentsSessionResourceUnion = ManagedAgentsGitHubRepositoryResource | ManagedAgentsFileResource | ManagedAgentsMemoryStoreResource;

export type SessionResourceGetResponseUnion = ManagedAgentsGitHubRepositoryResource | ManagedAgentsFileResource | ManagedAgentsMemoryStoreResource;

export type SessionResourceUpdateResponseUnion = ManagedAgentsGitHubRepositoryResource | ManagedAgentsFileResource | ManagedAgentsMemoryStoreResource;

export interface SessionResourceGetParams {
  session_id: string;
  workspace_id?: string;
  /**
   * Optional header to specify the beta version(s) you want to use.
   */
  betas?: Array<QoderBeta>;
}

export interface SessionResourceUpdateParams {
  password?: string | null;
  session_id: string;
  /**
   * New authorization token for the resource. Currently only `github_repository`
   * resources support token rotation.
   */
  authorization_token?: string | null;
  workspace_id?: string;
  /**
   * Optional header to specify the beta version(s) you want to use.
   */
  betas?: Array<QoderBeta>;
}

export interface SessionResourceListParams {
  before_id?: string;
  after_id?: string;
  /**
   * Maximum number of resources to return per page (max 1000). If omitted, returns
   * all resources.
   */
  limit?: number;
  /**
   * Opaque cursor from a previous response's `next_page` field.
   */
  page?: string;
  workspace_id?: string;
  /**
   * Optional header to specify the beta version(s) you want to use.
   */
  betas?: Array<QoderBeta>;
}

export interface SessionResourceDeleteParams {
  session_id: string;
  workspace_id?: string;
  /**
   * Optional header to specify the beta version(s) you want to use.
   */
  betas?: Array<QoderBeta>;
}

export interface SessionResourceAddParams {
  /**
   * ID of a previously uploaded file.
   */
  file_id: string;
  /**
   * Any of "file".
   */
  type: ManagedAgentsFileResourceParamsType;
  /**
   * Mount path in the container. Defaults to `/mnt/session/uploads/<file_id>`.
   */
  mount_path?: string | null;
  workspace_id?: string;
  /**
   * Optional header to specify the beta version(s) you want to use.
   */
  betas?: Array<QoderBeta>;
}

/**
 * An execution thread within a `session`. Each session has one primary thread plus
 * zero or more child threads spawned by the coordinator.
 */
export interface ManagedAgentsSessionThread {
  /**
   * Unique identifier for this thread.
   */
  id: string;
  /**
   * The resolved agent a session thread runs: a saved-agent snapshot, the platform
   * advisor entry, or an inline-defined (ephemeral) agent snapshot.
   */
  agent: ManagedAgentsSessionThreadAgentUnion;
  /**
   * A timestamp in RFC 3339 format
   */
  archived_at: string | null;
  /**
   * A timestamp in RFC 3339 format
   */
  created_at: string;
  /**
   * Parent thread that spawned this thread. Null for the primary thread.
   */
  parent_thread_id: string | null;
  /**
   * The session this thread belongs to.
   */
  session_id: string;
  /**
   * Timing statistics for a session thread.
   */
  stats: ManagedAgentsSessionThreadStats | null;
  /**
   * SessionThreadStatus enum
   *
   * Any of "running", "idle", "rescheduling", "terminated".
   */
  status: ManagedAgentsSessionThreadStatus;
  /**
   * Any of "session_thread".
   */
  type: ManagedAgentsSessionThreadType;
  /**
   * A timestamp in RFC 3339 format
   */
  updated_at: string;
  /**
   * Cumulative token usage for a session thread across all turns.
   */
  usage: ManagedAgentsSessionThreadUsage;
}

export type ManagedAgentsSessionThreadAgentUnion = ManagedAgentsSessionThreadAgent | ManagedAgentsAdvisor;

export type ManagedAgentsSessionThreadAgentUnionModel = string | {
  /**
   * This field is from variant `ManagedAgentsModelConfig`.
   */
  id?: ManagedAgentsModel;
  /**
   * This field is from variant `ManagedAgentsModelConfig`.
   */
  effort?: ManagedAgentsModelConfigEffortUnion;
  /**
   * This field is from variant `ManagedAgentsModelConfig`.
   */
  inference_geo?: string;
  /**
   * This field is from variant `ManagedAgentsModelConfig`.
   */
  speed?: ManagedAgentsModelConfigSpeed;
};

export type ManagedAgentsSessionThreadType = "session_thread";

/**
 * Timing statistics for a session thread.
 */
export interface ManagedAgentsSessionThreadStats {
  /**
   * Cumulative time in seconds the thread spent actively running. Excludes idle
   * time.
   */
  active_seconds?: number;
  /**
   * Elapsed time since thread creation in seconds. For archived threads, frozen at
   * the final update.
   */
  duration_seconds?: number;
  /**
   * Time in seconds for the thread to begin running. Zero for child threads, which
   * start immediately.
   */
  startup_seconds?: number;
}

/**
 * SessionThreadStatus enum
 */
export type ManagedAgentsSessionThreadStatus = "running" | "idle" | "rescheduling" | "terminated";

/**
 * Cumulative token usage for a session thread across all turns.
 */
export interface ManagedAgentsSessionThreadUsage {
  /**
   * Cumulative time in seconds this thread spent in running status. Equal to
   * `stats.active_seconds`; surfaced here so a thread's usage carries every quantity
   * its cost is priced on.
   */
  active_seconds?: number;
  /**
   * Prompt-cache creation token usage broken down by cache lifetime.
   */
  cache_creation?: ManagedAgentsCacheCreationUsage;
  /**
   * Total tokens read from prompt cache.
   */
  cache_read_input_tokens?: number;
  /**
   * Total input tokens consumed across all turns.
   */
  input_tokens?: number;
  /**
   * A monetary amount in a specific currency.
   */
  list_cost?: MonetaryAmount | null;
  /**
   * Total output tokens generated across all turns.
   */
  output_tokens?: number;
  /**
   * Cumulative count of server-executed tool invocations, broken down by tool.
   */
  server_tool_use?: ManagedAgentsServerToolUsage | null;
}

export type ManagedAgentsStreamSessionThreadEventsUnion = ManagedAgentsUserMessageEvent | ManagedAgentsUserInterruptEvent | ManagedAgentsUserToolConfirmationEvent | ManagedAgentsUserCustomToolResultEvent | ManagedAgentsAgentCustomToolUseEvent | ManagedAgentsAgentMessageEvent | ManagedAgentsAgentThinkingEvent | ManagedAgentsAgentMCPToolUseEvent | ManagedAgentsAgentMCPToolResultEvent | ManagedAgentsAgentToolUseEvent | ManagedAgentsAgentToolResultEvent | ManagedAgentsAgentThreadMessageReceivedEvent | ManagedAgentsAgentThreadMessageSentEvent | ManagedAgentsAgentThreadContextCompactedEvent | ManagedAgentsSessionErrorEvent | ManagedAgentsSessionStatusRescheduledEvent | ManagedAgentsSessionStatusRunningEvent | ManagedAgentsSessionStatusIdleEvent | ManagedAgentsSessionStatusTerminatedEvent | ManagedAgentsSessionThreadCreatedEvent | ManagedAgentsSpanOutcomeEvaluationStartEvent | ManagedAgentsSpanOutcomeEvaluationEndEvent | ManagedAgentsSpanModelRequestStartEvent | ManagedAgentsSpanModelRequestEndEvent | ManagedAgentsSpanOutcomeEvaluationOngoingEvent | ManagedAgentsUserDefineOutcomeEvent | ManagedAgentsSessionDeletedEvent | ManagedAgentsSessionThreadStatusRunningEvent | ManagedAgentsSessionThreadStatusIdleEvent | ManagedAgentsSessionThreadStatusTerminatedEvent | ManagedAgentsUserToolResultEvent | ManagedAgentsSessionThreadStatusRescheduledEvent | ManagedAgentsSessionUpdatedEvent | ManagedAgentsStartEvent | ManagedAgentsDeltaEvent | ManagedAgentsSystemMessageEvent | ManagedAgentsSessionUsageEvent;

export type ManagedAgentsStreamSessionThreadEventsUnionContent = Array<ManagedAgentsUserMessageEventContentUnion> | Array<ManagedAgentsUserCustomToolResultEventContentUnion> | Array<ManagedAgentsAgentMessageEventContentUnion> | Array<ManagedAgentsAgentMCPToolResultEventContentUnion> | Array<ManagedAgentsAgentToolResultEventContentUnion> | Array<ManagedAgentsAgentThreadMessageReceivedEventContentUnion> | Array<ManagedAgentsAgentThreadMessageSentEventContentUnion> | Array<ManagedAgentsUserToolResultEventContentUnion> | Array<ManagedAgentsSystemContentBlock>;

/**
 * ManagedAgentsStreamSessionThreadEventsUnionStopReason is an implicit
 * subunion of `ManagedAgentsStreamSessionThreadEventsUnion`.
 * ManagedAgentsStreamSessionThreadEventsUnionStopReason provides convenient
 * access to the sub-properties of the union.
 */
export interface ManagedAgentsStreamSessionThreadEventsUnionStopReason {
  type?: string;
  /**
   * This field is from variant
   * `ManagedAgentsSessionStatusIdleEventStopReasonUnion`,
   * `ManagedAgentsSessionThreadStatusIdleEventStopReasonUnion`.
   */
  event_ids?: Array<string>;
}

export interface ManagedAgentsStreamSessionThreadEventsUnionUsage {
  /**
   * This field is from variant `ManagedAgentsSpanModelUsage`.
   */
  cache_creation_input_tokens?: number;
  cache_read_input_tokens?: number;
  input_tokens?: number;
  output_tokens?: number;
  /**
   * This field is from variant `ManagedAgentsSpanModelUsage`.
   */
  speed?: ManagedAgentsSpanModelUsageSpeed;
  /**
   * This field is from variant `ManagedAgentsSessionUsageSnapshot`.
   */
  active_seconds?: number;
  /**
   * This field is from variant `ManagedAgentsSessionUsageSnapshot`.
   */
  cache_creation?: ManagedAgentsCacheCreationUsage;
  /**
   * This field is from variant `ManagedAgentsSessionUsageSnapshot`.
   */
  list_cost?: MonetaryAmount;
  /**
   * This field is from variant `ManagedAgentsSessionUsageSnapshot`.
   */
  server_tool_use?: ManagedAgentsServerToolUsage;
}

export interface SessionThreadGetParams {
  session_id: string;
  workspace_id?: string;
  /**
   * Optional header to specify the beta version(s) you want to use.
   */
  betas?: Array<QoderBeta>;
}

export interface SessionThreadListParams {
  /**
   * Maximum results per page. Defaults to 1000.
   */
  limit?: number;
  /**
   * Opaque pagination cursor from a previous response's `next_page`. Forward-only.
   */
  page?: string;
  workspace_id?: string;
  /**
   * Optional header to specify the beta version(s) you want to use.
   */
  betas?: Array<QoderBeta>;
}

export interface SessionThreadArchiveParams {
  session_id: string;
  workspace_id?: string;
  /**
   * Optional header to specify the beta version(s) you want to use.
   */
  betas?: Array<QoderBeta>;
}

export interface SessionThreadEventListParams {
  before_id?: string;
  after_id?: string;
  session_id: string;
  /**
   * Query parameter for limit
   */
  limit?: number;
  /**
   * Query parameter for page
   */
  page?: string;
  workspace_id?: string;
  /**
   * Optional header to specify the beta version(s) you want to use.
   */
  betas?: Array<QoderBeta>;
}

export interface SessionThreadEventStreamParams {
  session_id: string;
  workspace_id?: string;
  /**
   * When set, this connection also receives streaming deltas (`event_start`,
   * `event_delta`) while an event is being produced, before the event itself
   * arrives. Deltas are best-effort; when the final event is produced it carries the
   * complete content. A model request that ends early (an error or interrupt)
   * produces no final event — its terminal `span.model_request_end` closes the
   * preview. Accepts one or more event types to preview and may be repeated:
   * `agent.message` streams `content_delta` fragments; `agent.thinking` is
   * start-only — a signal that the agent has begun extended thinking, concluded by
   * the `agent.thinking` event itself. Only previews of the requested event types
   * are sent.
   */
  event_deltas?: Array<ManagedAgentsDeltaType>;
  /**
   * Optional header to specify the beta version(s) you want to use.
   */
  betas?: Array<QoderBeta>;
}

export interface DeletedSkill {
  /**
   * Unique identifier for the skill.
   *
   * The format and length of IDs may change over time.
   */
  id: string;
  /**
   * Deleted object type.
   *
   * For Skills, this is always `"skill_deleted"`.
   */
  type?: "skill_deleted";
}

export interface Skill {
  metadata?: Record<string, string>;
  /**
   * Unique identifier for the skill.
   *
   * The format and length of IDs may change over time.
   */
  id: string;
  /**
   * ISO 8601 timestamp of when the skill was created.
   */
  created_at: string;
  /**
   * Human-readable, single-line label for the Skill. Maximum 255 characters. Always
   * set: derived from the SKILL.md frontmatter `name` when omitted at creation. Not
   * unique.
   */
  display_title: string;
  /**
   * ID of the newest Skill Version — what `latest` references resolve to. Always
   * set: a Skill holds at least one version.
   */
  latest_version: string;
  /**
   * Where the Skill comes from.
   *
   * Possible values:
   *
   * - `"custom"`: authored by the platform user; private to their workspace
   * - `"qoder"`: published by Qoder; shared and read-only
   * - `"qoder_example"`: Qoder-published sample Skill
   * - `"plugin"`: resolved from an installed plugin
   */
  source: SkillSource;
  /**
   * Object type.
   *
   * For Skills, this is always `"skill"`.
   */
  type?: "skill";
  /**
   * ISO 8601 timestamp of when the skill was last updated.
   */
  updated_at: string;
}

export type SkillSource = string | {
  /**
   * Where the Skill comes from.
   *
   * Possible values:
   *
   * - `"custom"`: authored by the platform user; private to their workspace
   * - `"qoder"`: published by Qoder; shared and read-only
   * - `"qoder_example"`: Qoder-published sample Skill
   * - `"plugin"`: resolved from an installed plugin
   *
   * Any of "custom", "qoder", "qoder_example", "plugin".
   */
  type: SkillSourceType;
};

/**
 * Where the Skill comes from.
 *
 * Possible values:
 *
 * - `"custom"`: authored by the platform user; private to their workspace
 * - `"qoder"`: published by Qoder; shared and read-only
 * - `"qoder_example"`: Qoder-published sample Skill
 * - `"plugin"`: resolved from an installed plugin
 */
export type SkillSourceType = "custom" | "qoder" | "qoder_example" | "plugin";

export interface SkillNewParams {
  metadata?: Record<string, string> | null;
  /**
   * Files to upload for the skill.
   *
   * All files must be in the same top-level directory and must include a SKILL.md
   * file at the root of that directory.
   */
  files: Array<Uploadable>;
  /**
   * Human-readable, single-line label for the Skill. Maximum 255 characters. Always
   * set: derived from the SKILL.md frontmatter `name` when omitted at creation. Not
   * unique.
   */
  display_title?: string | null;
  workspace_id?: string;
  /**
   * Optional header to specify the beta version(s) you want to use.
   */
  betas?: Array<QoderBeta>;
}

export interface SkillGetParams {
  workspace_id?: string;
  /**
   * Optional header to specify the beta version(s) you want to use.
   */
  betas?: Array<QoderBeta>;
}

export interface SkillListParams {
  display_title?: string;
  name?: string;
  before_id?: string;
  after_id?: string;
  /**
   * Pagination token for fetching a specific page of results.
   *
   * Pass the value from a previous response's `next_page` field to get the next page
   * of results.
   */
  page?: string;
  /**
   * Filter skills by source.
   *
   * If provided, only skills from the specified source will be returned:
   *
   * - `"custom"`: only return user-created skills
   * - `"qoder"`: only return Qoder-created skills
   */
  source?: string;
  /**
   * Number of results to return per page.
   *
   * Ranges from `1` to `1000`. Defaults to `20`.
   */
  limit?: number;
  workspace_id?: string;
  /**
   * Optional header to specify the beta version(s) you want to use.
   */
  betas?: Array<QoderBeta>;
}

export interface SkillDeleteParams {
  workspace_id?: string;
  /**
   * Optional header to specify the beta version(s) you want to use.
   */
  betas?: Array<QoderBeta>;
}

export interface DeletedSkillVersion {
  /**
   * Unique identifier for this Skill Version. The id addresses the version in paths
   * and pins it in references.
   */
  id: string;
  /**
   * Deleted object type.
   *
   * For Skill Versions, this is always `"skill_version_deleted"`.
   */
  type?: "skill_version_deleted";
}

export interface SkillVersion {
  version?: string;
  directory?: string;
  /**
   * Unique identifier for this Skill Version. The id addresses the version in paths
   * and pins it in references.
   */
  id: string;
  /**
   * ISO 8601 timestamp of when the skill was created.
   */
  created_at: string;
  /**
   * Description of the skill version.
   *
   * This is extracted from the SKILL.md file in the skill upload.
   */
  description: string;
  /**
   * The Skill's immutable kebab-case slug, set at creation from the first upload's
   * SKILL.md frontmatter `name` (or its enclosing directory). Every later upload
   * must resolve to the same value. Also the top-level directory of the Skill's
   * mounted files and the base name of a downloaded archive.
   */
  name: string;
  /**
   * Unique identifier for the skill.
   *
   * The format and length of IDs may change over time.
   */
  skill_id: string;
  /**
   * Object type.
   *
   * For Skill Versions, this is always `"skill_version"`.
   */
  type?: "skill_version";
}

export interface SkillVersionNewParams {
  /**
   * Files to upload for the skill.
   *
   * All files must be in the same top-level directory and must include a SKILL.md
   * file at the root of that directory.
   */
  files: Array<Uploadable>;
  workspace_id?: string;
  /**
   * Optional header to specify the beta version(s) you want to use.
   */
  betas?: Array<QoderBeta>;
}

export interface SkillVersionGetParams {
  /**
   * Unique identifier for the skill.
   *
   * The format and length of IDs may change over time.
   */
  skill_id: string;
  workspace_id?: string;
  /**
   * Optional header to specify the beta version(s) you want to use.
   */
  betas?: Array<QoderBeta>;
}

export interface SkillVersionListParams {
  /**
   * Number of results to return per page.
   *
   * Ranges from `1` to `1000`. Defaults to `20`.
   */
  limit?: number;
  /**
   * Optionally set to the `next_page` token from the previous response.
   */
  page?: string;
  workspace_id?: string;
  /**
   * Optional header to specify the beta version(s) you want to use.
   */
  betas?: Array<QoderBeta>;
}

export interface SkillVersionDeleteParams {
  /**
   * Unique identifier for the skill.
   *
   * The format and length of IDs may change over time.
   */
  skill_id: string;
  workspace_id?: string;
  /**
   * Optional header to specify the beta version(s) you want to use.
   */
  betas?: Array<QoderBeta>;
}

export interface SkillVersionDownloadParams {
  /**
   * Unique identifier for the skill.
   *
   * The format and length of IDs may change over time.
   */
  skill_id: string;
  workspace_id?: string;
  /**
   * Optional header to specify the beta version(s) you want to use.
   */
  betas?: Array<QoderBeta>;
}

/**
 * Confirmation of a deleted vault.
 */
export interface ManagedAgentsDeletedVault {
  /**
   * Unique identifier of the deleted vault.
   */
  id: string;
  /**
   * Any of "vault_deleted".
   */
  type: ManagedAgentsDeletedVaultType;
}

export type ManagedAgentsDeletedVaultType = "vault_deleted";

/**
 * A vault that stores credentials for use by agents during sessions.
 */
export interface ManagedAgentsVault {
  /**
   * Unique identifier for the vault.
   */
  id: string;
  /**
   * A timestamp in RFC 3339 format
   */
  archived_at: string | null;
  /**
   * A timestamp in RFC 3339 format
   */
  created_at: string;
  /**
   * Human-readable name for the vault.
   */
  display_name: string;
  /**
   * Arbitrary key-value metadata attached to the vault.
   */
  metadata: Record<string, string>;
  /**
   * Any of "vault".
   */
  type: ManagedAgentsVaultType;
  /**
   * A timestamp in RFC 3339 format
   */
  updated_at: string;
}

export type ManagedAgentsVaultType = "vault";

export interface VaultNewParams {
  /**
   * Human-readable name for the vault. 1-255 characters.
   */
  display_name: string;
  workspace_id?: string;
  /**
   * Arbitrary key-value metadata to attach to the vault. Maximum 16 pairs, keys up
   * to 64 chars, values up to 512 chars.
   */
  metadata?: Record<string, string> | null;
  /**
   * Optional header to specify the beta version(s) you want to use.
   */
  betas?: Array<QoderBeta>;
}

export interface VaultGetParams {
  workspace_id?: string;
  /**
   * Optional header to specify the beta version(s) you want to use.
   */
  betas?: Array<QoderBeta>;
}

export interface VaultListParams {
  name?: string;
  before_id?: string;
  after_id?: string;
  /**
   * Whether to include archived vaults in the results.
   */
  include_archived?: boolean;
  /**
   * Maximum number of vaults to return per page. Defaults to 20, maximum 100.
   */
  limit?: number;
  /**
   * Opaque pagination token from a previous `list_vaults` response.
   */
  page?: string;
  workspace_id?: string;
  /**
   * Optional header to specify the beta version(s) you want to use.
   */
  betas?: Array<QoderBeta>;
}

export interface VaultDeleteParams {
  workspace_id?: string;
  /**
   * Optional header to specify the beta version(s) you want to use.
   */
  betas?: Array<QoderBeta>;
}

export interface VaultArchiveParams {
  workspace_id?: string;
  /**
   * Optional header to specify the beta version(s) you want to use.
   */
  betas?: Array<QoderBeta>;
}

/**
 * A credential stored in a vault. Sensitive fields are never returned in
 * responses.
 */
export interface ManagedAgentsCredential {
  /**
   * Unique identifier for the credential.
   */
  id: string;
  /**
   * A timestamp in RFC 3339 format
   */
  archived_at: string | null;
  /**
   * Authentication details for a credential.
   */
  auth: ManagedAgentsCredentialAuthUnion;
  /**
   * A timestamp in RFC 3339 format
   */
  created_at: string;
  /**
   * Arbitrary key-value metadata attached to the credential.
   */
  metadata: Record<string, string>;
  /**
   * Any of "vault_credential".
   */
  type: ManagedAgentsCredentialType;
  /**
   * A timestamp in RFC 3339 format
   */
  updated_at: string;
  /**
   * Identifier of the vault this credential belongs to.
   */
  vault_id: string;
  /**
   * Human-readable name for the credential.
   */
  display_name?: string | null;
}

export type ManagedAgentsCredentialAuthUnion = ManagedAgentsMCPOAuthAuthResponse | ManagedAgentsStaticBearerAuthResponse | ManagedAgentsEnvironmentVariableAuthResponse;

export type ManagedAgentsCredentialType = "vault_credential";

export type ManagedAgentsCredentialNetworkingParamsUnion = ManagedAgentsUnrestrictedCredentialNetworkingParams | ManagedAgentsLimitedCredentialNetworkingParams;

/**
 * Result of live-probing a credential against its configured MCP server.
 */
export interface ManagedAgentsCredentialValidation {
  /**
   * Unique identifier of the credential that was validated.
   */
  credential_id: string;
  /**
   * Whether the credential has a refresh token configured.
   */
  has_refresh_token: boolean;
  /**
   * The failing step of an MCP validation probe.
   */
  mcp_probe: ManagedAgentsMCPProbe;
  /**
   * Outcome of a refresh-token exchange attempted during credential validation.
   */
  refresh: ManagedAgentsRefreshObject;
  /**
   * Overall verdict of a credential validation probe.
   *
   * Any of "valid", "invalid", "unknown".
   */
  status: ManagedAgentsCredentialValidationStatus;
  /**
   * Any of "vault_credential_validation".
   */
  type: ManagedAgentsCredentialValidationType;
  /**
   * A timestamp in RFC 3339 format
   */
  validated_at: string;
  /**
   * Identifier of the vault containing the credential.
   */
  vault_id: string;
}

export type ManagedAgentsCredentialValidationType = "vault_credential_validation";

/**
 * Overall verdict of a credential validation probe.
 */
export type ManagedAgentsCredentialValidationStatus = "valid" | "invalid" | "unknown";

/**
 * Confirmation of a deleted credential.
 */
export interface ManagedAgentsDeletedCredential {
  /**
   * Unique identifier of the deleted credential.
   */
  id: string;
  /**
   * Any of "vault_credential_deleted".
   */
  type: ManagedAgentsDeletedCredentialType;
}

export type ManagedAgentsDeletedCredentialType = "vault_credential_deleted";

/**
 * Environment variable credential details. The secret value is never returned.
 */
export interface ManagedAgentsEnvironmentVariableAuthResponse {
  /**
   * Where in the outbound request the secret value is substituted.
   */
  injection_location: ManagedAgentsInjectionLocationResponse;
  /**
   * Outbound hosts the secret value is substituted on.
   */
  networking: ManagedAgentsEnvironmentVariableAuthResponseNetworkingUnion;
  /**
   * Name of the environment variable.
   */
  secret_name: string;
  /**
   * Any of "environment_variable".
   */
  type: ManagedAgentsEnvironmentVariableAuthResponseType;
}

/**
 * ManagedAgentsEnvironmentVariableAuthResponseNetworkingUnion contains all
 * possible properties and values from
 * `ManagedAgentsUnrestrictedCredentialNetworkingResponse`,
 * `ManagedAgentsLimitedCredentialNetworkingResponse`.
 */
export type ManagedAgentsEnvironmentVariableAuthResponseNetworkingUnion = ManagedAgentsUnrestrictedCredentialNetworkingResponse | ManagedAgentsLimitedCredentialNetworkingResponse;

export type ManagedAgentsEnvironmentVariableAuthResponseType = "environment_variable";

/**
 * Parameters for creating an environment variable credential.
 */
export interface ManagedAgentsEnvironmentVariableCreateParams {
  /**
   * Outbound hosts the secret value is substituted on.
   */
  networking: ManagedAgentsCredentialNetworkingParamsUnion;
  /**
   * Name of the environment variable. Immutable after create.
   */
  secret_name: string;
  /**
   * Secret value. Write-only; never returned in responses.
   */
  secret_value: string;
  /**
   * Any of "environment_variable".
   */
  type: ManagedAgentsEnvironmentVariableCreateParamsType;
  /**
   * Where in the outbound request the secret value may be substituted.
   */
  injection_location?: ManagedAgentsInjectionLocationParams | null;
}

export type ManagedAgentsEnvironmentVariableCreateParamsType = "environment_variable";

/**
 * Parameters for updating an environment variable credential. `secret_name` is
 * immutable.
 */
export interface ManagedAgentsEnvironmentVariableUpdateParams {
  /**
   * Any of "environment_variable".
   */
  type: ManagedAgentsEnvironmentVariableUpdateParamsType;
  /**
   * Updated secret value.
   */
  secret_value?: string | null;
  /**
   * Updated injection location.
   */
  injection_location?: ManagedAgentsInjectionLocationUpdateParams | null;
  /**
   * Updated networking scope. Full replacement.
   */
  networking?: ManagedAgentsCredentialNetworkingParamsUnion | null;
}

export type ManagedAgentsEnvironmentVariableUpdateParamsType = "environment_variable";

/**
 * Where in the outbound request the secret value may be substituted.
 */
export interface ManagedAgentsInjectionLocationParams {
  /**
   * Substitute when the placeholder appears in the request body.
   */
  body?: boolean | null;
  /**
   * Substitute when the placeholder appears in a request header value.
   */
  header?: boolean | null;
}

/**
 * Where in the outbound request the secret value is substituted.
 */
export interface ManagedAgentsInjectionLocationResponse {
  /**
   * Whether the placeholder is substituted in the request body.
   */
  body: boolean;
  /**
   * Whether the placeholder is substituted in request header values.
   */
  header: boolean;
}

/**
 * Updated injection location.
 */
export interface ManagedAgentsInjectionLocationUpdateParams {
  /**
   * Substitute when the placeholder appears in the request body.
   */
  body?: boolean | null;
  /**
   * Substitute when the placeholder appears in a request header value.
   */
  header?: boolean | null;
}

/**
 * Substitute the secret only on requests to the listed hosts.
 */
export interface ManagedAgentsLimitedCredentialNetworkingParams {
  /**
   * Hostnames on which the secret will be substituted. Each entry is a bare hostname
   * (`api.example.com`), an IPv4 address (`192.0.2.1`), or a `*.`-prefixed wildcard
   * (`*.example.com`). URLs, ports, paths, and IPv6 addresses are not accepted. At
   * most 16 entries.
   */
  allowed_hosts: Array<string>;
  /**
   * Any of "limited".
   */
  type: ManagedAgentsLimitedCredentialNetworkingParamsType;
}

export type ManagedAgentsLimitedCredentialNetworkingParamsType = "limited";

/**
 * The secret is substituted only on requests to the listed hosts.
 */
export interface ManagedAgentsLimitedCredentialNetworkingResponse {
  /**
   * Hostnames on which the secret will be substituted. An entry matches the request
   * host exactly; a `*.`-prefixed entry matches any subdomain of the named domain
   * but not the domain itself.
   */
  allowed_hosts: Array<string>;
  /**
   * Any of "limited".
   */
  type: ManagedAgentsLimitedCredentialNetworkingResponseType;
}

export type ManagedAgentsLimitedCredentialNetworkingResponseType = "limited";

/**
 * OAuth credential details for an MCP server.
 */
export interface ManagedAgentsMCPOAuthAuthResponse {
  /**
   * URL of the MCP server this credential authenticates against.
   */
  mcp_server_url: string;
  /**
   * Any of "mcp_oauth".
   */
  type: ManagedAgentsMCPOAuthAuthResponseType;
  /**
   * A timestamp in RFC 3339 format
   */
  expires_at?: string | null;
  /**
   * OAuth refresh token configuration returned in credential responses.
   */
  refresh?: ManagedAgentsMCPOAuthRefreshResponse | null;
}

export type ManagedAgentsMCPOAuthAuthResponseType = "mcp_oauth";

/**
 * Parameters for creating an MCP OAuth credential.
 */
export interface ManagedAgentsMCPOAuthCreateParams {
  /**
   * OAuth access token.
   */
  access_token: string;
  /**
   * URL of the MCP server this credential authenticates against.
   */
  mcp_server_url: string;
  /**
   * Any of "mcp_oauth".
   */
  type: ManagedAgentsMCPOAuthCreateParamsType;
  /**
   * A timestamp in RFC 3339 format
   */
  expires_at?: string | null;
  /**
   * OAuth refresh token parameters for creating a credential with refresh support.
   */
  refresh?: ManagedAgentsMCPOAuthRefreshParams | null;
}

export type ManagedAgentsMCPOAuthCreateParamsType = "mcp_oauth";

/**
 * OAuth refresh token parameters for creating a credential with refresh support.
 */
export interface ManagedAgentsMCPOAuthRefreshParams {
  /**
   * OAuth client ID.
   */
  client_id: string;
  /**
   * OAuth refresh token.
   */
  refresh_token: string;
  /**
   * Token endpoint URL used to refresh the access token.
   */
  token_endpoint: string;
  /**
   * Token endpoint requires no client authentication.
   */
  token_endpoint_auth: ManagedAgentsMCPOAuthRefreshParamsTokenEndpointAuthUnion;
  /**
   * OAuth resource indicator.
   */
  resource?: string | null;
  /**
   * OAuth scope for the refresh request.
   */
  scope?: string | null;
}

export type ManagedAgentsMCPOAuthRefreshParamsTokenEndpointAuthUnion = ManagedAgentsTokenEndpointAuthNoneParam | ManagedAgentsTokenEndpointAuthBasicParam | ManagedAgentsTokenEndpointAuthPostParam;

/**
 * OAuth refresh token configuration returned in credential responses.
 */
export interface ManagedAgentsMCPOAuthRefreshResponse {
  /**
   * OAuth client ID.
   */
  client_id: string;
  /**
   * Token endpoint URL used to refresh the access token.
   */
  token_endpoint: string;
  /**
   * Token endpoint requires no client authentication.
   */
  token_endpoint_auth: ManagedAgentsMCPOAuthRefreshResponseTokenEndpointAuthUnion;
  /**
   * OAuth resource indicator.
   */
  resource?: string | null;
  /**
   * OAuth scope for the refresh request.
   */
  scope?: string | null;
}

/**
 * ManagedAgentsMCPOAuthRefreshResponseTokenEndpointAuthUnion contains all
 * possible properties and values from
 * `ManagedAgentsTokenEndpointAuthNoneResponse`,
 * `ManagedAgentsTokenEndpointAuthBasicResponse`,
 * `ManagedAgentsTokenEndpointAuthPostResponse`.
 */
export type ManagedAgentsMCPOAuthRefreshResponseTokenEndpointAuthUnion = ManagedAgentsTokenEndpointAuthNoneResponse | ManagedAgentsTokenEndpointAuthBasicResponse | ManagedAgentsTokenEndpointAuthPostResponse;

/**
 * Parameters for updating OAuth refresh token configuration.
 */
export interface ManagedAgentsMCPOAuthRefreshUpdateParams {
  /**
   * Updated OAuth refresh token.
   */
  refresh_token?: string | null;
  /**
   * Updated OAuth scope for the refresh request.
   */
  scope?: string | null;
  /**
   * Updated HTTP Basic authentication parameters for the token endpoint.
   */
  token_endpoint_auth?: ManagedAgentsMCPOAuthRefreshUpdateParamsTokenEndpointAuthUnion | null;
}

export type ManagedAgentsMCPOAuthRefreshUpdateParamsTokenEndpointAuthUnion = ManagedAgentsTokenEndpointAuthBasicUpdateParam | ManagedAgentsTokenEndpointAuthPostUpdateParam;

/**
 * Parameters for updating an MCP OAuth credential. The `mcp_server_url` is
 * immutable.
 */
export interface ManagedAgentsMCPOAuthUpdateParams {
  /**
   * Any of "mcp_oauth".
   */
  type: ManagedAgentsMCPOAuthUpdateParamsType;
  /**
   * Updated OAuth access token.
   */
  access_token?: string | null;
  /**
   * A timestamp in RFC 3339 format
   */
  expires_at?: string | null;
  /**
   * Parameters for updating OAuth refresh token configuration.
   */
  refresh?: ManagedAgentsMCPOAuthRefreshUpdateParams | null;
}

export type ManagedAgentsMCPOAuthUpdateParamsType = "mcp_oauth";

/**
 * The failing step of an MCP validation probe.
 */
export interface ManagedAgentsMCPProbe {
  /**
   * An HTTP response captured during a credential validation probe.
   */
  http_response: ManagedAgentsRefreshHTTPResponse;
  /**
   * The MCP method that failed (for example `initialize` or `tools/list`).
   */
  method: string;
}

/**
 * An HTTP response captured during a credential validation probe.
 */
export interface ManagedAgentsRefreshHTTPResponse {
  /**
   * Response body. May be truncated and has sensitive values scrubbed.
   */
  body: string;
  /**
   * Whether `body` was truncated.
   */
  body_truncated: boolean;
  /**
   * Value of the `Content-Type` response header.
   */
  content_type: string;
  /**
   * HTTP status code.
   */
  status_code: number;
}

/**
 * Outcome of a refresh-token exchange attempted during credential validation.
 */
export interface ManagedAgentsRefreshObject {
  /**
   * An HTTP response captured during a credential validation probe.
   */
  http_response: ManagedAgentsRefreshHTTPResponse | null;
  /**
   * Outcome of a refresh-token exchange attempted during credential validation.
   *
   * Any of "succeeded", "failed", "connect_error", "no_refresh_token".
   */
  status: ManagedAgentsRefreshObjectStatus;
}

/**
 * Outcome of a refresh-token exchange attempted during credential validation.
 */
export type ManagedAgentsRefreshObjectStatus = "succeeded" | "failed" | "connect_error" | "no_refresh_token";

/**
 * Static bearer token credential details for an MCP server.
 */
export interface ManagedAgentsStaticBearerAuthResponse {
  /**
   * URL of the MCP server this credential authenticates against.
   */
  mcp_server_url: string;
  /**
   * Any of "static_bearer".
   */
  type: ManagedAgentsStaticBearerAuthResponseType;
}

export type ManagedAgentsStaticBearerAuthResponseType = "static_bearer";

/**
 * Parameters for creating a static bearer token credential.
 */
export interface ManagedAgentsStaticBearerCreateParams {
  /**
   * Static bearer token value.
   */
  token: string;
  /**
   * URL of the MCP server this credential authenticates against.
   */
  mcp_server_url: string;
  /**
   * Any of "static_bearer".
   */
  type: ManagedAgentsStaticBearerCreateParamsType;
}

export type ManagedAgentsStaticBearerCreateParamsType = "static_bearer";

/**
 * Parameters for updating a static bearer token credential. The `mcp_server_url`
 * is immutable.
 */
export interface ManagedAgentsStaticBearerUpdateParams {
  /**
   * Any of "static_bearer".
   */
  type: ManagedAgentsStaticBearerUpdateParamsType;
  /**
   * Updated static bearer token value.
   */
  token?: string | null;
}

export type ManagedAgentsStaticBearerUpdateParamsType = "static_bearer";

/**
 * Token endpoint uses HTTP Basic authentication with client credentials.
 */
export interface ManagedAgentsTokenEndpointAuthBasicParam {
  /**
   * OAuth client secret.
   */
  client_secret: string;
  /**
   * Any of "client_secret_basic".
   */
  type: ManagedAgentsTokenEndpointAuthBasicParamType;
}

export type ManagedAgentsTokenEndpointAuthBasicParamType = "client_secret_basic";

/**
 * Token endpoint uses HTTP Basic authentication with client credentials.
 */
export interface ManagedAgentsTokenEndpointAuthBasicResponse {
  /**
   * Any of "client_secret_basic".
   */
  type: ManagedAgentsTokenEndpointAuthBasicResponseType;
}

export type ManagedAgentsTokenEndpointAuthBasicResponseType = "client_secret_basic";

/**
 * Updated HTTP Basic authentication parameters for the token endpoint.
 */
export interface ManagedAgentsTokenEndpointAuthBasicUpdateParam {
  /**
   * Any of "client_secret_basic".
   */
  type: ManagedAgentsTokenEndpointAuthBasicUpdateParamType;
  /**
   * Updated OAuth client secret.
   */
  client_secret?: string | null;
}

export type ManagedAgentsTokenEndpointAuthBasicUpdateParamType = "client_secret_basic";

/**
 * Token endpoint requires no client authentication.
 */
export interface ManagedAgentsTokenEndpointAuthNoneParam {
  /**
   * Any of "none".
   */
  type: ManagedAgentsTokenEndpointAuthNoneParamType;
}

export type ManagedAgentsTokenEndpointAuthNoneParamType = "none";

/**
 * Token endpoint requires no client authentication.
 */
export interface ManagedAgentsTokenEndpointAuthNoneResponse {
  /**
   * Any of "none".
   */
  type: ManagedAgentsTokenEndpointAuthNoneResponseType;
}

export type ManagedAgentsTokenEndpointAuthNoneResponseType = "none";

/**
 * Token endpoint uses POST body authentication with client credentials.
 */
export interface ManagedAgentsTokenEndpointAuthPostParam {
  /**
   * OAuth client secret.
   */
  client_secret: string;
  /**
   * Any of "client_secret_post".
   */
  type: ManagedAgentsTokenEndpointAuthPostParamType;
}

export type ManagedAgentsTokenEndpointAuthPostParamType = "client_secret_post";

/**
 * Token endpoint uses POST body authentication with client credentials.
 */
export interface ManagedAgentsTokenEndpointAuthPostResponse {
  /**
   * Any of "client_secret_post".
   */
  type: ManagedAgentsTokenEndpointAuthPostResponseType;
}

export type ManagedAgentsTokenEndpointAuthPostResponseType = "client_secret_post";

/**
 * Updated POST body authentication parameters for the token endpoint.
 */
export interface ManagedAgentsTokenEndpointAuthPostUpdateParam {
  /**
   * Any of "client_secret_post".
   */
  type: ManagedAgentsTokenEndpointAuthPostUpdateParamType;
  /**
   * Updated OAuth client secret.
   */
  client_secret?: string | null;
}

export type ManagedAgentsTokenEndpointAuthPostUpdateParamType = "client_secret_post";

/**
 * Substitute the secret on any host the session's Environment network policy
 * permits egress to. The Environment's network policy is the only boundary on
 * where the secret can reach.
 */
export interface ManagedAgentsUnrestrictedCredentialNetworkingParams {
  /**
   * Any of "unrestricted".
   */
  type: ManagedAgentsUnrestrictedCredentialNetworkingParamsType;
}

export type ManagedAgentsUnrestrictedCredentialNetworkingParamsType = "unrestricted";

/**
 * The secret is substituted on any host the session's Environment network policy
 * permits egress to.
 */
export interface ManagedAgentsUnrestrictedCredentialNetworkingResponse {
  /**
   * Any of "unrestricted".
   */
  type: ManagedAgentsUnrestrictedCredentialNetworkingResponseType;
}

export type ManagedAgentsUnrestrictedCredentialNetworkingResponseType = "unrestricted";

export interface VaultCredentialNewParams {
  /**
   * Authentication details for creating a credential.
   */
  auth: VaultCredentialNewParamsAuthUnion;
  /**
   * Human-readable name for the credential. Up to 255 characters.
   */
  display_name?: string | null;
  workspace_id?: string;
  /**
   * Arbitrary key-value metadata to attach to the credential. Maximum 16 pairs, keys
   * up to 64 chars, values up to 512 chars.
   */
  metadata?: Record<string, string> | null;
  /**
   * Optional header to specify the beta version(s) you want to use.
   */
  betas?: Array<QoderBeta>;
}

export type VaultCredentialNewParamsAuthUnion = ManagedAgentsMCPOAuthCreateParams | ManagedAgentsStaticBearerCreateParams | ManagedAgentsEnvironmentVariableCreateParams;

export interface VaultCredentialGetParams {
  vault_id: string;
  workspace_id?: string;
  /**
   * Optional header to specify the beta version(s) you want to use.
   */
  betas?: Array<QoderBeta>;
}

export interface VaultCredentialUpdateParams {
  vault_id: string;
  /**
   * Updated human-readable name for the credential. 1-255 characters.
   */
  display_name?: string | null;
  workspace_id?: string;
  /**
   * Metadata patch. Set a key to a string to upsert it, or to null to delete it.
   * Omitted keys are preserved.
   */
  metadata?: Record<string, unknown> | null;
  /**
   * Updated authentication details for a credential.
   */
  auth?: VaultCredentialUpdateParamsAuthUnion | null;
  /**
   * Optional header to specify the beta version(s) you want to use.
   */
  betas?: Array<QoderBeta>;
}

export type VaultCredentialUpdateParamsAuthUnion = ManagedAgentsMCPOAuthUpdateParams | ManagedAgentsStaticBearerUpdateParams | ManagedAgentsEnvironmentVariableUpdateParams;

export interface VaultCredentialListParams {
  name?: string;
  before_id?: string;
  after_id?: string;
  /**
   * Whether to include archived credentials in the results.
   */
  include_archived?: boolean;
  /**
   * Maximum number of credentials to return per page. Defaults to 20, maximum 100.
   */
  limit?: number;
  /**
   * Opaque pagination token from a previous `list_credentials` response.
   */
  page?: string;
  workspace_id?: string;
  /**
   * Optional header to specify the beta version(s) you want to use.
   */
  betas?: Array<QoderBeta>;
}

export interface VaultCredentialDeleteParams {
  vault_id: string;
  workspace_id?: string;
  /**
   * Optional header to specify the beta version(s) you want to use.
   */
  betas?: Array<QoderBeta>;
}

export interface VaultCredentialArchiveParams {
  vault_id: string;
  workspace_id?: string;
  /**
   * Optional header to specify the beta version(s) you want to use.
   */
  betas?: Array<QoderBeta>;
}

export interface VaultCredentialMCPOAuthValidateParams {
  vault_id: string;
  workspace_id?: string;
  /**
   * Optional header to specify the beta version(s) you want to use.
   */
  betas?: Array<QoderBeta>;
}

export type AgentCreateParams = AgentNewParams;

export type AgentRetrieveParams = AgentGetParams;

export type DeploymentCreateParams = DeploymentNewParams;

export type DeploymentRetrieveParams = DeploymentGetParams;

export type DeploymentRunRetrieveParams = DeploymentRunGetParams;

export type DreamCreateParams = DreamNewParams;

export type DreamRetrieveParams = DreamGetParams;

export type EnvironmentCreateParams = EnvironmentNewParams;

export type EnvironmentRetrieveParams = EnvironmentGetParams;

export type EnvironmentWorkRetrieveParams = EnvironmentWorkGetParams;

export type MemoryStoreCreateParams = MemoryStoreNewParams;

export type MemoryStoreRetrieveParams = MemoryStoreGetParams;

export type MemoryStoreMemoryCreateParams = MemoryStoreMemoryNewParams;

export type MemoryStoreMemoryRetrieveParams = MemoryStoreMemoryGetParams;

export type MemoryStoreMemoryVersionRetrieveParams = MemoryStoreMemoryVersionGetParams;

export type SessionCreateParams = SessionNewParams;

export type SessionRetrieveParams = SessionGetParams;

export type SessionResourceRetrieveParams = SessionResourceGetParams;

export type SessionThreadRetrieveParams = SessionThreadGetParams;

export type SkillCreateParams = SkillNewParams;

export type SkillRetrieveParams = SkillGetParams;

export type SkillVersionCreateParams = SkillVersionNewParams;

export type SkillVersionRetrieveParams = SkillVersionGetParams;

export type VaultCreateParams = VaultNewParams;

export type VaultRetrieveParams = VaultGetParams;

export type VaultCredentialCreateParams = VaultCredentialNewParams;

export type VaultCredentialRetrieveParams = VaultCredentialGetParams;
