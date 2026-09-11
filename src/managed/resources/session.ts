// Generated code, verified against the API contracts.
import { APIResource } from '../../core/resource.js';
import type { RequestOptions } from '../../core/client.js';
import type { APIPromise } from '../../core/api-promise.js';
import type { PagePromise } from '../../core/pagination.js';
import type { Stream } from '../../core/streaming.js';
import type * as Types from '../types.js';
import { splitParams, pathParam, managedMultipart } from '../internal.js';
import { SessionsEvents } from "./session-event.js";
import { SessionsResources } from "./session-resource.js";
import { SessionsThreads } from "./session-thread.js";

export class Sessions extends APIResource {
  readonly events = new SessionsEvents(this._client);
  readonly resources = new SessionsResources(this._client);
  readonly threads = new SessionsThreads(this._client);

  /**
   * Create Session
   */
  create(params: Types.SessionCreateParams, options?: RequestOptions): APIPromise<Types.ManagedAgentsSession> {
    const request = splitParams(params, options, {"workspace_id": "qoder-workspace-id", "betas": "x-qoder-beta"}, []);
    return this._client.request<Types.ManagedAgentsSession>({ ...request.options, method: "POST", path: "/sessions", body: request.values });
  }

  /**
   * Get Session
   */
  retrieve(sessionID: string, params: Types.SessionRetrieveParams | null | undefined = {}, options?: RequestOptions): APIPromise<Types.ManagedAgentsSession> {
    const request = splitParams(params, options, {"workspace_id": "qoder-workspace-id", "betas": "x-qoder-beta"}, []);
    return this._client.request<Types.ManagedAgentsSession>({ ...request.options, method: "GET", path: `/sessions/${pathParam(sessionID, "session_id")}` });
  }

  /**
   * Update Session
   */
  update(sessionID: string, params: Types.SessionUpdateParams | null | undefined = {}, options?: RequestOptions): APIPromise<Types.ManagedAgentsSession> {
    const request = splitParams(params, options, {"workspace_id": "qoder-workspace-id", "betas": "x-qoder-beta"}, []);
    return this._client.request<Types.ManagedAgentsSession>({ ...request.options, method: "POST", path: `/sessions/${pathParam(sessionID, "session_id")}`, body: request.values });
  }

  /**
   * List Sessions
   */
  list(params: Types.SessionListParams | null | undefined = {}, options?: RequestOptions): PagePromise<Types.ManagedAgentsSession> {
    const request = splitParams(params, options, {"workspace_id": "qoder-workspace-id", "betas": "x-qoder-beta"}, []);
    return this._client.getAPIList<Types.ManagedAgentsSession>("/sessions", request.values, request.options, 'page');
  }

  /**
   * Delete Session
   */
  delete(sessionID: string, params: Types.SessionDeleteParams | null | undefined = {}, options?: RequestOptions): APIPromise<Types.ManagedAgentsDeletedSession> {
    const request = splitParams(params, options, {"workspace_id": "qoder-workspace-id", "betas": "x-qoder-beta"}, []);
    return this._client.request<Types.ManagedAgentsDeletedSession>({ ...request.options, method: "DELETE", path: `/sessions/${pathParam(sessionID, "session_id")}` });
  }

  /**
   * Archive Session
   */
  archive(sessionID: string, params: Types.SessionArchiveParams | null | undefined = {}, options?: RequestOptions): APIPromise<Types.ManagedAgentsSession> {
    const request = splitParams(params, options, {"workspace_id": "qoder-workspace-id", "betas": "x-qoder-beta"}, []);
    return this._client.request<Types.ManagedAgentsSession>({ ...request.options, method: "POST", path: `/sessions/${pathParam(sessionID, "session_id")}/archive` });
  }
}

export default Sessions;
export type { ManagedAgentsAdvisorParams, ManagedAgentsAdvisorParamsType, ManagedAgentsAgentMessagePreview, ManagedAgentsAgentMessagePreviewType, ManagedAgentsAgentParams, ManagedAgentsAgentParamsType, ManagedAgentsAgentThinkingPreview, ManagedAgentsAgentThinkingPreviewType, ManagedAgentsAgentWithOverridesParams, ManagedAgentsAgentWithOverridesParamsType, ManagedAgentsAgentWithOverridesParamsToolUnion, ManagedAgentsBranchCheckout, ManagedAgentsBranchCheckoutType, ManagedAgentsBranchCheckoutParam, ManagedAgentsBudgetLimit, ManagedAgentsBudgetLimitType, ManagedAgentsBudgetLimitParam, ManagedAgentsCacheCreationUsage, ManagedAgentsCommitCheckout, ManagedAgentsCommitCheckoutType, ManagedAgentsCommitCheckoutParam, ManagedAgentsDeletedSession, ManagedAgentsDeletedSessionType, ManagedAgentsDeltaContent, ManagedAgentsDeltaContentType, ManagedAgentsDeltaEvent, ManagedAgentsDeltaEventType, ManagedAgentsDeltaType, ManagedAgentsFileResourceParams, ManagedAgentsFileResourceParamsType, ManagedAgentsGitHubRepositoryResourceParams, ManagedAgentsGitHubRepositoryResourceParamsType, ManagedAgentsGitHubRepositoryResourceParamsCheckoutUnion, ManagedAgentsMemoryStoreResourceParam, ManagedAgentsMemoryStoreResourceParamType, ManagedAgentsMemoryStoreResourceParamAccess, ManagedAgentsMultiagent, ManagedAgentsMultiagentAgentUnion, ManagedAgentsMultiagentType, ManagedAgentsMultiagentParams, ManagedAgentsMultiagentParamsType, ManagedAgentsMultiagentRosterEntryParamsUnion, ManagedAgentsOutcomeEvaluationResource, ManagedAgentsOutcomeEvaluationResourceType, ManagedAgentsServerToolUsage, ManagedAgentsSession, ManagedAgentsSessionStatus, ManagedAgentsSessionType, ManagedAgentsSessionAgent, ManagedAgentsSessionAgentSkillUnion, ManagedAgentsSessionAgentToolUnion, ManagedAgentsSessionAgentToolUnionConfigs, ManagedAgentsSessionAgentToolUnionDefaultConfig, ManagedAgentsSessionAgentToolUnionDefaultConfigPermissionPolicy, ManagedAgentsSessionAgentType, ManagedAgentsSessionAgentUpdateParam, ManagedAgentsSessionAgentUpdateToolUnionParam, ManagedAgentsSessionMultiagentCoordinator, ManagedAgentsSessionMultiagentCoordinatorAgentUnion, ManagedAgentsSessionMultiagentCoordinatorAgentUnionModel, ManagedAgentsSessionMultiagentCoordinatorType, ManagedAgentsSessionStats, ManagedAgentsSessionUpdatedEvent, ManagedAgentsSessionUpdatedEventType, ManagedAgentsSessionUsage, ManagedAgentsSessionUsageEvent, ManagedAgentsSessionUsageEventType, ManagedAgentsStartEvent, ManagedAgentsStartEventType, ManagedAgentsStartEventPreviewUnion, ManagedAgentsSystemContentBlock, ManagedAgentsSystemContentBlockType, ManagedAgentsSystemContentBlockParam, ManagedAgentsSystemMessageEvent, ManagedAgentsSystemMessageEventType, ManagedAgentsUserToolResultEvent, ManagedAgentsUserToolResultEventType, ManagedAgentsUserToolResultEventContentUnion, ManagedAgentsUserToolResultEventContentUnionSource, SessionNewParams, SessionNewParamsAgentUnion, SessionNewParamsInitialEventUnion, SessionNewParamsResourceUnion, SessionGetParams, SessionUpdateParams, SessionListParams, SessionListParamsOrder, SessionDeleteParams, SessionArchiveParams } from '../types.js';
