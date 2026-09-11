// Generated from qoder-cloud-agents-sdk-go/managed.
import { APIResource } from '../../core/resource.js';
import type { RequestOptions } from '../../core/client.js';
import type { APIPromise } from '../../core/api-promise.js';
import type { PagePromise } from '../../core/pagination.js';
import type { Stream } from '../../core/streaming.js';
import type * as Types from '../types.js';
import { splitParams, pathParam, managedMultipart } from '../internal.js';

export class AgentsVersions extends APIResource {

  /**
   * List Agent Versions
   */
  list(agentID: string, params: Types.AgentVersionListParams | null | undefined = {}, options?: RequestOptions): PagePromise<Types.ManagedAgentsAgent> {
    const request = splitParams(params, options, {"workspace_id": "qoder-workspace-id", "betas": "x-qoder-beta"}, []);
    return this._client.getAPIList<Types.ManagedAgentsAgent>(`/agents/${pathParam(agentID, "agent_id")}/versions`, request.values, request.options, 'page');
  }
}

export default AgentsVersions;
export type { AgentVersionListParams } from '../types.js';
