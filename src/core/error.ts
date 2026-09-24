export class QoderError extends Error {
  constructor(message: string, options?: ErrorOptions) {
    super(message, options);
    this.name = new.target.name;
  }
}

export class APIError<
  TStatus extends number | undefined = number | undefined,
  THeaders extends Headers | undefined = Headers | undefined,
  TError = unknown,
> extends QoderError {
  readonly request_id: string | null;
  readonly requestID: string | null;
  readonly code?: string;
  readonly type?: string;
  request?: Request;
  constructor(
    readonly status: TStatus,
    readonly error: TError,
    message?: string,
    readonly headers: THeaders = (status === undefined ? undefined : new Headers()) as THeaders,
    readonly response?: Response,
    options?: ErrorOptions,
  ) {
    const envelope = error && typeof error === 'object' ? error as Record<string, unknown> : {};
    const detail = envelope.error && typeof envelope.error === 'object'
      ? envelope.error as Record<string, unknown> : envelope;
    super(message ?? (typeof detail.message === 'string' ? detail.message : `HTTP ${status}${typeof error === 'string' && error ? `: ${error}` : ''}`), options);
    this.request_id = typeof envelope.request_id === 'string' && envelope.request_id ? envelope.request_id : headers?.get('x-request-id') ?? headers?.get('request-id') ?? null;
    this.requestID = this.request_id;
    this.code = typeof detail.code === 'string' ? detail.code : undefined;
    this.type = typeof detail.type === 'string' ? detail.type : undefined;
  }

  static generate(status: number, error: unknown, message?: string, headers = new Headers(), response?: Response): APIError<number, Headers> {
    switch (status) {
      case 400: return new BadRequestError(status, error, message, headers, response);
      case 401: return new AuthenticationError(status, error, message, headers, response);
      case 403: return new PermissionDeniedError(status, error, message, headers, response);
      case 404: return new NotFoundError(status, error, message, headers, response);
      case 409: return new ConflictError(status, error, message, headers, response);
      case 422: return new UnprocessableEntityError(status, error, message, headers, response);
      case 429: return new RateLimitError(status, error, message, headers, response);
      default: return status >= 500 ? new InternalServerError(status, error, message, headers, response)
        : new APIError(status, error, message, headers, response);
    }
  }
}
export class BadRequestError extends APIError<400, Headers> {}
export class AuthenticationError extends APIError<401, Headers> {}
export class PermissionDeniedError extends APIError<403, Headers> {}
export class NotFoundError extends APIError<404, Headers> {}
export class ConflictError extends APIError<409, Headers> {}
export class UnprocessableEntityError extends APIError<422, Headers> {}
export class RateLimitError extends APIError<429, Headers> {}
export class InternalServerError extends APIError<number, Headers> {}
export class APIConnectionError extends APIError<undefined, undefined, undefined> {
  constructor(message: string, options?: ErrorOptions) {
    super(undefined, undefined, message, undefined, undefined, options);
  }
}
export class APIConnectionTimeoutError extends APIConnectionError {}
export class APIUserAbortError extends APIError<undefined, undefined, undefined> {
  constructor(message: string, options?: ErrorOptions) {
    super(undefined, undefined, message, undefined, undefined, options);
  }
}
