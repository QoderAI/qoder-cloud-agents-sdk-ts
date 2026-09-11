// Generated code, verified against the API contracts.
import { APIResource } from '../core/resource.js';
import type { RequestOptions } from '../core/client.js';
import type { APIPromise } from '../core/api-promise.js';
import type { PagePromise } from '../core/pagination.js';
import { pathParam, requestHeaders } from './_utils.js';
import type { Schedule, ScheduleArchiveManyParams, ScheduleArchiveManyResponse, ScheduleArchiveParams, ScheduleCreateParams, ScheduleListParams, SchedulePauseParams, ScheduleRun, ScheduleRunParams, ScheduleUnpauseParams, ScheduleUpdateParams } from './types.js';

export class Schedules extends APIResource {
  /**
   * 列出 Schedules.
   *
   * @operation listSchedules
   */
  list(params: ScheduleListParams = {}, options?: RequestOptions): PagePromise<Schedule> {
    const path = "schedules";
    return this._client.getAPIList<Schedule>(path, params, options, "cursor");
  }

  /**
   * 创建 Schedule.
   *
   * @operation createSchedule
   */
  create(params: ScheduleCreateParams, options?: RequestOptions): APIPromise<Schedule> {
    const path = "schedules";
    const { idempotency_key, ...payload } = params;
    return this._client.request<Schedule>({
      method: "POST",
      path,
      body: payload,
      ...options,
      headers: requestHeaders({ "Idempotency-Key": idempotency_key }, options?.headers),
    });
  }

  /**
   * 批量归档 Schedules.
   *
   * @operation archiveSchedules
   */
  archiveMany(
    params: ScheduleArchiveManyParams,
    options?: RequestOptions,
  ): APIPromise<ScheduleArchiveManyResponse> {
    const path = "schedules/archive";
    const { idempotency_key, ...payload } = params;
    return this._client.request<ScheduleArchiveManyResponse>({
      method: "POST",
      path,
      body: payload,
      ...options,
      headers: requestHeaders({ "Idempotency-Key": idempotency_key }, options?.headers),
    });
  }

  /**
   * 获取 Schedule.
   *
   * @operation getSchedule
   */
  retrieve(scheduleID: string, options?: RequestOptions): APIPromise<Schedule> {
    const path = `schedules/${pathParam(scheduleID, "schedule_id")}`;
    return this._client.request<Schedule>({
      method: "GET",
      path,
      ...options,
    });
  }

  /**
   * 更新 Schedule.
   *
   * @operation updateSchedule
   */
  update(
    scheduleID: string,
    params: ScheduleUpdateParams = {},
    options?: RequestOptions,
  ): APIPromise<Schedule> {
    const path = `schedules/${pathParam(scheduleID, "schedule_id")}`;
    const { idempotency_key, ...payload } = params;
    return this._client.request<Schedule>({
      method: "POST",
      path,
      body: payload,
      ...options,
      headers: requestHeaders({ "Idempotency-Key": idempotency_key }, options?.headers),
    });
  }

  /**
   * 归档 Schedule.
   *
   * @operation archiveSchedule
   */
  archive(
    scheduleID: string,
    params: ScheduleArchiveParams = {},
    options?: RequestOptions,
  ): APIPromise<Schedule> {
    const path = `schedules/${pathParam(scheduleID, "schedule_id")}/archive`;
    const { idempotency_key, ...payload } = params;
    return this._client.request<Schedule>({
      method: "POST",
      path,
      ...options,
      headers: requestHeaders({ "Idempotency-Key": idempotency_key }, options?.headers),
    });
  }

  /**
   * 暂停 Schedule.
   *
   * @operation pauseSchedule
   */
  pause(
    scheduleID: string,
    params: SchedulePauseParams = {},
    options?: RequestOptions,
  ): APIPromise<Schedule> {
    const path = `schedules/${pathParam(scheduleID, "schedule_id")}/pause`;
    const { idempotency_key, ...payload } = params;
    return this._client.request<Schedule>({
      method: "POST",
      path,
      ...options,
      headers: requestHeaders({ "Idempotency-Key": idempotency_key }, options?.headers),
    });
  }

  /**
   * 运行 Schedule.
   *
   * @operation runSchedule
   */
  run(scheduleID: string, params: ScheduleRunParams = {}, options?: RequestOptions): APIPromise<ScheduleRun> {
    const path = `schedules/${pathParam(scheduleID, "schedule_id")}/run`;
    const { idempotency_key, ...payload } = params;
    return this._client.request<ScheduleRun>({
      method: "POST",
      path,
      ...options,
      headers: requestHeaders({ "Idempotency-Key": idempotency_key }, options?.headers),
    });
  }

  /**
   * 恢复 Schedule.
   *
   * @operation unpauseSchedule
   */
  unpause(
    scheduleID: string,
    params: ScheduleUnpauseParams = {},
    options?: RequestOptions,
  ): APIPromise<Schedule> {
    const path = `schedules/${pathParam(scheduleID, "schedule_id")}/unpause`;
    const { idempotency_key, ...payload } = params;
    return this._client.request<Schedule>({
      method: "POST",
      path,
      ...options,
      headers: requestHeaders({ "Idempotency-Key": idempotency_key }, options?.headers),
    });
  }

}

export type { Schedule, ScheduleArchiveManyParams, ScheduleArchiveManyResponse, ScheduleArchiveParams, ScheduleCreateParams, ScheduleListParams, SchedulePauseParams, ScheduleRun, ScheduleRunParams, ScheduleUnpauseParams, ScheduleUpdateParams } from './types.js';
