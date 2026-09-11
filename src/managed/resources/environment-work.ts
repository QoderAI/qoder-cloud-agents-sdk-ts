// Generated from qoder-cloud-agents-sdk-go/managed.
import { APIResource } from '../../core/resource.js';
import type { RequestOptions } from '../../core/client.js';
import type { APIPromise } from '../../core/api-promise.js';
import type { PagePromise } from '../../core/pagination.js';
import type { Stream } from '../../core/streaming.js';
import type * as Types from '../types.js';
import { splitParams, pathParam, managedMultipart } from '../internal.js';

export class EnvironmentsWork extends APIResource {

  /**
   * Note: these endpoints are called automatically by the pre-built environment
   * worker provided in the SDKs and CLI, for orchestrating sessions with self-hosted
   * sandbox environments. They are included here as a reference; you do not need to
   * invoke them directly.
   *
   * Retrieve detailed information about a specific work item.
   */
  retrieve(workID: string, params: Types.EnvironmentWorkRetrieveParams, options?: RequestOptions): APIPromise<Types.SelfHostedWork> {
    const request = splitParams(params, options, {"workspace_id": "qoder-workspace-id", "betas": "x-qoder-beta"}, ["environment_id"]);
    return this._client.request<Types.SelfHostedWork>({ ...request.options, method: "GET", path: `/environments/${pathParam(params?.environment_id, "environment_id")}/work/${pathParam(workID, "work_id")}` });
  }

  /**
   * Note: these endpoints are called automatically by the pre-built environment
   * worker provided in the SDKs and CLI, for orchestrating sessions with self-hosted
   * sandbox environments. They are included here as a reference; you do not need to
   * invoke them directly.
   *
   * Update work item metadata with merge semantics.
   */
  update(workID: string, params: Types.EnvironmentWorkUpdateParams, options?: RequestOptions): APIPromise<Types.SelfHostedWork> {
    const request = splitParams(params, options, {"workspace_id": "qoder-workspace-id", "betas": "x-qoder-beta"}, ["environment_id"]);
    return this._client.request<Types.SelfHostedWork>({ ...request.options, method: "POST", path: `/environments/${pathParam(params?.environment_id, "environment_id")}/work/${pathParam(workID, "work_id")}`, body: request.values });
  }

  /**
   * Note: these endpoints are called automatically by the pre-built environment
   * worker provided in the SDKs and CLI, for orchestrating sessions with self-hosted
   * sandbox environments. They are included here as a reference; you do not need to
   * invoke them directly.
   *
   * List work items in an environment.
   */
  list(environmentID: string, params: Types.EnvironmentWorkListParams | null | undefined = {}, options?: RequestOptions): PagePromise<Types.SelfHostedWork> {
    const request = splitParams(params, options, {"betas": "x-qoder-beta"}, []);
    return this._client.getAPIList<Types.SelfHostedWork>(`/environments/${pathParam(environmentID, "environment_id")}/work`, request.values, request.options, 'page');
  }

  /**
   * Note: these endpoints are called automatically by the pre-built environment
   * worker provided in the SDKs and CLI, for orchestrating sessions with self-hosted
   * sandbox environments. They are included here as a reference; you do not need to
   * invoke them directly.
   *
   * Acknowledge receipt of a work item, transitioning it from 'queued' to 'starting'
   * and removing it from the queue.
   */
  ack(workID: string, params: Types.EnvironmentWorkAckParams, options?: RequestOptions): APIPromise<Types.SelfHostedWork> {
    const request = splitParams(params, options, {"betas": "x-qoder-beta"}, ["environment_id"]);
    return this._client.request<Types.SelfHostedWork>({ ...request.options, method: "POST", path: `/environments/${pathParam(params?.environment_id, "environment_id")}/work/${pathParam(workID, "work_id")}/ack` });
  }

  /**
   * Note: these endpoints are called automatically by the pre-built environment
   * worker provided in the SDKs and CLI, for orchestrating sessions with self-hosted
   * sandbox environments. They are included here as a reference; you do not need to
   * invoke them directly.
   *
   * Record a heartbeat for a work item to maintain the lease.
   */
  heartbeat(workID: string, params: Types.EnvironmentWorkHeartbeatParams, options?: RequestOptions): APIPromise<Types.SelfHostedWorkHeartbeatResponse> {
    const request = splitParams(params, options, {"betas": "x-qoder-beta"}, ["environment_id"]);
    return this._client.request<Types.SelfHostedWorkHeartbeatResponse>({ ...request.options, method: "POST", path: `/environments/${pathParam(params?.environment_id, "environment_id")}/work/${pathParam(workID, "work_id")}/heartbeat`, body: request.values });
  }

  /**
   * Note: these endpoints are called automatically by the pre-built environment
   * worker provided in the SDKs and CLI, for orchestrating sessions with self-hosted
   * sandbox environments. They are included here as a reference; you do not need to
   * invoke them directly.
   *
   * Long poll for work items in the queue.
   */
  poll(environmentID: string, params: Types.EnvironmentWorkPollParams | null | undefined = {}, options?: RequestOptions): APIPromise<Types.SelfHostedWork> {
    const request = splitParams(params, options, {"qoder_worker_id": "Worker-ID", "betas": "x-qoder-beta"}, []);
    return this._client.request<Types.SelfHostedWork>({ ...request.options, method: "GET", path: `/environments/${pathParam(environmentID, "environment_id")}/work/poll`, query: request.values });
  }

  /**
   * Get statistics about the work queue for an environment.
   */
  stats(environmentID: string, params: Types.EnvironmentWorkStatsParams | null | undefined = {}, options?: RequestOptions): APIPromise<Types.SelfHostedWorkQueueStats> {
    const request = splitParams(params, options, {"workspace_id": "qoder-workspace-id", "betas": "x-qoder-beta"}, []);
    return this._client.request<Types.SelfHostedWorkQueueStats>({ ...request.options, method: "GET", path: `/environments/${pathParam(environmentID, "environment_id")}/work/stats` });
  }

  /**
   * Note: these endpoints are called automatically by the pre-built environment
   * worker provided in the SDKs and CLI, for orchestrating sessions with self-hosted
   * sandbox environments. They are included here as a reference; you do not need to
   * invoke them directly.
   *
   * Stop a work item, initiating graceful or forced shutdown.
   */
  stop(workID: string, params: Types.EnvironmentWorkStopParams, options?: RequestOptions): APIPromise<Types.SelfHostedWork> {
    const request = splitParams(params, options, {"workspace_id": "qoder-workspace-id", "betas": "x-qoder-beta"}, ["environment_id"]);
    return this._client.request<Types.SelfHostedWork>({ ...request.options, method: "POST", path: `/environments/${pathParam(params?.environment_id, "environment_id")}/work/${pathParam(workID, "work_id")}/stop`, body: request.values });
  }
}

export default EnvironmentsWork;
export type { HealthCheckWorkData, HealthCheckWorkDataType, SelfHostedWork, SelfHostedWorkState, SelfHostedWorkHeartbeatResponse, SelfHostedWorkHeartbeatResponseState, SelfHostedWorkListResponse, SelfHostedWorkQueueStats, SelfHostedWorkStopRequestParam, SelfHostedWorkUpdateRequestParam, SessionWorkData, EnvironmentWorkGetParams, EnvironmentWorkUpdateParams, EnvironmentWorkListParams, EnvironmentWorkAckParams, EnvironmentWorkHeartbeatParams, EnvironmentWorkPollParams, EnvironmentWorkStatsParams, EnvironmentWorkStopParams } from '../types.js';
