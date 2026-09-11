# Qoder Cloud Agents TypeScript SDK

The client is structured after `anthropic-sdk-typescript`. Its HTTP API surface and request protocol follow `qoder-cloud-agents-sdk-go`: **110** Forward operations and **95** Managed operations, **205** in total.

Requires Node.js 20.12 or later. Ships CommonJS, ES modules and strict TypeScript types, with no third-party runtime dependencies.

```sh
npm install qca-sdk
```

```ts
import { ForwardClient, ManagedClient, PATCredential } from 'qca-sdk';

const forward = new ForwardClient({ credential: PATCredential.fromEnv() });
const managed = new ManagedClient({ accessToken: process.env.QODER_ACCESS_TOKEN });

for await (const model of managed.models.list()) {
  console.log(model.id);
}

const template = await forward.templates.create({ name: 'Support', model: 'ultimate', environment_id: 'env_id' });
console.log(template.id);
```

The client exposes the same resource tree as the Go SDK. Go's `New` maps to `create` and `Get` maps to `retrieve`; all other methods use lowerCamelCase, so `Identities.Configs.Upsert` becomes `identities.configs.upsert`. Positional argument order is preserved, and path fields that live in a Go parameter object stay in the parameter object here. All request and response fields keep the snake_case naming used on the wire.

```ts
const agent = await managed.agents.retrieve('agent_id');
const version = await managed.skills.versions.retrieve('version_id', { skill_id: 'skill_id' });
```

Each entry point can also be imported on its own — `qca-sdk/forward` and `qca-sdk/managed` — both providing a default client and named exports. The `*Api` and `*Raw` methods of the previous OpenAPI Generator output are gone, as are APIs outside the Go SDK surface such as Service Account Token, Managed Search and Webhook.

## Configuration and responses

The default credential environment variable is `QODER_ACCESS_TOKEN`. Forward reads `QODER_FORWARD_BASE_URL`, defaulting to `https://api.qoder.com/api/v1/forward`; Managed reads `QODER_BASE_URL`, defaulting to `https://api.qoder.com/api/v1/cloud`. Explicit constructor options take precedence.

```ts
const client = new ManagedClient({
  accessToken: process.env.QODER_ACCESS_TOKEN,
  baseURL: 'https://api.qoder.com/api/v1/cloud',
  timeout: 30_000,
  maxRetries: 2,
  defaultHeaders: { 'X-Application': 'my-app' },
});

const { data, response, request_id } = await client.agents
  .retrieve('agent_id', { signal: AbortSignal.timeout(5_000) })
  .withResponse();
```

`APIPromise` supports `await`, `.asResponse()` and `.withResponse()`. The latter two preserve the raw response; `.asResponse()` hands the body to the caller to read or discard. JSON decoding keeps unknown fields, and on the way out `undefined` is omitted while `null`, empty arrays, empty strings and `false` are sent as-is.

`APIError` carries `status`, `type`, `code`, `request_id`, `request`, `response` and the raw error payload. A `request_id` in the error body takes precedence over the response header. Network failures, request timeouts and caller-initiated cancellation surface as `APIConnectionError`, `APIConnectionTimeoutError` and `APIUserAbortError` respectively.

Requests are retried up to 2 times by default. Matching the Go SDK: GET/HEAD requests and replayable requests carrying an idempotency key retry on network errors and specific server errors; 429 also retries replayable writes; 409 is never retried. Every attempt re-resolves the credential and sends `X-Qoder-Retry-Count`, and the response `Retry-After` and `x-should-retry` headers feed into the decision. Set `maxRetries: 0` to disable retries.

## Pagination, streaming and files

```ts
// Auto-pagination — no need to await the page first.
for await (const agent of client.agents.list({ limit: 20 })) {
  console.log(agent.id);
}

// Or walk one page at a time.
const page = await client.agents.list({ limit: 20 });
if (page.hasNextPage()) console.log((await page.getNextPage())?.data);
```

The pagination style follows the corresponding Go method: ID cursors use `before_id`/`after_id`, opaque cursors use `next_page` → `page`. Auto-pagination carries filter parameters forward and rejects a cursor that fails to advance.

```ts
const stream = await forward.sessions.events.streamEvents('session_id', {
  'event_deltas[]': ['agent.message'],
});
try {
  for await (const event of stream) console.log(event);
} finally {
  await stream.close();
}
```

The SSE reader preserves delta frames that share an ID as well as unknown event types, skips pings, terminates on `[DONE]`, and throws an `APIError` on error events. Read `stream.lastEventID` to get a reconnect cursor and pass it back as the `last_event_id` method parameter. The SDK does not reconnect and replay events on your behalf.

```ts
import { toFile } from 'qca-sdk';

const file = await forward.files.upload({
  file: await toFile(new TextEncoder().encode('Hello'), 'hello.txt'),
  purpose: 'session_input',
});
const download = await forward.files.download(file.id);
const bytes = await download.arrayBuffer();
```

`toFile` accepts Blob/File values, byte arrays, a `Response`, a `ReadableStream` and async iterables, including Node file streams. Skill uploads preserve the relative paths of the file tree and the repeated `files` field. Downloads first resolve a temporary link, then issue an isolated storage request that carries no API credential, default headers or middleware.

## Development and verification

```sh
npm ci
npm test
npm run typecheck
npm run test:scenarios
```

A live-scenario entry point equivalent to Go's `example -scenario all` is included. Install dependencies and run an initial build at the repository root, fill in `.env.live`, then run:

```sh
npm ci
npm run build
npm run example -- -mode both -scenario all -region international -model auto
```

`npm run example` rebuilds the SDK before every run, executes six Forward and six Managed real scenarios, and cleans up the resources it created. The default `-region cn` overrides the hostname from `.env.live`, so international accounts must pass `-region international` explicitly. The `all` example does not depend on the `LIVE_ALLOW_*` switches used by the migrated live tests. See [examples/README.md](examples/README.md) for single-scenario runs, credentials and JSON reports; results are written to `build/example-results/`.

The offline contracts for all 205 APIs, the 46 migrated live scenarios and the 12 example scenarios above are distinct layers of verification — the 12 examples do not mean all 205 remote operations were exercised individually. The API cross-reference lives in [Forward API inventory](src/forward/api-inventory.json) and [Managed API inventory](src/managed/api-inventory.json).

Resource code and types can be regenerated from a given Go checkout. The generator validates the API inventory and fails on any signature or type it cannot recognize:

```sh
python3 scripts/generate-forward.py ../qoder-cloud-agents-sdk-go
python3 scripts/generate-managed.py ../qoder-cloud-agents-sdk-go
npm test
```

The generator only touches `src/forward` and `src/managed`; the shared transport layer lives in `src/core`. The Go snapshots used by the tests are maintained separately, so a change to the API surface should be reviewed against both the contract diff and the test migration index.

## License

Released under the [MIT License](LICENSE).
