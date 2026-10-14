import { APIResource } from '../core/resource.js';
import { stringifyQuery, type RequestOptions } from '../core/client.js';
import type { APIPromise } from '../core/api-promise.js';
import type { DriveListEntriesParams, DriveListEntriesResponse, DriveCreateUploadURLParams, DriveUploadURL, DriveCreateDownloadURLParams, DriveDownloadURL, DriveDeleteEntryParams, DriveDeleteEntryResponse, DriveClearParams, DriveClearResponse } from './types.js';

function driveQuery(query: object): string {
  // Match the Drive canonical form encoding without touching cursor values.
  return stringifyQuery(query).split('&').map(field => {
    if (!field.startsWith('path=')) return field;
    const value = decodeURIComponent(field.slice(5).replace(/\+/g, ' '));
    return 'path=' + encodeURIComponent(value).replace(/[!'()*]/g, c => '%' + c.charCodeAt(0).toString(16).toUpperCase()).replace(/%20/g, '+').replace(/%2F/g, '/');
  }).join('&');
}

/** Persistent Identity files (Beta). Identity SATs also require identity_id. */
export class Drives extends APIResource {
  /** One page in service order. Pass next_page_token unchanged to page_token. */
  listEntries(params: DriveListEntriesParams, options?: RequestOptions): APIPromise<DriveListEntriesResponse> {
    return this._client.request({ method: 'GET', path: 'drives/entries', ...options,
      query: { ...params, ...options?.query }, querySerializer: driveQuery });
  }

  /** Request a PUT URL. Only its returned headers belong on the storage request.
   * Replaying an Idempotency-Key does not renew the URL's expiry. */
  createUploadUrl(params: DriveCreateUploadURLParams, options?: RequestOptions): APIPromise<DriveUploadURL> {
    const { identity_id, ...body } = params;
    return this._client.request({ method: 'POST', path: 'drives/upload-url', body, ...options,
      query: { identity_id, ...options?.query } });
  }

  /** Request a GET URL. Use a new Idempotency-Key or omit it to refresh expiry. */
  createDownloadUrl(params: DriveCreateDownloadURLParams, options?: RequestOptions): APIPromise<DriveDownloadURL> {
    const { identity_id, ...body } = params;
    return this._client.request({ method: 'POST', path: 'drives/download-url', body, ...options,
      query: { identity_id, ...options?.query } });
  }

  /** Delete a file or directory. Nonempty directories require recursive: true.
   * Partial failures preserve error.deleted_count in the API error body. */
  deleteEntry(params: DriveDeleteEntryParams, options?: RequestOptions): APIPromise<DriveDeleteEntryResponse> {
    const { identity_id, ...body } = params;
    return this._client.request({ method: 'DELETE', path: 'drives/entries', body, ...options,
      query: { identity_id, ...options?.query } });
  }

  /** Clear the selected Identity Drive. All its files are deleted. */
  clear(params: DriveClearParams, options?: RequestOptions): APIPromise<DriveClearResponse> {
    return this._client.request({ method: 'DELETE', path: 'drives', ...options,
      query: { ...params, ...options?.query } });
  }
}
