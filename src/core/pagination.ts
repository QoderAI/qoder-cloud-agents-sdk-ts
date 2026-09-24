import { APIPromise } from './api-promise.js';
import type { APIClient, RequestOptions } from './client.js';
import { QoderError } from './error.js';

export type PaginationMode = 'cursor' | 'page' | 'page_token';
export interface PageResponse<T> {
  data: T[];
  has_more?: boolean;
  first_id?: string | null;
  last_id?: string | null;
  next_page?: string | null;
  prev_page?: string | null;
  [key: string]: unknown;
}

export class Page<T> implements AsyncIterable<T> {
  readonly data: T[];
  readonly has_more?: boolean;
  readonly first_id?: string | null;
  readonly last_id?: string | null;
  readonly next_page?: string | null;
  readonly prev_page?: string | null;
  [key: string]: unknown;

  constructor(
    private readonly client: APIClient,
    readonly response: Response,
    private readonly body: PageResponse<T>,
    private readonly path: string,
    private readonly query: Record<string, unknown>,
    private readonly options: RequestOptions,
    private readonly mode: PaginationMode,
  ) {
    // Preserve unknown response fields without replacing methods or internal state.
    for (const [key, value] of Object.entries(body)) {
      if (!(key in this)) Object.defineProperty(this, key, { value, enumerable: true, configurable: true, writable: true });
    }
    this.data = body.data ?? [];
    this.has_more = body.has_more;
    this.first_id = body.first_id;
    this.last_id = body.last_id;
    this.next_page = body.next_page;
    this.prev_page = body.prev_page;
  }

  private nextQuery(): Record<string, unknown> | null {
    if (this.has_more === false) return null;
    const query = { ...this.query };
    let key: string;
    let cursor: string | null | undefined;
    if (this.mode === 'cursor') {
      if (!this.data.length) return null;
      key = Object.hasOwn(query, 'before_id') ? 'before_id' : 'after_id';
      cursor = key === 'before_id' ? this.first_id : this.last_id;
      if (key === 'before_id') delete query.after_id;
    } else {
      if (this.mode === 'page_token' && !this.data.length) return null;
      key = this.mode;
      cursor = this.next_page;
      delete query.before_id;
      delete query.after_id;
    }
    if (!cursor) return null;
    if (query[key] === cursor) throw new QoderError('pagination cursor did not advance');
    query[key] = cursor;
    return query;
  }

  toJSON(): PageResponse<T> { return this.body; }

  hasNextPage(): boolean { return this.nextQuery() !== null; }
  getPaginatedItems(): T[] { return this.data; }

  async getNextPage(): Promise<Page<T>> {
    const query = this.nextQuery();
    if (!query) {
      throw new QoderError('No next page expected; please check `.hasNextPage()` before calling `.getNextPage()`.');
    }
    return await this.client.getAPIList<T>(this.path, query, this.options, this.mode);
  }

  async *iterPages(): AsyncGenerator<Page<T>> {
    let page: Page<T> = this;
    const cursors = new Set<string>();
    while (true) {
      yield page;
      const next = page.nextQuery();
      if (!next) return;
      const fingerprint = JSON.stringify(next);
      if (cursors.has(fingerprint)) throw new QoderError('pagination cursor did not advance');
      cursors.add(fingerprint);
      page = await page.getNextPage();
    }
  }

  async *[Symbol.asyncIterator](): AsyncGenerator<T> {
    for await (const page of this.iterPages()) yield* page.data;
  }
}

export class PagePromise<T> extends APIPromise<Page<T>> implements AsyncIterable<T> {
  async *[Symbol.asyncIterator](): AsyncGenerator<T> { yield* await this; }
}
