import { mergeHeaders, type RequestOptions } from '../core/client.js';
import { toFile, type Uploadable } from '../core/uploads.js';

/** Extract header and parent-path parameters without mutating the caller's input. */
export function splitParams(
  params: object | null | undefined,
  options: RequestOptions | undefined,
  headerFields: Record<string, string>,
  pathFields: string[],
): { values: Record<string, unknown>; headers: Headers; options: RequestOptions } {
  const values = { ...params } as Record<string, unknown>;
  let headers = new Headers();
  for (const [field, header] of Object.entries(headerFields)) {
    const value = values[field];
    delete values[field];
    if (value != null) headers.set(header, Array.isArray(value) ? value.join(',') : String(value));
  }
  for (const field of pathFields) delete values[field];
  // Per-request options override typed headers.
  headers = mergeHeaders(headers, options?.headers);
  const removedHeaders = Object.entries(options?.headers ?? {}).filter(([, value]) => value === null);
  return {
    values,
    headers,
    // Preserve deletion markers until the core merges client-wide defaults.
    get options() {
      return { ...options, headers: { ...Object.fromEntries(headers), ...Object.fromEntries(removedHeaders) } };
    },
  };
}

export function pathParam(value: string | undefined | null, name: string): string {
  if (typeof value !== 'string' || value.length === 0) throw new Error(`Missing required ${name} parameter`);
  return encodeURIComponent(value);
}

/** Qoder multipart uses repeated files parts and JSON-encoded metadata. */
export async function managedMultipart(values: Record<string, unknown>): Promise<FormData> {
  const form = new FormData();
  for (const [name, value] of Object.entries(values)) {
    if (value === undefined || value === null) continue;
    if (name === 'file' || name === 'files') {
      for (const upload of Array.isArray(value) ? value : [value]) {
        const file = await toFile(upload as Uploadable);
        form.append(name, file, file.name);
      }
    } else if (typeof value === 'object') {
      form.append(name, JSON.stringify(value));
    } else {
      form.append(name, String(value));
    }
  }
  return form;
}
