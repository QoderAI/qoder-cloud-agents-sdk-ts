import { VERSION } from '../version.js';

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
    && (Object.getPrototypeOf(value) === Object.prototype || Object.getPrototypeOf(value) === null);
}

/** Stamp only Session creation bodies, without mutating caller-owned metadata. */
export function withSessionMetadata(body: unknown): Record<string, unknown> {
  if (!isRecord(body)) throw new TypeError('session creation body must be a JSON object');
  const metadata = body.metadata ?? {};
  if (!isRecord(metadata)) throw new TypeError('session creation metadata must be a JSON object or null');
  const merged = { ...metadata };
  for (const [key, expected] of Object.entries({
    __qca_sdk_created: 'true',
    __qca_sdk_language: 'js',
    __qca_sdk_version: VERSION,
  })) {
    if (Object.hasOwn(merged, key) && merged[key] !== undefined && merged[key] !== expected) {
      throw new TypeError(`conflicting SDK metadata field: ${key}`);
    }
    merged[key] = expected;
  }
  return { ...body, metadata: merged };
}
