// Generated from the Go SDK and verified against its API contracts.
import { APIResource } from '../core/resource.js';
import type { RequestOptions } from '../core/client.js';
import type { APIPromise } from '../core/api-promise.js';
import type { PagePromise } from '../core/pagination.js';
import { pathParam, requestHeaders } from './_utils.js';
import type { Batch, BatchCancelParams, BatchCreateParams, BatchFile, BatchListParams } from './types.js';
import { BatchTasks } from './batch-task.js';

export class Batches extends APIResource {
  readonly tasks: BatchTasks = new BatchTasks(this._client);

  /**
   * 列出 Batches.
   *
   * @see Go BatchService.List
   * @operation listBatches
   */
  list(params: BatchListParams = {}, options?: RequestOptions): PagePromise<Batch> {
    const path = "batches";
    return this._client.getAPIList<Batch>(path, params, options, "cursor");
  }

  /**
   * 创建 Batch.
   *
   * @see Go BatchService.New
   * @operation createBatch
   */
  create(params: BatchCreateParams, options?: RequestOptions): APIPromise<Batch> {
    const path = "batches";
    const { idempotency_key, ...payload } = params;
    return this._client.request<Batch>({
      method: "POST",
      path,
      body: payload,
      ...options,
      headers: requestHeaders({ "Idempotency-Key": idempotency_key }, options?.headers),
    });
  }

  /**
   * 查询 Batch 详情.
   *
   * @see Go BatchService.Get
   * @operation getBatch
   */
  retrieve(batchID: string, options?: RequestOptions): APIPromise<Batch> {
    const path = `batches/${pathParam(batchID, "batch_id")}`;
    return this._client.request<Batch>({
      method: "GET",
      path,
      ...options,
    });
  }

  /**
   * 取消 Batch.
   *
   * @see Go BatchService.Cancel
   * @operation cancelBatch
   */
  cancel(batchID: string, params: BatchCancelParams = {}, options?: RequestOptions): APIPromise<Batch> {
    const path = `batches/${pathParam(batchID, "batch_id")}/cancel`;
    const { idempotency_key, ...payload } = params;
    return this._client.request<Batch>({
      method: "POST",
      path,
      ...options,
      headers: requestHeaders({ "Idempotency-Key": idempotency_key }, options?.headers),
    });
  }

  /**
   * 获取错误文件.
   *
   * @see Go BatchService.GetError
   * @operation getBatchError
   */
  getError(batchID: string, options?: RequestOptions): APIPromise<BatchFile> {
    const path = `batches/${pathParam(batchID, "batch_id")}/error`;
    return this._client.request<BatchFile>({
      method: "GET",
      path,
      ...options,
    });
  }

  /**
   * 获取输出文件.
   *
   * @see Go BatchService.GetOutput
   * @operation getBatchOutput
   */
  getOutput(batchID: string, options?: RequestOptions): APIPromise<BatchFile> {
    const path = `batches/${pathParam(batchID, "batch_id")}/output`;
    return this._client.request<BatchFile>({
      method: "GET",
      path,
      ...options,
    });
  }

}

export type { Batch, BatchCancelParams, BatchCreateParams, BatchFile, BatchListParams } from './types.js';
