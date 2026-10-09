import { APIResource } from '../../core/resource.js';
import type { RequestOptions } from '../../core/client.js';
import type { APIPromise } from '../../core/api-promise.js';
import type { PagePromise } from '../../core/pagination.js';
import type { DeploymentScopedRunListParams, DeploymentScopedRunRetrieveParams, ManagedAgentsDeploymentRun } from '../types.js';
import { splitParams, pathParam } from '../internal.js';

/** Runs belonging to a specific deployment. */
export class DeploymentScopedRuns extends APIResource {
  list(params: DeploymentScopedRunListParams, options?: RequestOptions): PagePromise<ManagedAgentsDeploymentRun> {
    const request = splitParams(params, options, { workspace_id: 'qoder-workspace-id', betas: 'x-qoder-beta' }, ['deployment_id']);
    return this._client.getAPIList<ManagedAgentsDeploymentRun>(`/deployments/${pathParam(params.deployment_id, 'deployment_id')}/runs`, request.values, request.options, 'page');
  }
  retrieve(runID: string, params: DeploymentScopedRunRetrieveParams, options?: RequestOptions): APIPromise<ManagedAgentsDeploymentRun> {
    const request = splitParams(params, options, { workspace_id: 'qoder-workspace-id', betas: 'x-qoder-beta' }, ['deployment_id']);
    return this._client.request<ManagedAgentsDeploymentRun>({ ...request.options, method: 'GET', path: `/deployments/${pathParam(params.deployment_id, 'deployment_id')}/runs/${pathParam(runID, 'run_id')}` });
  }
}
export type { DeploymentScopedRunListParams, DeploymentScopedRunRetrieveParams } from '../types.js';
