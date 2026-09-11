// Shared transport details for the Forward resources.
import type { RequestOptions } from '../core/client.js';

/** Validate before invoking fetch, then escape the value as one path segment. */
export function pathParam(value: string, name: string): string {
  if (typeof value !== 'string' || value.length === 0) {
    throw new Error(`missing required ${name} parameter`);
  }
  return encodeURIComponent(value);
}

/** Per-request headers take precedence over typed header parameters. */
export function requestHeaders(base: Record<string, string | null | undefined>, extra: RequestOptions['headers']): Record<string, string | null | undefined> {
  const headers: Record<string, string | null | undefined> = {};
  for (const [key, value] of Object.entries(base)) {
    // Absent and explicitly null header params are both omitted.
    if (value !== undefined && value !== null) headers[key.toLowerCase()] = value;
  }
  if (extra instanceof Headers) {
    extra.forEach((value, key) => { headers[key.toLowerCase()] = value; });
  } else if (Array.isArray(extra)) {
    for (const [key, value] of extra) headers[key.toLowerCase()] = value;
  } else if (extra) {
    for (const [key, value] of Object.entries(extra)) {
      if (value !== undefined) headers[key.toLowerCase()] = value;
    }
  }
  return headers;
}
