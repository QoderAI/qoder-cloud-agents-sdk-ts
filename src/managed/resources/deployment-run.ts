// Generated from qoder-cloud-agents-sdk-go/managed.
import { APIResource } from '../../core/resource.js';
import type { RequestOptions } from '../../core/client.js';
import type { APIPromise } from '../../core/api-promise.js';
import type { PagePromise } from '../../core/pagination.js';
import type { Stream } from '../../core/streaming.js';
import type * as Types from '../types.js';
import { splitParams, pathParam, managedMultipart } from '../internal.js';

export class DeploymentRuns extends APIResource {

  /**
   * Get Deployment Run
   */
  retrieve(deploymentRunID: string, params: Types.DeploymentRunRetrieveParams | null | undefined = {}, options?: RequestOptions): APIPromise<Types.ManagedAgentsDeploymentRun> {
    const request = splitParams(params, options, {"workspace_id": "qoder-workspace-id", "betas": "x-qoder-beta"}, []);
    return this._client.request<Types.ManagedAgentsDeploymentRun>({ ...request.options, method: "GET", path: `/deployment_runs/${pathParam(deploymentRunID, "deployment_run_id")}` });
  }

  /**
   * List Deployment Runs
   */
  list(params: Types.DeploymentRunListParams | null | undefined = {}, options?: RequestOptions): PagePromise<Types.ManagedAgentsDeploymentRun> {
    const request = splitParams(params, options, {"workspace_id": "qoder-workspace-id", "betas": "x-qoder-beta"}, []);
    return this._client.getAPIList<Types.ManagedAgentsDeploymentRun>("/deployment_runs", request.values, request.options, 'page');
  }
}

export default DeploymentRuns;
export type { ManagedAgentsAgentArchivedRunError, ManagedAgentsAgentArchivedRunErrorType, ManagedAgentsDeploymentRun, ManagedAgentsDeploymentRunErrorUnion, ManagedAgentsDeploymentRunType, ManagedAgentsEnvironmentArchivedRunError, ManagedAgentsEnvironmentArchivedRunErrorType, ManagedAgentsEnvironmentNotFoundRunError, ManagedAgentsEnvironmentNotFoundRunErrorType, ManagedAgentsFileNotFoundRunError, ManagedAgentsFileNotFoundRunErrorType, ManagedAgentsManualTriggerContext, ManagedAgentsManualTriggerContextType, ManagedAgentsMCPEgressBlockedRunError, ManagedAgentsMCPEgressBlockedRunErrorType, ManagedAgentsMemoryStoreArchivedRunError, ManagedAgentsMemoryStoreArchivedRunErrorType, ManagedAgentsOrganizationDisabledRunError, ManagedAgentsOrganizationDisabledRunErrorType, ManagedAgentsScheduleTriggerContext, ManagedAgentsScheduleTriggerContextType, ManagedAgentsSelfHostedResourcesUnsupportedRunError, ManagedAgentsSelfHostedResourcesUnsupportedRunErrorType, ManagedAgentsSessionCreationRejectedRunError, ManagedAgentsSessionCreationRejectedRunErrorType, ManagedAgentsSessionRateLimitedRunError, ManagedAgentsSessionRateLimitedRunErrorType, ManagedAgentsSessionResourceNotFoundRunError, ManagedAgentsSessionResourceNotFoundRunErrorType, ManagedAgentsSkillNotFoundRunError, ManagedAgentsSkillNotFoundRunErrorType, ManagedAgentsTriggerContextUnion, ManagedAgentsTriggerType, ManagedAgentsUnknownRunError, ManagedAgentsUnknownRunErrorType, ManagedAgentsVaultArchivedRunError, ManagedAgentsVaultArchivedRunErrorType, ManagedAgentsVaultNotFoundRunError, ManagedAgentsVaultNotFoundRunErrorType, ManagedAgentsWorkspaceArchivedRunError, ManagedAgentsWorkspaceArchivedRunErrorType, DeploymentRunGetParams, DeploymentRunListParams } from '../types.js';
