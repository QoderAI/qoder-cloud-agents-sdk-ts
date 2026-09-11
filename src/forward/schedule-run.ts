// Generated code, verified against the API contracts.
import { APIResource } from '../core/resource.js';
import type { RequestOptions } from '../core/client.js';
import type { APIPromise } from '../core/api-promise.js';
import type { PagePromise } from '../core/pagination.js';
import { pathParam, requestHeaders } from './_utils.js';
import type { ScheduleRun, ScheduleRunListParams, ScheduleRunRetrieveParams } from './types.js';

export class ScheduleRuns extends APIResource {
  /**
   * 列出 Schedule Runs.
   *
   * @operation listScheduleRuns
   */
  list(params: ScheduleRunListParams, options?: RequestOptions): PagePromise<ScheduleRun> {
    const path = "schedule_runs";
    return this._client.getAPIList<ScheduleRun>(path, params, options, "cursor");
  }

  /**
   * 获取 Schedule Run.
   *
   * @operation getScheduleRun
   */
  retrieve(
    runID: string,
    params: ScheduleRunRetrieveParams = {},
    options?: RequestOptions,
  ): APIPromise<ScheduleRun> {
    const path = `schedule_runs/${pathParam(runID, "run_id")}`;
    return this._client.request<ScheduleRun>({
      method: "GET",
      path,
      query: params,
      ...options,
    });
  }

}

export type { ScheduleRun, ScheduleRunListParams, ScheduleRunRetrieveParams } from './types.js';
