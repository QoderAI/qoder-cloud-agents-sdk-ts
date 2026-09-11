// Generated from qoder-cloud-agents-sdk-go/managed.
import { APIResource } from '../../core/resource.js';
import type { RequestOptions } from '../../core/client.js';
import type { APIPromise } from '../../core/api-promise.js';
import type { PagePromise } from '../../core/pagination.js';
import type { Stream } from '../../core/streaming.js';
import type * as Types from '../types.js';
import { splitParams, pathParam, managedMultipart } from '../internal.js';
import { AgentsVersions } from "./agent-version.js";

export class Agents extends APIResource {
  readonly versions = new AgentsVersions(this._client);

  /**
   * Create Agent
   */
  create(params: Types.AgentCreateParams, options?: RequestOptions): APIPromise<Types.ManagedAgentsAgent> {
    const request = splitParams(params, options, {"workspace_id": "qoder-workspace-id", "betas": "x-qoder-beta"}, []);
    return this._client.request<Types.ManagedAgentsAgent>({ ...request.options, method: "POST", path: "/agents", body: request.values });
  }

  /**
   * Get Agent
   */
  retrieve(agentID: string, params: Types.AgentRetrieveParams | null | undefined = {}, options?: RequestOptions): APIPromise<Types.ManagedAgentsAgent> {
    const request = splitParams(params, options, {"workspace_id": "qoder-workspace-id", "betas": "x-qoder-beta"}, []);
    return this._client.request<Types.ManagedAgentsAgent>({ ...request.options, method: "GET", path: `/agents/${pathParam(agentID, "agent_id")}`, query: request.values });
  }

  /**
   * Update Agent
   */
  update(agentID: string, params: Types.AgentUpdateParams | null | undefined = {}, options?: RequestOptions): APIPromise<Types.ManagedAgentsAgent> {
    const request = splitParams(params, options, {"workspace_id": "qoder-workspace-id", "betas": "x-qoder-beta"}, []);
    return this._client.request<Types.ManagedAgentsAgent>({ ...request.options, method: "POST", path: `/agents/${pathParam(agentID, "agent_id")}`, body: request.values });
  }

  /**
   * List Agents
   */
  list(params: Types.AgentListParams | null | undefined = {}, options?: RequestOptions): PagePromise<Types.ManagedAgentsAgent> {
    const request = splitParams(params, options, {"workspace_id": "qoder-workspace-id", "betas": "x-qoder-beta"}, []);
    return this._client.getAPIList<Types.ManagedAgentsAgent>("/agents", request.values, request.options, 'page');
  }

  /**
   * Archive Agent
   */
  archive(agentID: string, params: Types.AgentArchiveParams | null | undefined = {}, options?: RequestOptions): APIPromise<Types.ManagedAgentsAgent> {
    const request = splitParams(params, options, {"workspace_id": "qoder-workspace-id", "betas": "x-qoder-beta"}, []);
    return this._client.request<Types.ManagedAgentsAgent>({ ...request.options, method: "POST", path: `/agents/${pathParam(agentID, "agent_id")}/archive` });
  }
}

export default Agents;
export type { ManagedAgentsAdvisor, ManagedAgentsAdvisorType, ManagedAgentsAgent, ManagedAgentsAgentSkillUnion, ManagedAgentsAgentToolUnion, ManagedAgentsAgentToolUnionConfigs, ManagedAgentsAgentToolUnionDefaultConfig, ManagedAgentsAgentToolUnionDefaultConfigPermissionPolicy, ManagedAgentsAgentType, ManagedAgentsAgentReference, ManagedAgentsAgentReferenceType, ManagedAgentsAgentToolConfigUnion, ManagedAgentsAgentToolConfigUnionPermissionPolicy, ManagedAgentsAgentToolConfigParamsUnion, ManagedAgentsAgentToolsetDefaultConfig, ManagedAgentsAgentToolsetDefaultConfigPermissionPolicyUnion, ManagedAgentsAgentToolsetDefaultConfigParams, ManagedAgentsAgentToolsetDefaultConfigParamsPermissionPolicyUnion, ManagedAgentsAgentToolset20260401, ManagedAgentsAgentToolset20260401Type, ManagedAgentsAgentToolset20260401BashInput, ManagedAgentsAgentToolset20260401EditInput, ManagedAgentsAgentToolset20260401GlobInput, ManagedAgentsAgentToolset20260401GrepInput, ManagedAgentsAgentToolset20260401Params, ManagedAgentsAgentToolset20260401ParamsType, ManagedAgentsAgentToolset20260401ReadInput, ManagedAgentsAgentToolset20260401WriteInput, ManagedAgentsAlwaysAllowPolicy, ManagedAgentsAlwaysAllowPolicyType, ManagedAgentsAlwaysAllowPolicyParam, ManagedAgentsAlwaysAskPolicy, ManagedAgentsAlwaysAskPolicyType, ManagedAgentsAlwaysAskPolicyParam, ManagedAgentsQoderSkill, ManagedAgentsQoderSkillType, ManagedAgentsQoderSkillParams, ManagedAgentsQoderSkillParamsType, ManagedAgentsBashToolConfig, ManagedAgentsBashToolConfigPermissionPolicyUnion, ManagedAgentsBashToolConfigParams, ManagedAgentsBashToolConfigParamsPermissionPolicyUnion, ManagedAgentsBashToolConfigParamsType, ManagedAgentsCustomSkill, ManagedAgentsCustomSkillType, ManagedAgentsCustomSkillParams, ManagedAgentsCustomSkillParamsType, ManagedAgentsCustomTool, ManagedAgentsCustomToolType, ManagedAgentsCustomToolInputSchema, ManagedAgentsCustomToolInputSchemaParam, ManagedAgentsCustomToolParams, ManagedAgentsCustomToolParamsType, ManagedAgentsEditToolConfig, ManagedAgentsEditToolConfigPermissionPolicyUnion, ManagedAgentsEditToolConfigParams, ManagedAgentsEditToolConfigParamsPermissionPolicyUnion, ManagedAgentsEditToolConfigParamsType, ManagedAgentsEffortHigh, ManagedAgentsEffortHighType, ManagedAgentsEffortHighParam, ManagedAgentsEffortLow, ManagedAgentsEffortLowType, ManagedAgentsEffortLowParam, ManagedAgentsEffortMax, ManagedAgentsEffortMaxType, ManagedAgentsEffortMaxParam, ManagedAgentsEffortMedium, ManagedAgentsEffortMediumType, ManagedAgentsEffortMediumParam, ManagedAgentsEffortXhigh, ManagedAgentsEffortXhighType, ManagedAgentsEffortXhighParam, ManagedAgentsGlobToolConfig, ManagedAgentsGlobToolConfigPermissionPolicyUnion, ManagedAgentsGlobToolConfigParams, ManagedAgentsGlobToolConfigParamsPermissionPolicyUnion, ManagedAgentsGlobToolConfigParamsType, ManagedAgentsGrepToolConfig, ManagedAgentsGrepToolConfigPermissionPolicyUnion, ManagedAgentsGrepToolConfigParams, ManagedAgentsGrepToolConfigParamsPermissionPolicyUnion, ManagedAgentsGrepToolConfigParamsType, ManagedAgentsMCPServerURLDefinition, ManagedAgentsMCPServerURLDefinitionType, ManagedAgentsMCPToolConfig, ManagedAgentsMCPToolConfigPermissionPolicyUnion, ManagedAgentsMCPToolConfigParams, ManagedAgentsMCPToolConfigParamsPermissionPolicyUnion, ManagedAgentsMCPToolset, ManagedAgentsMCPToolsetType, ManagedAgentsMCPToolsetDefaultConfig, ManagedAgentsMCPToolsetDefaultConfigPermissionPolicyUnion, ManagedAgentsMCPToolsetDefaultConfigParams, ManagedAgentsMCPToolsetDefaultConfigParamsPermissionPolicyUnion, ManagedAgentsMCPToolsetParams, ManagedAgentsMCPToolsetParamsType, ManagedAgentsModel, ManagedAgentsModelConfig, ManagedAgentsModelConfigEffortUnion, ManagedAgentsModelConfigSpeed, ManagedAgentsModelConfigParams, ManagedAgentsModelConfigParamsEffortUnion, ManagedAgentsModelConfigParamsEffortManagedAgentsEffortLevel, ManagedAgentsModelConfigParamsSpeed, ManagedAgentsMultiagentSelfParams, ManagedAgentsMultiagentSelfParamsType, ManagedAgentsReadToolConfig, ManagedAgentsReadToolConfigPermissionPolicyUnion, ManagedAgentsReadToolConfigParams, ManagedAgentsReadToolConfigParamsPermissionPolicyUnion, ManagedAgentsReadToolConfigParamsType, ManagedAgentsSessionThreadAgent, ManagedAgentsSessionThreadAgentSkillUnion, ManagedAgentsSessionThreadAgentToolUnion, ManagedAgentsSessionThreadAgentToolUnionConfigs, ManagedAgentsSessionThreadAgentToolUnionDefaultConfig, ManagedAgentsSessionThreadAgentToolUnionDefaultConfigPermissionPolicy, ManagedAgentsSessionThreadAgentType, ManagedAgentsSkillParamsUnion, ManagedAgentsURLMCPServerParams, ManagedAgentsURLMCPServerParamsType, ManagedAgentsUserLocation, ManagedAgentsUserLocationParam, ManagedAgentsWebFetchToolConfig, ManagedAgentsWebFetchToolConfigPermissionPolicyUnion, ManagedAgentsWebFetchToolConfigParams, ManagedAgentsWebFetchToolConfigParamsPermissionPolicyUnion, ManagedAgentsWebFetchToolConfigParamsType, ManagedAgentsWebSearchToolConfig, ManagedAgentsWebSearchToolConfigPermissionPolicyUnion, ManagedAgentsWebSearchToolConfigParams, ManagedAgentsWebSearchToolConfigParamsPermissionPolicyUnion, ManagedAgentsWebSearchToolConfigParamsType, ManagedAgentsWriteToolConfig, ManagedAgentsWriteToolConfigPermissionPolicyUnion, ManagedAgentsWriteToolConfigParams, ManagedAgentsWriteToolConfigParamsPermissionPolicyUnion, ManagedAgentsWriteToolConfigParamsType, AgentNewParams, AgentNewParamsToolUnion, AgentGetParams, AgentUpdateParams, AgentUpdateParamsToolUnion, AgentListParams, AgentArchiveParams } from '../types.js';
