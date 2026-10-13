const safeID = value => typeof value === 'string' && /^[A-Za-z0-9_-]{1,256}$/.test(value) ? value : undefined;
const typeOf = value => value === null ? 'null' : Array.isArray(value) ? 'array' : typeof value;
const safeExpected = value => typeof value === 'boolean' || typeof value === 'number' || value === null
  || ['string', 'boolean', 'number', 'undefined', 'object'].includes(value) ? value : undefined;

export function safeRealtimeFailure(error, phase) {
  const assertion = error?.code === 'ERR_ASSERTION' ? {
    operator: ['==', '!=', '===', '!==', 'strictEqual', 'notStrictEqual', 'deepStrictEqual', 'notDeepStrictEqual', 'ok', 'match'].includes(error.operator) ? error.operator : undefined,
    expected: safeExpected(error.expected),
    expected_type: typeOf(error.expected),
    actual_type: typeOf(error.actual),
  } : undefined;
  return JSON.stringify({ phase, error_type: /^[A-Za-z]+Error$/.test(error?.name ?? '') ? error.name : 'Error',
    status: Number.isInteger(error?.status) ? error.status : undefined,
    code: /^[A-Za-z0-9_-]{1,100}$/.test(error?.code ?? '') ? error.code : undefined,
    request_id: safeID(error?.request_id), assertion });
}

export function safeRealtimeEvent(event) {
  return { event_type: typeof event.type === 'string' && /^[A-Za-z0-9_.-]{1,128}$/.test(event.type) ? event.type : undefined,
    event_id: safeID(event.event_id ?? event.id), work_id: safeID(event.work_id), announcement_id: safeID(event.announcement_id) };
}
