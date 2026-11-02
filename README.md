# Qoder Cloud Agents TypeScript SDK

[Changelog](CHANGELOG.md) · [Releases](https://github.com/QoderAI/qoder-cloud-agents-sdk-ts/releases)

[![NPM version](https://img.shields.io/npm/v/qca-sdk.svg)](https://npmjs.org/package/qca-sdk)

TypeScript and JavaScript library for the Qoder Cloud Agents API. It provides typed access to the Forward and Managed APIs and ships CommonJS and ES modules with strict TypeScript types for Node.js.

## Installation

```sh
npm install qca-sdk
```

Node.js 20.12 or later is required.

## Usage

The library exposes two clients with shared configuration and transport behavior.

```ts
import { ForwardClient, ManagedClient } from 'qca-sdk';

const forward = new ForwardClient({ pat: process.env.QODER_PAT });
const managed = new ManagedClient({ pat: process.env.QODER_PAT });

const models = await forward.models.list();
for (const model of models.data) {
  if (model.is_enabled) console.log(model.id);
}
```

Each client also has its own entry point, `qca-sdk/forward` or `qca-sdk/managed`, with named and default exports.

## Configuration

`accessToken` accepts a string or a function returning a string or a promise, re-resolved before every request attempt. `pat` remains available for existing PAT integrations. `QODER_ACCESS_TOKEN` supplies the selected mode's token; PAT mode falls back to `QODER_PAT`. A `Credential` object can be supplied instead; see the authentication section for automatic SA exchange.

The base URL comes from `QODER_FORWARD_BASE_URL` for Forward and `QODER_BASE_URL` for Managed, defaulting to `https://api.qoder.com/api/v1/forward` and `https://api.qoder.com/api/v1/cloud`. Explicit constructor options always win.

```ts
import { ManagedClient, PATCredential } from 'qca-sdk';

const client = new ManagedClient({
  credential: PATCredential.fromEnv(),
  baseURL: 'https://api.qoder.com/api/v1/cloud',
  timeout: 30_000,
  maxRetries: 2,
  defaultHeaders: { 'X-Application': 'my-app' },
});
```

## PAT and Service Account authentication

PAT and SA are parallel modes. Existing `pat` calls keep working. For an existing
SAT use `{ authMode: 'sa', accessToken }`. `accessToken` also accepts a callback.
`QODER_ACCESS_TOKEN` supplies the selected mode's token; only PAT mode falls back
to `QODER_PAT`. Ordinary clients never automatically read `QODER_SA_KEY`.

For automatic SAT exchange, explicitly construct a shared credential:

```ts
import { ForwardClient, ManagedClient, ServiceAccountCredential } from 'qca-sdk';

const credential = ServiceAccountCredential.fromEnv({
  region: 'global',
  scopes: ['qca.access', 'forward.access'],
});
const forward = new ForwardClient({ credential });
const managed = new ManagedClient({ credential });
```

For CN, use `region: 'cn'` and matching `https://api.qoder.com.cn/api/v1/forward/`
and `https://api.qoder.com.cn/api/v1/cloud/` BaseURLs. Managed-only integrations
can request `['qca.access']`. Scopes and Service Account permissions/workspace
bindings must be configured server-side; the SDK does not provision them.

The credential lazily exchanges the SA Key, caches the server's actual lifetime,
and renews on the next request in the refresh window. Concurrent callers share
one exchange. A transient failure can reuse a still-safe SAT; authentication or
invalid-response failures cannot. Failures enter a bounded cooldown. There is
no PAT fallback, background refresh, or automatic replay of a 401 write request.
The independent exchange timeout includes reading its body (default 30 seconds).
Cancelling a business request ends that caller's wait; the shared exchange can
continue and cache its result. Already-open streams are not closed by cache expiry.

Do not combine `accessToken` with `pat` or `credential`, or an SA credential with
a static token. Legacy `pat` + custom credential retains provider precedence.
Request Authorization headers still override automatic injection. `withOptions`
retains mode and source; explicitly changing `authMode` clears the other mode's
credentials before applying new options.

Run the read-only CN/Global SA smoke separately with `npm run test:live:sa`, setting
`QODER_SA_CN_KEY` and `QODER_SA_GLOBAL_KEY` in `.env.live` or the process environment.
Process variables take precedence; `LIVE_ENV_FILE` selects another file.
Both keys are checked before the first API call. For write/read, Session SSE and
cleanup verification, run `npm run test:live:sa:execution` with
`QODER_SA_LIVE_ALLOW_WRITE=true` and `QODER_SA_LIVE_ALLOW_EXECUTION=true`.
`QODER_SA_MODEL` defaults to `auto`. Ordinary offline and PAT suites do not require
SA credentials; `QODER_AUTH_MODE` switches examples, not the PAT test suites. See the
[official authentication contract](https://docs.qoder.com/cloud-agents/api/conventions/authentication).

## Request and response types

Every operation is typed. The two APIs define independent type sets, so request and response types are exported from the subpath entry points rather than the package root:

```ts
import type { Session, SessionCreateParams, Template } from 'qca-sdk/forward';
import type { ManagedAgentsAgent } from 'qca-sdk/managed';

const params: SessionCreateParams = { identity_id: 'identity_id', template_id: 'template_id' };
```

All fields keep the snake_case naming used on the wire. Unknown fields are preserved when decoding, so a server-side addition reaches you before the types catch up. On the way out `undefined` is omitted, while `null`, `false`, empty strings and empty arrays are sent as-is.

## Streaming

Streaming responses are consumed incrementally. Close the stream when finished and handle interruption explicitly; closing a local stream does not cancel server-side work.

## Handling errors

`APIError` covers HTTP failures, connection failures, exhausted timeouts, and caller cancellation. HTTP errors carry `status`, `headers`, `code`, `type`, `request_id`, the parsed error payload, and the underlying `request` and `response`.

```ts
import { APIError, APIUserAbortError, NotFoundError } from 'qca-sdk';

try {
  await client.sessions.retrieve('sess_missing');
} catch (error) {
  if (error instanceof APIUserAbortError) {
    console.log('Request cancelled');
  } else if (error instanceof NotFoundError) {
    console.log(error.status, error.code, error.request_id);
  } else if (error instanceof APIError) {
    console.log(error.status ?? 'No HTTP response', error.message, error.headers?.get('x-request-id'));
  } else {
    throw error;
  }
}
```

| Status | Error class              |
| ------ | ----------------------- |
| 400    | `BadRequestError`       |
| 401    | `AuthenticationError`   |
| 403    | `PermissionDeniedError` |
| 404    | `NotFoundError`         |
| 409    | `ConflictError`         |
| 422    | `UnprocessableEntityError` |
| 429    | `RateLimitError`        |
| >=500  | `InternalServerError`   |

Connection failures throw `APIConnectionError`, an exhausted timeout throws `APIConnectionTimeoutError` (a subclass of `APIConnectionError`), and aborting through your own signal throws `APIUserAbortError`. All three inherit from `APIError`, matching Anthropic's TypeScript SDK. They have no HTTP response: `status`, `headers`, `error`, and `response` are `undefined`, and `request_id`/`requestID` are `null`. Guard these fields when handling a general `APIError`; HTTP-specific subclasses such as `NotFoundError` retain typed status codes and `Headers`.

Error constructors continue to accept `(message, { cause })`. Client-side configuration errors such as an unsupported `baseURL` scheme or a negative `maxRetries` remain `QoderError` instances outside `APIError`. `QoderError` is the SDK error base class.

### Request IDs

Ordinary JSON object responses expose `_request_id` directly, matching Anthropic's TypeScript SDK. Its value comes from `x-request-id`, falling back to `request-id`, and is `null` when neither header is present. The property is non-enumerable, so `JSON.stringify()`, `Object.keys()`, and object spread omit it. Include this ID when reporting a problem.

```ts
const result = await client.sessions.retrieve(session.id);
console.log(result._request_id);
```

Errors expose `request_id`. Use `withResponse()` to get the request ID alongside the data and raw response, including for pagination, SSE, and downloads. Array elements, nested objects, and individual stream events do not receive request metadata.

```ts
const { data, request_id } = await client.sessions.retrieve(session.id).withResponse();
```

## Retries

Connection errors, timeouts, 408, 429 and 5xx responses are retried twice by default with exponential backoff and jitter. Only replayable requests are eligible: `GET` and `HEAD`, plus any request sent with an idempotency key. Writes without an idempotency key are retried on 429 only, 409 is never retried, and a request whose body is a `ReadableStream` is never replayed because the body cannot be re-read. Within these safety rules, `x-should-retry` controls whether to retry, and `retry-after-ms` or `retry-after` controls the delay.

Server-requested delays must be positive and no greater than `2 ** 31 - 1` milliseconds (the single-timer limit). Zero, negative, invalid, and over-limit values fall back to exponential backoff. `retry-after-ms` takes precedence; if it is missing, unparseable, or zero, the SDK checks `retry-after`, which accepts seconds or an HTTP date. These rules match Anthropic's TypeScript SDK.

```ts
const client = new ForwardClient({ maxRetries: 0 }); // disable retries
await client.sessions.create(params, { maxRetries: 5, idempotencyKey: 'my-key' });
```

Each attempt re-resolves the credential and sends an `X-Qoder-Retry-Count` header.

## Reusing client configuration

`withOptions()` creates a new client of the same type and retains options you do not override, including authentication, custom `fetch`, middleware, and the resolved base URL. The original client keeps its configuration.

```ts
const slowClient = client.withOptions({ timeout: 60_000, maxRetries: 1 });
await slowClient.sessions.list({});
```

Supplied `defaultHeaders`, `defaultQuery`, and `middleware` replace their entire corresponding option rather than merging with it, matching Anthropic. Per-request options still override the derived client's defaults. Authentication follows the constructor's precedence: to switch from an inherited credential provider to a PAT, pass `{ credential: undefined, pat: 'new-token' }`.

## Timeouts

Requests time out after 10 minutes by default and are then retried according to the rules above. Configure the client default or override per request:

```ts
const client = new ForwardClient({ timeout: 20 * 1000 });
await client.sessions.list({}, { timeout: 5 * 1000 });
```

The timeout applies to each underlying `fetch` call, matching Anthropic's TypeScript SDK. Its timer starts immediately before `fetch` and is cleared when a response arrives, before the body is read. Credential resolution and middleware are outside this timer; each `next()` call that reaches `fetch` starts a new timer. SSE streams and downloads can therefore continue beyond the configured timeout after response headers arrive.

Pass `signal` to cancel the whole operation, including middleware, retries, and response-body reads. Use `AbortSignal.timeout(...)` when you also need a total deadline for an SSE subscription or download:

```ts
await client.sessions.list({}, { signal: AbortSignal.timeout(5_000) });
```

## Client fingerprint

Every API request identifies the client so the service can tell which SDK versions are in use before changing a response shape:

| Header | Value |
| --- | --- |
| `User-Agent` | `qca-js/<version>` |
| `X-Qoder-Lang` | `js` |
| `X-Qoder-Package-Version` | the published package version, also exported as `VERSION` |
| `X-Qoder-OS` / `X-Qoder-Arch` | normalized platform, e.g. `MacOS` / `arm64` |
| `X-Qoder-Runtime` / `X-Qoder-Runtime-Version` | `node` and its version |
| `X-Qoder-Retry-Count` / `X-Qoder-Timeout` | attempt number, and the request deadline in seconds |

The signed-URL leg of a file download carries none of these, so nothing is disclosed to object storage. Any of them can be replaced:

```ts
const client = new ForwardClient({ defaultHeaders: { 'User-Agent': 'my-app/2.1' } });
```

## Auto-pagination

List methods return an async-iterable page. Iterating the result fetches subsequent pages as needed, carrying your filter parameters forward.

```ts
for await (const template of client.templates.list({ limit: 20 })) {
  console.log(template.id);
}
```

Pages can also be walked one at a time:

```ts
const page = await client.templates.list({ limit: 20 });
console.log(page.data.length);

if (page.hasNextPage()) {
  const next = await page.getNextPage();
  console.log(next.data);
}

for await (const p of page.iterPages()) {
  console.log(p.data.length);
}
```

Call `hasNextPage()` before manually calling `getNextPage()`. Matching Anthropic's TypeScript SDK, `getNextPage()` returns a page or throws `QoderError` when no next page exists; it no longer returns `null`. Migrate loops that use a `null` next page as their stopping condition to `hasNextPage()` or async iteration. Both `for await` and `iterPages()` stop normally at the last page.

Cursor style follows the operation: ID cursors use `after_id` and `before_id`, opaque cursors use `next_page` fed back as `page`. Auto-pagination stops with an error if a cursor fails to advance, rather than looping forever.

## Advanced usage

### Accessing raw response data

Every method returns an `APIPromise`. Awaiting it gives the parsed body; `asResponse()` returns the raw `Response` without reading the body, and `withResponse()` gives you both.

```ts
const response = await client.sessions.retrieve(session.id).asResponse();
console.log(response.headers.get('x-request-id'));

const { data, response: raw } = await client.sessions.retrieve(session.id).withResponse();
```

### Undocumented endpoints and fields

Request parameter types accept extra properties, so a field the types do not know about yet can be sent as-is. For an endpoint with no generated method, call the transport directly:

```ts
await client.request({ method: 'POST', path: 'undocumented/endpoint', body: { key: 'value' } });
```

Extra query parameters and headers go through `query` and `headers` on the per-request options. Undocumented response fields survive decoding but are not typed, so reach them through a cast.

### Middleware and custom fetch

`middleware` wraps each attempt, which is the hook for logging, tracing or request rewriting. `fetch` replaces the implementation entirely.

```ts
const client = new ForwardClient({
  middleware: [
    async (request, next) => {
      const started = Date.now();
      const response = await next(request);
      console.log(request.method, request.url, response.status, `${Date.now() - started}ms`);
      return response;
    },
  ],
});
```

Neither hook is applied to file downloads, which deliberately bypass the client to avoid sending credentials to storage.

## Requirements

Node.js 20.12 or later. The SDK relies only on the platform's `fetch`, `Request`, `Response`, `Headers`, `AbortController`, `Blob` and `File` — any runtime providing those, and a `fetch` you can inject if not, should work. Deno, Bun, Cloudflare Workers and Vercel Edge are not part of the test matrix.

## Documentation

- [API reference](docs/api/)
- [Runnable examples](examples/)
- [Contribution guide](CONTRIBUTING.md)

The API reference under `docs/api/` is generated from the source. Regenerate it with `make docs` (or `npm run docs`). To verify the committed reference is up to date and the README snippets still compile, run `make docs-check` (or `npm run docs:check`); CI runs the same gate on every pull request.

## License

Released under the [MIT License](LICENSE).
