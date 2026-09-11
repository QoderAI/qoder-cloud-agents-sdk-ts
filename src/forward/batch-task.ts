// Generated from the Go SDK and verified against its API contracts.
import { APIResource } from '../core/resource.js';
import type { RequestOptions } from '../core/client.js';
import type { APIPromise } from '../core/api-promise.js';
import type { PagePromise } from '../core/pagination.js';
import { pathParam, requestHeaders } from './_utils.js';
import type { BatchTask, BatchTaskListParams } from './types.js';

export class BatchTasks extends APIResource {
  /**
   * 查询 Batch 子任务.
   *
   * @see Go BatchTaskService.List
   * @operation listBatchTasks
   */
  list(batchID: string, params: BatchTaskListParams = {}, options?: RequestOptions): PagePromise<BatchTask> {
    const path = `batches/${pathParam(batchID, "batch_id")}/tasks`;
    return this._client.getAPIList<BatchTask>(path, params, options, "cursor");
  }

}

export type { BatchTask, BatchTaskListParams } from './types.js';
