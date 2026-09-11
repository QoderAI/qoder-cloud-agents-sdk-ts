/** Response helpers follow anthropic-sdk-typescript's lazy parsing contract. */
export class APIPromise<T> extends Promise<T> {
  private parsed?: Promise<T>;

  constructor(
    private readonly responsePromise: Promise<Response>,
    private readonly parseResponse: (response: Response) => T | PromiseLike<T>,
  ) {
    super((resolve) => resolve(undefined as T));
    // A request starts immediately; parsing (and its errors) stays lazy.
    void responsePromise.catch(() => {});
  }

  static get [Symbol.species](): PromiseConstructor { return Promise; }
  asResponse(): Promise<Response> { return this.responsePromise; }

  async withResponse(): Promise<{ data: T; response: Response; request_id: string | null }> {
    const [data, response] = await Promise.all([this.parse(), this.asResponse()]);
    return { data, response, request_id: response.headers.get('x-request-id') ?? response.headers.get('request-id') };
  }

  private parse(): Promise<T> { return this.parsed ??= this.responsePromise.then(this.parseResponse); }

  override then<TResult1 = T, TResult2 = never>(
    onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | null,
    onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | null,
  ): Promise<TResult1 | TResult2> { return this.parse().then(onfulfilled, onrejected); }

  override catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | null): Promise<T | TResult> {
    return this.parse().catch(onrejected);
  }

  override finally(onfinally?: (() => void) | null): Promise<T> { return this.parse().finally(onfinally); }
}
