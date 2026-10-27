// Generated code, verified against the API contracts.
import { APIResource } from '../core/resource.js';
import type { RequestOptions } from '../core/client.js';
import type { FileSearchParams } from './types.js';
import type { IdentityScopeOptions } from './types.js';
import type { APIPromise } from '../core/api-promise.js';
import type { PagePromise } from '../core/pagination.js';
import { toMultipartForm } from '../core/uploads.js';
import { pathParam, requestHeaders, identityScopeOptions } from './_utils.js';
import type { FileListParams, FileMetadata, FileUploadParams } from './types.js';

export class Files extends APIResource {
  /** Search by metadata and resource filters; automatically enables the Search beta. */
  search(params: FileSearchParams = {}, options?: RequestOptions): PagePromise<FileMetadata> {
    const { identity_id, ...body } = params;
    return this._client.postAPIList<FileMetadata>('files/search', body, { ...options, query: { identity_id, ...options?.query } }, 'page', 'search-2026-08-31');
  }

  /**
   * 列出 File.
   *
   * @operation listFile
   */
  list(params: FileListParams = {}, options?: RequestOptions): PagePromise<FileMetadata> {
    const path = "files";
    return this._client.getAPIList<FileMetadata>(path, params, options, "page");
  }

  /**
   * 上传 File.
   *
   * @operation uploadFile
   */
  upload(params: FileUploadParams, options?: RequestOptions): APIPromise<FileMetadata> {
    const path = "files";
    const { identity_id, idempotency_key, ...payload } = params;
    return this._client.request<FileMetadata>({
      method: "POST",
      path,
      body: toMultipartForm(payload),
      ...options,
      query: { identity_id, ...options?.query },
      headers: requestHeaders({ "Idempotency-Key": idempotency_key }, options?.headers),
    });
  }

  /**
   * 查询 File.
   *
   * @operation getFile
   */
  getMetadata(fileID: string, options?: IdentityScopeOptions): APIPromise<FileMetadata> {
    const path = `files/${pathParam(fileID, "file_id")}`;
    return this._client.request<FileMetadata>({
      method: "GET",
      path,
      ...identityScopeOptions(options),
    });
  }

  /**
   * 删除 File.
   *
   * @operation deleteFile
   */
  delete(fileID: string, options?: IdentityScopeOptions): APIPromise<void> {
    const path = `files/${pathParam(fileID, "file_id")}`;
    return this._client.request<void>({
      method: "DELETE",
      path,
      responseType: "void",
      ...identityScopeOptions(options),
    });
  }

  /**
   * 下载 File.
   *
   * @operation downloadFile
   */
  download(fileID: string, options?: IdentityScopeOptions): APIPromise<Response> {
    const path = `files/${pathParam(fileID, "file_id")}/content`;
    return this._client.downloadFile(path, identityScopeOptions(options));
  }

}

export type { FileListParams, FileMetadata, FileUploadParams } from './types.js';

export type { FileSearchParams } from './types.js';
