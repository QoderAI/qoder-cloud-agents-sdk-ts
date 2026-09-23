# Qoder Cloud Agents TypeScript SDK

[Changelog](CHANGELOG.md) · [Releases](https://github.com/QoderAI/qoder-cloud-agents-sdk-ts/releases)

[![NPM version](https://img.shields.io/npm/v/qca-sdk.svg)](https://npmjs.org/package/qca-sdk)

> [!IMPORTANT]
> This SDK is in preview. It is pre-1.0, so the API surface may still change between releases.

TypeScript and JavaScript library for the Qoder Cloud Agents API. It provides typed access to the Forward and Managed APIs, ships CommonJS, ES modules and strict TypeScript types, and has no third-party runtime dependencies.

## Installation

```sh
npm install qca-sdk
```

Node.js 20.12 or later is required.

## Usage

The library exposes two clients, one per API. Both are constructed the same way and share the same transport behaviour.

```ts
import { ForwardClient } from 'qca-sdk';

const client = new ForwardClient({
  pat: process.env.QODER_PAT, // this is the default and can be omitted
});

const session = await client.sessions.create({
  identity_id: 'identity_id',
  template_id: 'template_id',
});

await client.sessions.events.send(session.id, {
  events: [{ type: 'user.message', content: [{ type: 'text', text: 'Hello, Qoder' }] }],
});

for await (const event of client.sessions.events.list(session.id, { order: 'asc' })) {
  console.log(event.type);
}
```

`ForwardClient` covers the Forward API — `templates`, `identities`, `sessions`, `schedules`, `scheduleRuns`, `batches`, `channels`, `channelPairings`, `environments`, `files`, `skills`, `vaults`, `memoryStores` and `models`.

```ts
import { ManagedClient } from 'qca-sdk';

const client = new ManagedClient();

const session = await client.sessions.create({
  agent: 'agent_id',
  environment_id: 'environment_id',
});
```

`ManagedClient` covers the Managed API — `agents`, `sessions`, `deployments`, `deploymentRuns`, `dreams`, `environments`, `skills`, `vaults`, `files`, `memoryStores` and `models`.

Nested resources are reached through their parent. On a `ForwardClient`, path segments are positional arguments:

```ts
const version = await forward.skills.versions.retrieve('skill_id', 'version');
```

On a `ManagedClient`, the parent ID stays in the parameter object:

```ts
const version = await managed.skills.versions.retrieve('version', { skill_id: 'skill_id' });
```

Each client also has its own entry point — `qca-sdk/forward` and `qca-sdk/managed` — exported both by name and as the default export, so you can pull in only the half you use.

```ts
import ForwardClient from 'qca-sdk/forward';
```

### Configuration

`pat` accepts a string or a function returning a string or a promise, which is re-resolved before every request attempt — useful for short-lived tokens. A `Credential` object can be supplied instead; `PATCredential.fromEnv()` reads `QODER_PAT`.

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

## Request and response types

Every operation is typed. The two APIs define independent type sets, so request and response types are exported from the subpath entry points rather than the package root:

```ts
import type { Session, SessionCreateParams, Template } from 'qca-sdk/forward';
import type { ManagedAgentsAgent } from 'qca-sdk/managed';

const params: SessionCreateParams = { identity_id: 'identity_id', template_id: 'template_id' };
```

All fields keep the snake_case naming used on the wire. Unknown fields are preserved when decoding, so a server-side addition reaches you before the types catch up. On the way out `undefined` is omitted, while `null`, `false`, empty strings and empty arrays are sent as-is.

## Streaming

Session events can be consumed as a server-sent event stream.

```ts
const stream = await client.sessions.events.streamEvents(session.id, {
  include_tool_calls: true,
  'event_deltas[]': ['agent.message'],
});

for await (const event of stream) {
  console.log(event.type);
}
```

The stream can be ended early with `stream.controller.abort()` or `await stream.close()`. Ping frames are skipped, delta frames that share an ID are preserved, unknown event types are passed through, and an error event throws an `APIError`.

`stream.lastEventID` holds the ID of the most recent event. Pass it back as `last_event_id` to resume a one-shot stream where you stopped:

```ts
const resumed = await client.sessions.events.streamEvents(session.id, {
  last_event_id: stream.lastEventID,
});
```

For automatic reconnection, use the handwritten upper-layer resumable stream. It preserves the stream parameters and request options on every connection, checkpoints each fully decoded frame, and sends the latest cursor as `Last-Event-ID` after transport failures, timeouts, or unexpected EOF. Reconnects use abortable jittered exponential backoff. The retry status policy matches ordinary QCA requests: 408, 429, and 5xx are retryable, while 409 is not.

```ts
const stream = client.sessions.events.resumableStream(session.id, {
  last_event_id: previousEventID,
  'event_deltas[]': ['agent.message'], // Managed uses event_deltas
});

for await (const event of stream) {
  console.log(event.type, stream.lastEventID);
}
```

The resumable stream does not query event history, clear an invalid cursor, or deduplicate IDs: delta frames may legitimately share an event ID. It stops after `[DONE]`, `session.status_terminated`, or `session.deleted`. Stop it early with `stream.controller.abort()`, an `AbortSignal` in `RequestOptions`, or `await stream.close()`.

## File uploads

File parameters accept a `File`, a `Blob`, a byte array, a `Response`, a `ReadableStream` or an async iterable — including a Node file stream. `toFile` wraps any of those with an explicit filename.

```ts
import { toFile } from 'qca-sdk';
import fs from 'node:fs';

const uploaded = await client.files.upload({
  file: await toFile(fs.createReadStream('input.csv'), 'input.csv'),
  purpose: 'session_resource',
});

const inline = await client.files.upload({
  file: await toFile(new TextEncoder().encode('Hello'), 'hello.txt'),
});
```

A value passed without a filename is sent as `upload`, so give one whenever the name matters — either through `toFile`, or as `{ data, name }`. Operations taking a repeated `files` field accept an array, and each part keeps its own filename; skill uploads use that to carry relative paths such as `code-review/scripts/run.sh`.

```ts
await client.skills.create({
  files: [
    { data: await fs.promises.readFile('code-review/SKILL.md'), name: 'code-review/SKILL.md' },
    { data: await fs.promises.readFile('code-review/scripts/run.sh'), name: 'code-review/scripts/run.sh' },
  ],
});
```

Downloads first resolve a temporary link, then issue an isolated storage request that carries no API credential, default headers or middleware.

```ts
const download = await client.files.download(uploaded.id);
const bytes = new Uint8Array(await download.arrayBuffer());
```

## Handling errors

A non-2xx response throws a subclass of `APIError` carrying `status`, `code`, `type`, `request_id`, the parsed error payload, and the underlying `request` and `response`.

```ts
import { APIError, NotFoundError } from 'qca-sdk';

try {
  await client.sessions.retrieve('sess_missing');
} catch (error) {
  if (error instanceof NotFoundError) {
    console.log(error.status, error.code, error.request_id);
  } else if (error instanceof APIError) {
    console.log(error.status, error.message);
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

Connection failures throw `APIConnectionError`, an exhausted timeout throws `APIConnectionTimeoutError`, and aborting through your own signal throws `APIUserAbortError`. Client-side misconfiguration — an invalid `baseURL`, a negative `maxRetries` — throws `QoderError`, the base class of all of the above.

### Request IDs

Every response carries a request ID, exposed as `request_id` on errors and available on successful responses through `withResponse()`. Include it when reporting a problem.

```ts
const { data, request_id } = await client.sessions.retrieve(session.id).withResponse();
```

## Retries

Connection errors, timeouts, 408, 429 and 5xx responses are retried twice by default with exponential backoff and jitter. Only replayable requests are eligible: `GET` and `HEAD`, plus any request sent with an idempotency key. Writes without an idempotency key are retried on 429 only, 409 is never retried, and a request whose body is a `ReadableStream` is never replayed because the body cannot be re-read. A `retry-after-ms`, `retry-after` or `x-should-retry` response header overrides the default decision.

```ts
const client = new ForwardClient({ maxRetries: 0 }); // disable retries
await client.sessions.create(params, { maxRetries: 5, idempotencyKey: 'my-key' });
```

Each attempt re-resolves the credential and sends an `X-Qoder-Retry-Count` header.

## Timeouts

Requests time out after 10 minutes by default and are then retried according to the rules above. Configure the client default or override per request:

```ts
const client = new ForwardClient({ timeout: 20 * 1000 });
await client.sessions.list({}, { timeout: 5 * 1000 });
```

Pass `signal` to cancel a request yourself. The deadline stays armed while the response body is being read, so a stream is aborted once the subscription as a whole outlives the timeout — give a long-running subscription a limit sized for the whole session, not for one event.

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
  console.log(next?.data);
}

for await (const p of page.iterPages()) {
  console.log(p.data.length);
}
```

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

The API reference under `docs/api/` is generated from the source. Regenerate it with `make docs` (or `npm run docs`). To verify the committed reference is up to date and the README snippets still compile, run `make docs-check` (or `npm run docs:check`); CI runs the same gate on every pull request.

## License

Released under the [MIT License](LICENSE).
