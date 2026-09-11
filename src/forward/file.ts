// Generated code, verified against the API contracts.
import { APIResource } from '../core/resource.js';
import type { RequestOptions } from '../core/client.js';
import type { APIPromise } from '../core/api-promise.js';
import type { PagePromise } from '../core/pagination.js';
import { toMultipartForm } from '../core/uploads.js';
import { pathParam, requestHeaders } from './_utils.js';
import type { FileListParams, FileMetadata, FileUploadParams } from './types.js';

export class Files extends APIResource {
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
    const { idempotency_key, ...payload } = params;
    return this._client.request<FileMetadata>({
      method: "POST",
      path,
      body: toMultipartForm(payload),
      ...options,
      headers: requestHeaders({ "Idempotency-Key": idempotency_key }, options?.headers),
    });
  }

  /**
   * 查询 File.
   *
   * @operation getFile
   */
  getMetadata(fileID: string, options?: RequestOptions): APIPromise<FileMetadata> {
    const path = `files/${pathParam(fileID, "file_id")}`;
    return this._client.request<FileMetadata>({
      method: "GET",
      path,
      ...options,
    });
  }

  /**
   * 删除 File.
   *
   * @operation deleteFile
   */
  delete(fileID: string, options?: RequestOptions): APIPromise<void> {
    const path = `files/${pathParam(fileID, "file_id")}`;
    return this._client.request<void>({
      method: "DELETE",
      path,
      responseType: "void",
      ...options,
    });
  }

  /**
   * 下载 File.
   *
   * @operation downloadFile
   */
  download(fileID: string, options?: RequestOptions): APIPromise<Response> {
    const path = `files/${pathParam(fileID, "file_id")}/content`;
    return this._client.downloadFile(path, options);
  }

}

export type { FileListParams, FileMetadata, FileUploadParams } from './types.js';
