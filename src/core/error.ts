export class QoderError extends Error {
  constructor(message: string, options?: ErrorOptions) {
    super(message, options);
    this.name = new.target.name;
  }
}

export class APIError extends QoderError {
  readonly request_id: string | null;
  readonly requestID: string | null;
  readonly code?: string;
  readonly type?: string;
  request?: Request;
  constructor(
    readonly status: number,
    readonly error: unknown,
    message?: string,
    readonly headers = new Headers(),
    readonly response?: Response,
  ) {
    const envelope = error && typeof error === 'object' ? error as Record<string, unknown> : {};
    const detail = envelope.error && typeof envelope.error === 'object'
      ? envelope.error as Record<string, unknown> : envelope;
    super(message ?? (typeof detail.message === 'string' ? detail.message : `HTTP ${status}${typeof error === 'string' && error ? `: ${error}` : ''}`));
    this.request_id = typeof envelope.request_id === 'string' && envelope.request_id ? envelope.request_id : headers.get('x-request-id') ?? headers.get('request-id');
    this.requestID = this.request_id;
    this.code = typeof detail.code === 'string' ? detail.code : undefined;
    this.type = typeof detail.type === 'string' ? detail.type : undefined;
  }

  static generate(status: number, error: unknown, message?: string, headers?: Headers, response?: Response): APIError {
    const Type = ({ 400: BadRequestError, 401: AuthenticationError, 403: PermissionDeniedError,
      404: NotFoundError, 409: ConflictError, 422: UnprocessableEntityError, 429: RateLimitError } as Record<number, typeof APIError>)[status]
      ?? (status >= 500 ? InternalServerError : APIError);
    return new Type(status, error, message, headers, response);
  }
}
export class BadRequestError extends APIError {}
export class AuthenticationError extends APIError {}
export class PermissionDeniedError extends APIError {}
export class NotFoundError extends APIError {}
export class ConflictError extends APIError {}
export class UnprocessableEntityError extends APIError {}
export class RateLimitError extends APIError {}
export class InternalServerError extends APIError {}
export class APIConnectionError extends QoderError {}
export class APIConnectionTimeoutError extends APIConnectionError {}
export class APIUserAbortError extends QoderError {}
