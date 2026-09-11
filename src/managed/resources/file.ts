// Generated code, verified against the API contracts.
import { APIResource } from '../../core/resource.js';
import type { RequestOptions } from '../../core/client.js';
import type { APIPromise } from '../../core/api-promise.js';
import type { PagePromise } from '../../core/pagination.js';
import type { Stream } from '../../core/streaming.js';
import type * as Types from '../types.js';
import { splitParams, pathParam, managedMultipart } from '../internal.js';

export class Files extends APIResource {

  /**
   * List Files
   */
  list(params: Types.FileListParams | null | undefined = {}, options?: RequestOptions): PagePromise<Types.FileMetadata> {
    const request = splitParams(params, options, {"workspace_id": "qoder-workspace-id", "betas": "x-qoder-beta"}, []);
    return this._client.getAPIList<Types.FileMetadata>("/files", request.values, request.options, 'page');
  }

  /**
   * Delete File
   */
  delete(fileID: string, params: Types.FileDeleteParams | null | undefined = {}, options?: RequestOptions): APIPromise<Types.DeletedFile> {
    const request = splitParams(params, options, {"workspace_id": "qoder-workspace-id", "betas": "x-qoder-beta"}, []);
    return this._client.request<Types.DeletedFile>({ ...request.options, method: "DELETE", path: `/files/${pathParam(fileID, "file_id")}` });
  }

  /**
   * Download File
   */
  download(fileID: string, params: Types.FileDownloadParams | null | undefined = {}, options?: RequestOptions): APIPromise<Response> {
    const request = splitParams(params, options, {"workspace_id": "qoder-workspace-id", "betas": "x-qoder-beta"}, []);
    if (!request.headers.has('Accept')) request.headers.set('Accept', "application/json");
    return this._client.downloadFile(`/files/${pathParam(fileID, "file_id")}/content`, request.options);
  }

  /**
   * Get File Metadata
   */
  getMetadata(fileID: string, params: Types.FileGetMetadataParams | null | undefined = {}, options?: RequestOptions): APIPromise<Types.FileMetadata> {
    const request = splitParams(params, options, {"workspace_id": "qoder-workspace-id", "betas": "x-qoder-beta"}, []);
    return this._client.request<Types.FileMetadata>({ ...request.options, method: "GET", path: `/files/${pathParam(fileID, "file_id")}` });
  }

  /**
   * Upload File
   */
  upload(params: Types.FileUploadParams, options?: RequestOptions): APIPromise<Types.FileMetadata> {
    const request = splitParams(params, options, {"workspace_id": "qoder-workspace-id", "betas": "x-qoder-beta"}, []);
    return this._client.request<Types.FileMetadata>({ ...request.options, method: "POST", path: "/files", body: managedMultipart(request.values) });
  }
}

export default Files;
export type { DeletedFile, DeletedFileType, FileMetadata, FileScope, FileListParams, FileDeleteParams, FileDownloadParams, FileGetMetadataParams, FileUploadParams } from '../types.js';
