// Generated from qoder-cloud-agents-sdk-go/managed.
import { APIResource } from '../../core/resource.js';
import type { RequestOptions } from '../../core/client.js';
import type { APIPromise } from '../../core/api-promise.js';
import type { PagePromise } from '../../core/pagination.js';
import type { Stream } from '../../core/streaming.js';
import type * as Types from '../types.js';
import { splitParams, pathParam, managedMultipart } from '../internal.js';

export class Deployments extends APIResource {

  /**
   * Create Deployment
   */
  create(params: Types.DeploymentCreateParams, options?: RequestOptions): APIPromise<Types.ManagedAgentsDeployment> {
    const request = splitParams(params, options, {"workspace_id": "qoder-workspace-id", "betas": "x-qoder-beta"}, []);
    return this._client.request<Types.ManagedAgentsDeployment>({ ...request.options, method: "POST", path: "/deployments", body: request.values });
  }

  /**
   * Get Deployment
   */
  retrieve(deploymentID: string, params: Types.DeploymentRetrieveParams | null | undefined = {}, options?: RequestOptions): APIPromise<Types.ManagedAgentsDeployment> {
    const request = splitParams(params, options, {"workspace_id": "qoder-workspace-id", "betas": "x-qoder-beta"}, []);
    return this._client.request<Types.ManagedAgentsDeployment>({ ...request.options, method: "GET", path: `/deployments/${pathParam(deploymentID, "deployment_id")}` });
  }

  /**
   * Update Deployment
   */
  update(deploymentID: string, params: Types.DeploymentUpdateParams | null | undefined = {}, options?: RequestOptions): APIPromise<Types.ManagedAgentsDeployment> {
    const request = splitParams(params, options, {"workspace_id": "qoder-workspace-id", "betas": "x-qoder-beta"}, []);
    return this._client.request<Types.ManagedAgentsDeployment>({ ...request.options, method: "POST", path: `/deployments/${pathParam(deploymentID, "deployment_id")}`, body: request.values });
  }

  /**
   * List Deployments
   */
  list(params: Types.DeploymentListParams | null | undefined = {}, options?: RequestOptions): PagePromise<Types.ManagedAgentsDeployment> {
    const request = splitParams(params, options, {"workspace_id": "qoder-workspace-id", "betas": "x-qoder-beta"}, []);
    return this._client.getAPIList<Types.ManagedAgentsDeployment>("/deployments", request.values, request.options, 'page');
  }

  /**
   * Archive Deployment
   */
  archive(deploymentID: string, params: Types.DeploymentArchiveParams | null | undefined = {}, options?: RequestOptions): APIPromise<Types.ManagedAgentsDeployment> {
    const request = splitParams(params, options, {"workspace_id": "qoder-workspace-id", "betas": "x-qoder-beta"}, []);
    return this._client.request<Types.ManagedAgentsDeployment>({ ...request.options, method: "POST", path: `/deployments/${pathParam(deploymentID, "deployment_id")}/archive` });
  }

  /**
   * Pause Deployment
   */
  pause(deploymentID: string, params: Types.DeploymentPauseParams | null | undefined = {}, options?: RequestOptions): APIPromise<Types.ManagedAgentsDeployment> {
    const request = splitParams(params, options, {"workspace_id": "qoder-workspace-id", "betas": "x-qoder-beta"}, []);
    return this._client.request<Types.ManagedAgentsDeployment>({ ...request.options, method: "POST", path: `/deployments/${pathParam(deploymentID, "deployment_id")}/pause` });
  }

  /**
   * Run Deployment Now
   */
  run(deploymentID: string, params: Types.DeploymentRunParams | null | undefined = {}, options?: RequestOptions): APIPromise<Types.ManagedAgentsDeploymentRun> {
    const request = splitParams(params, options, {"workspace_id": "qoder-workspace-id", "betas": "x-qoder-beta"}, []);
    return this._client.request<Types.ManagedAgentsDeploymentRun>({ ...request.options, method: "POST", path: `/deployments/${pathParam(deploymentID, "deployment_id")}/run` });
  }

  /**
   * Unpause Deployment
   */
  unpause(deploymentID: string, params: Types.DeploymentUnpauseParams | null | undefined = {}, options?: RequestOptions): APIPromise<Types.ManagedAgentsDeployment> {
    const request = splitParams(params, options, {"workspace_id": "qoder-workspace-id", "betas": "x-qoder-beta"}, []);
    return this._client.request<Types.ManagedAgentsDeployment>({ ...request.options, method: "POST", path: `/deployments/${pathParam(deploymentID, "deployment_id")}/unpause` });
  }
}

export default Deployments;
export type { ManagedAgentsAgentArchivedDeploymentPausedReasonError, ManagedAgentsAgentArchivedDeploymentPausedReasonErrorType, ManagedAgentsDeployment, ManagedAgentsDeploymentType, ManagedAgentsDeploymentInitialEventUnion, ManagedAgentsDeploymentInitialEventUnionContent, ManagedAgentsDeploymentInitialEventParamsUnion, ManagedAgentsDeploymentPausedReasonUnion, ManagedAgentsDeploymentPausedReasonErrorUnion, ManagedAgentsDeploymentStatus, ManagedAgentsDeploymentSystemMessageEvent, ManagedAgentsDeploymentSystemMessageEventType, ManagedAgentsDeploymentUserDefineOutcomeEvent, ManagedAgentsDeploymentUserDefineOutcomeEventRubricUnion, ManagedAgentsDeploymentUserDefineOutcomeEventType, ManagedAgentsDeploymentUserMessageEvent, ManagedAgentsDeploymentUserMessageEventContentUnion, ManagedAgentsDeploymentUserMessageEventContentUnionSource, ManagedAgentsDeploymentUserMessageEventType, ManagedAgentsEnvironmentArchivedDeploymentPausedReasonError, ManagedAgentsEnvironmentArchivedDeploymentPausedReasonErrorType, ManagedAgentsEnvironmentNotFoundDeploymentPausedReasonError, ManagedAgentsEnvironmentNotFoundDeploymentPausedReasonErrorType, ManagedAgentsErrorDeploymentPausedReason, ManagedAgentsErrorDeploymentPausedReasonType, ManagedAgentsFileNotFoundDeploymentPausedReasonError, ManagedAgentsFileNotFoundDeploymentPausedReasonErrorType, ManagedAgentsFileResourceConfig, ManagedAgentsFileResourceConfigType, ManagedAgentsGitHubRepositoryResourceConfig, ManagedAgentsGitHubRepositoryResourceConfigType, ManagedAgentsGitHubRepositoryResourceConfigCheckoutUnion, ManagedAgentsManualDeploymentPausedReason, ManagedAgentsManualDeploymentPausedReasonType, ManagedAgentsMCPEgressBlockedDeploymentPausedReasonError, ManagedAgentsMCPEgressBlockedDeploymentPausedReasonErrorType, ManagedAgentsMemoryStoreArchivedDeploymentPausedReasonError, ManagedAgentsMemoryStoreArchivedDeploymentPausedReasonErrorType, ManagedAgentsMemoryStoreResourceConfig, ManagedAgentsMemoryStoreResourceConfigType, ManagedAgentsMemoryStoreResourceConfigAccess, ManagedAgentsOrganizationDisabledDeploymentPausedReasonError, ManagedAgentsOrganizationDisabledDeploymentPausedReasonErrorType, ManagedAgentsSchedule, ManagedAgentsScheduleType, ManagedAgentsScheduleParams, ManagedAgentsScheduleParamsType, ManagedAgentsSelfHostedResourcesUnsupportedDeploymentPausedReasonError, ManagedAgentsSelfHostedResourcesUnsupportedDeploymentPausedReasonErrorType, ManagedAgentsSessionResourceConfigUnion, ManagedAgentsSessionResourceNotFoundDeploymentPausedReasonError, ManagedAgentsSessionResourceNotFoundDeploymentPausedReasonErrorType, ManagedAgentsSkillNotFoundDeploymentPausedReasonError, ManagedAgentsSkillNotFoundDeploymentPausedReasonErrorType, ManagedAgentsUnknownDeploymentPausedReasonError, ManagedAgentsUnknownDeploymentPausedReasonErrorType, ManagedAgentsVaultArchivedDeploymentPausedReasonError, ManagedAgentsVaultArchivedDeploymentPausedReasonErrorType, ManagedAgentsVaultNotFoundDeploymentPausedReasonError, ManagedAgentsVaultNotFoundDeploymentPausedReasonErrorType, ManagedAgentsWorkspaceArchivedDeploymentPausedReasonError, ManagedAgentsWorkspaceArchivedDeploymentPausedReasonErrorType, DeploymentNewParams, DeploymentNewParamsAgentUnion, DeploymentNewParamsResourceUnion, DeploymentGetParams, DeploymentUpdateParams, DeploymentUpdateParamsAgentUnion, DeploymentUpdateParamsResourceUnion, DeploymentListParams, DeploymentArchiveParams, DeploymentPauseParams, DeploymentRunParams, DeploymentUnpauseParams } from '../types.js';
