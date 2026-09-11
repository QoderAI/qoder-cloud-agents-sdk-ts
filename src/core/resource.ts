import type { APIClient } from './client.js';

/** Resources share the client's transport and request configuration. */
export class APIResource {
  constructor(protected readonly _client: APIClient) {}
}
