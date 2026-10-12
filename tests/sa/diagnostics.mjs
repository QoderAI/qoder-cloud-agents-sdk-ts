export function safeFailure(error) {
  if (error instanceof AggregateError) return error.errors.map(safeFailure).join('; ');
  if (error.status) return `HTTP ${error.status} code=${error.code ?? ''} request_id=${error.request_id ?? ''}`;
  return error.message;
}
