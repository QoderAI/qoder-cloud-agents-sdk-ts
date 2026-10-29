# Qoder Cloud Agents TypeScript SDK

[Changelog](CHANGELOG.md) · [Releases](https://github.com/QoderAI/qoder-cloud-agents-sdk-ts/releases)

[![NPM version](https://img.shields.io/npm/v/qca-sdk.svg)](https://npmjs.org/package/qca-sdk)

TypeScript and JavaScript library for the Qoder Cloud Agents API. It provides typed access to the Forward and Managed APIs, ships CommonJS, ES modules and strict TypeScript types, and has no third-party runtime dependencies.

## Installation

```sh
npm install qca-sdk
```

Node.js 20.12 or later is required.

## SDK-created Session metadata

Direct Forward and Managed Session creation automatically adds these string-valued
metadata fields:

| Field | Value |
| --- | --- |
| `__qca_sdk_created` | `"true"` |
| `__qca_sdk_language` | `"js"` |
| `__qca_sdk_version` | The installed SDK's version |

Reserve the `__qca_sdk_` prefix for SDK provenance. Business metadata is preserved,
and the caller's metadata object is not mutated. Omitted or null metadata becomes
an object containing the markers. Passing an existing marker with the exact same
string value is accepted; a different value or type (including null) fails locally
before any HTTP request. This also applies after request options are merged.

Session updates, reads and event operations do not inject or repair these fields.
Sessions created indirectly through Schedules, Batches or Realtime are outside this
behavior. These markers describe the creating SDK; they are client-supplied metadata,
not an authentication or authorization mechanism.

Migration: rename any business fields that already use these three keys before
upgrading. Automatic markers count toward API metadata limits; the SDK never drops
business fields to make room. No additional parameters or opt-in are required.

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

`ForwardClient` covers the Forward API — `templates`, `identities`, `sessions`, `schedules`, `scheduleRuns`, `batches`, `channels`, `channelPairings`, `environments`, `files`, `skills`, `vaults`, `memoryStores`, `models` and `usage`.

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

### Usage and cancellation

Forward Usage requires PAT or Admin SAT.

```ts
for await (const row of forward.usage.listIdentities({
  start_at: '2026-09-14T09:00:00', end_at: '2026-09-14T12:00:00',
  identity_ids: ['idn_one', 'idn_two'],
})) {
  console.log(row.identity_id, row.active_seconds, row.credits);
}
const acknowledgement = await managed.sessions.cancel('sess_one');
for await (const run of managed.deployments.runs.list({ deployment_id: 'dep_one', limit: 20 })) {
  console.log(run.id);
}
const run = await managed.deployments.runs.retrieve('drun_one', { deployment_id: 'dep_one' });
```

`usage.listTemplates` accepts the same filters. Bounds are whole hours in
Asia/Shanghai for CN and Global, with an inclusive start, exclusive end, and a
maximum 744-hour span. Multi-ID filters accept arrays or comma-separated strings.
`active_seconds` preserves fractions. Legacy timestamp parameters and
`duration_seconds` are not exposed.

`forward.vaults.credentials.update('vault_one', 'cred_one', { auth: {...} })`
rotates write-only secrets; only auth and metadata are patched, omitted fields
are preserved, and this operation never retries automatically.
`metadata: null` clears metadata; `metadata: { key: null }` deletes a key.

Session cancellation returns the lightweight `canceling` acknowledgement for
active (HTTP 202) and idle (HTTP 200) sessions. The global `deploymentRuns` resource
remains available.

### Configuration

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

### Forward SAT management

Forward exposes explicit admin/Identity SAT issuance and revocation in addition
to automatic platform exchange. These three endpoints authenticate with an
**SA Key**, supplied per method call; ordinary business requests still use PAT
or SAT. The Key overrides client/request Authorization only for that call, is
never included in the JSON body, and is not saved on the client.

`ttl_seconds` is optional (1-43200); omission uses the issuer's default. Issuance
and revocation are not automatically retried, even when the client or request
allows retries. Do not blindly repeat an issuance after an uncertain network
failure: it may already have issued a token. Metadata is for audit information,
not secrets. Keep the issuance response's Token ID, Credential ID and expiry for
precise revocation. A returned static SAT does not renew automatically, and
revocation affects its Forward binding; it does not cancel an already-running
Session or revoke unrelated Managed/platform access. Never log the SA Key, SAT,
serialized token response or Authorization headers.

Run `npm run test:live:sa:tokens` with `QODER_SA_CN_KEY`,
`QODER_SA_GLOBAL_KEY` and `QODER_SA_LIVE_ALLOW_WRITE=true` to verify both regions.
This separate suite issues admin and Identity SATs, checks business access and
cross-Identity refusal, then revokes the tokens, verifies access is refused and
deletes its temporary Identities. It does not execute a model or require
`QODER_SA_LIVE_ALLOW_EXECUTION=true`.

```ts
import { ForwardClient } from 'qca-sdk';

const forwardBaseURL = process.env.QODER_FORWARD_BASE_URL || 'https://api.qoder.com/api/v1/forward';
const saKey = process.env.QODER_SA_KEY!;
const identityID = process.env.QODER_IDENTITY_ID!;
const issuer = new ForwardClient({ baseURL: forwardBaseURL });
// Admin: issuer.serviceAccountTokens.create({ saKey, ttl_seconds: 600 }).
const token = await issuer.identities.serviceAccountTokens.create(identityID, {
  saKey, ttl_seconds: 600,
});
try {
  const runtime = new ForwardClient({
    baseURL: forwardBaseURL, authMode: 'sa', accessToken: token.access_token,
  });
  const page = await runtime.sessions.list({ identity_ids: [identityID], limit: 1 });
} finally {
  await issuer.serviceAccountTokens.revoke(token.auth_token_id, {
    saKey, target_credential_id: token.credential_id,
    target_expires_at: token.expires_at, reason: 'runtime complete',
  });
}
```

After building, run `node examples/auth/forward-tokens.mjs`. It revokes its token
even if the business call fails. Set `QODER_SA_KEY` and `QODER_SA_REGION=cn|global`;
set `QODER_IDENTITY_ID` for Identity mode, or leave it unset for admin mode.

See the official [admin issuance](https://docs.qoder.com/cloud-agents/api/forward/service-account-tokens/create),
[Identity issuance](https://docs.qoder.com/cloud-agents/api/forward/service-account-tokens/create-identity)
and [revocation](https://docs.qoder.com/cloud-agents/api/forward/service-account-tokens/revoke) contracts.

### Authentication examples

The two read-only examples under `examples/auth/` show client construction directly:
SA Key exchange with automatic caching/renewal, and direct SAT access with renewal
managed by the caller. Each lists Forward templates and Managed agents; no model
execution or resources are created. The SA needs both API scopes/permissions and
its Managed workspace binding in the selected region.

```sh
npm run build
# Configure QODER_SA_REGION=cn|global and only the credential needed by the demo.
node --env-file=.env.live examples/auth/sa-key.mjs   # QODER_SA_KEY; leave QODER_ACCESS_TOKEN empty
node --env-file=.env.live examples/auth/sa-token.mjs # QODER_ACCESS_TOKEN; leave QODER_SA_KEY empty
```

The existing business examples keep PAT as the default. Node's `--env-file` can
load `.env.live`; the example helpers themselves read process environment variables.
Set `QODER_AUTH_MODE=sa` to select SA explicitly, then configure exactly one of
`QODER_SA_KEY` and `QODER_ACCESS_TOKEN`. `QODER_SA_REGION=cn|global` selects both the
business and exchange hosts. Leave the unused credential empty. Ambient PATs are
ignored in SA mode; missing SA credentials and conflicting Key/SAT inputs fail
before a request is sent. This selection is example configuration, not implicit
SDK behavior.

```sh
# Reuse the same models or Session program with SA authentication.
QODER_AUTH_MODE=sa QODER_SA_REGION=cn node --env-file=.env.live examples/forward/models.mjs
QODER_AUTH_MODE=sa QODER_SA_REGION=global node --env-file=.env.live examples/managed/session.mjs
```

For a centralized SAT service, use
`new ForwardClient({ authMode: 'sa', accessToken: () => tokenManager.getValidSAT() })`.
The callback may return a promise and is called before each HTTP attempt; the token
manager is responsible for renewing the SAT.

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

### Thread event resumption

Forward and Managed also support automatic resumption for a single Thread. Use the
same retry and cancellation behavior as Session streams, with a thread-scoped
`Last-Event-ID` cursor:

```ts
import { ForwardClient, ManagedClient } from 'qca-sdk';

const forwardClient = new ForwardClient();
const managedClient = new ManagedClient();
const controller = new AbortController();
// Replace these with IDs returned by the API.
const sessionID = 'sess_...';
const threadID = 'sthr_...';
const afterID = 'evt_...';

// Forward
const stream = forwardClient.sessions.threads.events.resumableStream(
  sessionID, threadID, { last_event_id: afterID }, { signal: controller.signal },
);
try {
  for await (const event of stream) console.log(event.type);
} finally {
  await stream.close();
}

// Managed uses the parent session in params.
const managedStream = managedClient.sessions.threads.events.resumableStream(
  threadID, { session_id: sessionID, last_event_id: afterID },
);
// Iterate as above and close when finished.
```

`session.thread_status_idle` ends only the current turn, so the subscription stays
open. `session.thread_status_terminated`, `session.status_terminated`, or
`session.deleted` ends it normally. A non-retryable error (including an invalid
cursor or missing thread) is returned to the caller; the SDK never clears the
cursor to silently start over. The existing one-shot Thread stream remains
available. See the [Forward Thread stream](https://docs.qoder.com/cloud-agents/api/forward/sessions/stream-thread-events)
and [Managed Thread stream](https://docs.qoder.com/cloud-agents/api/sessions/threads/events/stream)
contracts for cursor validity.

## Forward Decisions (Beta)

The Decision API is in Beta. Its behavior may change in future updates.

Evaluate a nonempty `state` object or an accessible `session_id` (exactly one)
with 1–32 choice or score questions. Choice values are strings or booleans;
score questions select from your numeric levels. Creation waits for the result.
The service selects the model; no `model` parameter is accepted. Normal PAT or
SAT authentication determines the caller's access.

```ts
import { randomUUID } from 'node:crypto';
import { ForwardClient } from 'qca-sdk';

const client = new ForwardClient(); // Or use the PAT/SA configuration above.
const decision = await client.decisions.create({
  state: { message: 'My issue is resolved.' },
  questions: [{
    type: 'choice', name: 'resolved',
    instructions: 'Has the user confirmed resolution?',
    choices: [{ value: true }, { value: false }],
  }],
  idempotency_key: randomUUID(),
});
const stored = await client.decisions.retrieve(decision.id);
console.log(stored.answers);
const page = await client.decisions.list({ limit: 20 });
console.log(page.data); // Or use for await over list(...) to follow all pages.
```

For Session input, replace `state` with `session_id`.
For scores, use `{ type: 'score', instructions: 'Rate risk', levels:
[{ label: 'low', score: 0 }, { label: 'high', score: 10 }] }`.

Session context is selected by the server. `context.mode` identifies the input
mode; Session results may include event IDs and counts describing the selected
history. Answers have type `choice` or `score`. Oversized input returns HTTP 422.

Reuse an idempotency key only for identical request bytes. A changed request or
a still-running request with that key returns HTTP 409; the SDK does not retry
that conflict automatically. Creation errors can contain `decision_id` in the
standard API error body. Retrieve and list can return running or failed records.
Lists preserve server order and support `after_id` / `before_id` cursors (one at
a time), optional `session_id`, and a limit of 1–100. There is no delete endpoint;
Decision records expire according to server retention.

See the [runnable example](examples/forward/decisions.mjs) and the
[opt-in live test instructions](CONTRIBUTING.md#decision-live-tests).

## Forward Drive (Beta)

Drive is a Beta API. It uses `entries` / `next_page_token`, not the ordinary
resource paginator. Pass `identity_id` even with an Identity SAT, preserve the
server order, and reuse a cursor only within the same Identity, directory and
authentication scope. Paths are relative; the SDK preserves slashes when encoding
the list query and leaves path validation to the service.

Upload/download methods return a signed URL, method, headers and expiry. Send the
storage request with a separate HTTP client using only those returned headers;
do not attach QCA credentials or log signed URLs. Replaying an `Idempotency-Key`
does not renew the URL: use a new key or omit it when requesting a fresh URL.

Deleting a nonempty directory requires `recursive=true`; `clear` deletes the
entire selected Identity Drive. Partial failures retain `drive_delete_partial`
and `deleted_count` in the standard API error body. Direct Drive APIs do not
require Template tool configuration.

```ts
const identityID = 'idn_...';
const templateID = 'tmpl_...';
let page = await client.drives.listEntries({ identity_id: identityID, path: 'reports', limit: 20 });
for (const entry of page.entries) console.log(entry.path);
if (page.next_page_token) {
  page = await client.drives.listEntries({
    identity_id: identityID, path: 'reports', page_token: page.next_page_token,
  });
}
// Replace the complete managed-tool list, retaining any other tools you need.
await client.templates.update(templateID, { managed_tool_config: { enabled_tools: ['drive'] } });
```

Run the [file lifecycle example](examples/forward/drive.mjs) with
`node examples/forward/drive.mjs`. It uses the shared PAT/SA configuration and
creates a fresh Identity. A directory has no `size`; a zero-byte file has `size=0`.
For maintainers, `npm run test:live:drive` tests CN/Global × PAT/admin SAT/Identity SAT.

To enable Agent-managed Drive tools, use Template `managed_tool_config.enabled_tools`.
It is separate from `tools[].enabled_tools` and replaces the entire list; an empty
list disables managed tools, omission preserves the setting, and `null` clears it.
Full Agent Drive usage also requires the DeliverArtifacts tool. Internal
`/forward-mcp` routes are invoked by the runtime and are not public SDK methods.

The Drive live suite requires `QODER_DRIVE_LIVE_ALLOW_WRITE=true`,
`QODER_FORWARD_CN_PAT`, `QODER_FORWARD_GLOBAL_PAT`, `QODER_SA_CN_KEY`, and
`QODER_SA_GLOBAL_KEY` in `.env.live` (or `LIVE_ENV_FILE`). It creates isolated
Identities, verifies storage transfers, pagination, deletion, Identity isolation,
and Template configuration, then clears only those new Identities. It does not
run Agent/model tool execution.

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

The API reference under `docs/api/` is generated from the source. Regenerate it with `make docs` (or `npm run docs`). To verify the committed reference is up to date and the README snippets still compile, run `make docs-check` (or `npm run docs:check`); CI runs the same gate on every pull request.

## License

Released under the [MIT License](LICENSE).

### Forward Realtime (Beta, Node.js)

`forward.realtime` supports Conversation creation, persisted History and the
`voice.realtime.v1` WebSocket protocol. A pre-existing enabled Identity and a
Realtime-enabled Template are required. Template Realtime configuration APIs are
not included. The `ws` runtime dependency is installed with the SDK and loaded
only when connecting; existing HTTP imports remain usable in browser runtimes.
Browsers cannot set the required Authorization header, so Realtime connections
require Node.js 20.12 or newer.

```ts
import { ForwardClient } from 'qca-sdk';

const client = new ForwardClient({ pat: process.env.QODER_FORWARD_PAT });
const conversation = await client.realtime.conversations.create({
  identity_id: process.env.QODER_REALTIME_IDENTITY_ID!,
  template_id: process.env.QODER_REALTIME_TEMPLATE_ID!,
  idempotency_key: crypto.randomUUID(), // Stable for this create operation and its retries.
});
const connection = await client.realtime.connect({
  conversationId: conversation.id,
  signal: AbortSignal.timeout(180_000),
});
try {
  // connect returns after validated voice.ready; pre-ready events are retained.
  await connection.sendText('Hello');
  const event = await connection.receive({ timeout: 30_000 });
  console.log(event.value?.type);
  const acknowledgement = await connection.closeGracefully();
  console.log(acknowledgement.outcome);
} finally {
  connection.close();
}

const history = await client.realtime.conversations.history(conversation.id, {
  limit: 50, types: 'message,work',
});
for await (const event of history) console.log(event.id, event.type);
// Or use history.hasNextPage() / history.getNextPage() / history.iterPages().
```

Realtime currently accepts PAT or a **Forward-issued bound SAT**. A platform SAT
obtained by `ServiceAccountCredential` has no Forward Token binding and is
rejected by the current Realtime service. `ServiceAccountCredential` only
exchanges and renews platform SATs; it does not create a Forward-bound Token.
For SA access, obtain the appropriate Admin/Identity SAT from Forward's Token
management API and pass it through the existing direct-Token interface:

```ts
import { ForwardClient } from 'qca-sdk';

const client = new ForwardClient({
  authMode: 'sa',
  accessToken: process.env.QODER_ACCESS_TOKEN!, // Forward-issued bound SAT.
});
```

An Identity SAT is restricted to its authorized Identity; use an Admin SAT for
the live suite that creates temporary Identities. A Token callback or custom
Credential can supply a refreshed Forward-bound SAT. Each new connection
resolves current credentials; an existing WebSocket does not update its
Authorization header when a SAT is renewed.
Credentials are sent only in headers. Redirects, automatic reconnection and input
replay are disabled. Custom HTTP fetch/middleware and defaultQuery do not apply
to the separate WS transport; `transport` accepts a Node agent (including a proxy
agent) and CA/certificate/TLS settings. Per-connection headers override client
headers using the ordinary authentication rules.

Handshake, ready, send and graceful-close deadlines default to 30, 60, 30 and 10
seconds, respectively, and can be overridden through connect options. The HTTP
request timeout does not impose a WS lifetime. The service limits one connection
to 60 minutes. AbortSignal cancels and releases the connection. Breaking event iteration only
ends that read phase; keep using the connection or explicitly close it in
`finally`. Incoming events
are bounded to 256 queued events, 4 MiB total, and 1 MiB per frame; slow consumers
receive a queue-overflow error. Sends are serialized and bounded to the same
queue budget. Unknown Beta event types and extension fields remain available;
invalid envelopes, protocol versions or JSON fail explicitly. Server error
codes/retry guidance and abnormal WS close codes/reasons remain accessible.

`appendAudio(Uint8Array)` accepts nonempty raw **16 kHz mono PCM16 little-endian**
samples; decode WAV and resample in the application. Output `audio.delta` is
Base64 **24 kHz mono PCM16**, decoded by `decodeRealtimeAudio(event)`. The final
client JSON frame, including Base64 expansion, is limited to 256 KiB. VAD detects
speech endings; there is no `audio.commit` event. Text is limited to 16 KiB UTF-8.
The SDK does not capture or play audio. `audio.done` and `work.completed` do not
mean a speaker finished playing. Report actual playback with `playbackStarted`,
`playbackEnded` or `playbackCancelled`, passing the original audio event's
`work_id` and `announcement_id` when present. On `playback.interrupt`, stop and
clear application playback; `interrupt()` sends a user interruption.

`closeGracefully()` waits for `connection.closed` with its matching request ID
and returns the persistence outcome. Missing acknowledgements, persistence
errors and timeouts fail explicitly. Plain `close()` releases transport without
promising persistence, cancelling Work or deleting the Conversation. History
uses separate `events` / `page.next_before` fields and older-record cursors;
WS sequence/event IDs are not history cursors. Timestamp strings preserve
nanosecond precision. Conversation retention/deletion must be managed outside
this SDK because no public delete API is available.

Runnable examples reuse the existing PAT/SA environment selection. For SA,
set `QODER_AUTH_MODE=sa` and provide a Forward-issued bound SAT through
`QODER_ACCESS_TOKEN`; leave `QODER_SA_KEY` unset:

```bash
npm run build
node examples/forward/realtime/text.mjs --help
node examples/forward/realtime/pcm.mjs --help
# Set QODER_REALTIME_IDENTITY_ID and QODER_REALTIME_TEMPLATE_ID before real execution.
node examples/forward/realtime/text.mjs 'Hello'
node examples/forward/realtime/pcm.mjs input.pcm output.pcm
```

The separate opt-in two-region entry is `npm run test:live:realtime -- all text`
(or select `-- pat basic` / `-- sa basic`). Configure the selected
`QODER_REALTIME_{CN,GLOBAL}_{PAT,SA}_TEMPLATE_ID` values,
Forward PATs or Forward-issued Admin SATs in
`QODER_REALTIME_CN_SAT` / `QODER_REALTIME_GLOBAL_SAT`, and explicitly enable
`QODER_REALTIME_LIVE_ALLOW_WRITE=true` and
`QODER_REALTIME_LIVE_ALLOW_EXECUTION=true`. Both regions are validated before
creation. Explicit Realtime SATs take priority over region SA Keys. The Key
fallback remains available to detect changes in platform-SAT acceptance, but
currently fails without a Forward Token binding. Basic verifies
create/ready/ping/acknowledged close/History; SA also
checks a direct-SAT reconnect. `text`, `pcm` and `work` scenarios separately run
model/audio/task execution. PCM requires `QODER_REALTIME_PCM_FILE`; work requires
a confirmed trigger in `QODER_REALTIME_WORK_PROMPT`. Logs retain Conversation
and request IDs without tokens. Tests create temporary Identities, delete them on success/failure, preserve the
original Templates and record persisted Conversations because transport close cannot delete them. These entries are not
included in daily PAT tests until explicitly configured; offline CI validates
protocol behavior without network or credentials.

## Forward Webhooks

Manage webhook endpoints and verify signed event deliveries. See [Webhook usage and receiver examples](docs/webhooks.md).

## Resource search

Search uses `POST /<resource>/search` with typed filters in the JSON body.
The SDK automatically includes `x-qoder-beta: search-2026-08-31`, preserving
other effective beta flags. Calling Search with no filters sends `{}`.

- Forward: Environments, Skills, Vaults, and Files.
- Managed: Agents, Sessions, Deployments, Environments, Skills, Vaults, Files,
  and Memory Stores.

Metadata filters are exact string matches combined with AND. Each resource also
supports its documented filters, such as name, creation time, Session status,
or Skill source/display title. See the official
[Forward search](https://docs.qoder.com/cloud-agents/api/forward/environments/search)
and [Managed Session search](https://docs.qoder.com/cloud-agents/api/sessions/search)
contracts. This searches QCA resources; it does not perform a web search.

Forward's `identity_id` selector is sent only in the URL query. Set it when a PAT
should search an Identity's resources; omit it with all SATs, whose scope comes
from the token. Search cursors are opaque: automatic pagination puts `next_page`
back into the JSON body's `page` while preserving filters, ownership, and request
options. Existing List methods retain their GET/query pagination behavior.

```ts
import { ForwardClient, ManagedClient } from 'qca-sdk';

const forwardClient = new ForwardClient({ pat: process.env.QODER_FORWARD_PAT! });
const managedClient = new ManagedClient({ pat: process.env.QODER_MANAGED_PAT! });

for await (const environment of forwardClient.environments.search({
  metadata: { team: 'core' },
  name: 'dev',
  identity_id: 'idn_example', // PAT only; omit for SAT.
  limit: 20,
})) {
  console.log(environment.id);
}

// Time bounds use the documented wire keys.
const page = await managedClient.sessions.search({
  metadata: { ticket: 'A-123' },
  statuses: ['idle', 'running'],
  'created_at[gte]': '2026-01-01T00:00:00Z',
});
```

Search returns a `PagePromise`: await a page, use `for await` to iterate all
results, or call `page.getNextPage()` for manual pagination. Search parameter
types are exported from the corresponding `qca-sdk/forward` and
`qca-sdk/managed` entry points.

## Official contract alignment

The next release aligns these public types with the official API documentation
retrieved on 2026-10-27. It introduces source changes relative to 0.12.0:
Outcome `rubric` is an object; Managed Agent `effort` is a string; Managed Agent
and Dream model objects do not accept `speed`. Managed Dream `model` is optional
and defaults to `auto`. Discover model IDs and supported efforts/context windows
with List models. These Managed model changes do not remove Forward model features.

```ts
import { ForwardClient } from 'qca-sdk';

const client = new ForwardClient({ pat: '...' });
const dream = await client.dreams.create({
  inputs: [{ type: 'identity_template', identity_id: 'idn_...', template_id: 'tmpl_...' }],
}); // model defaults to auto

for await (const mount of client.identities.memoryStores.list(
  'idn_...', 'tmpl_...', { limit: 20 }, { timeout: 30_000 },
)) {
  console.log(mount.memory_store_id);
}
```

Mount `list` request options move from argument three to argument four; use `{}`
for argument three when no query is needed. It returns a standard `PagePromise`.
Identity `tools: []` removes all runtime tools; `tools: null` restores inheritance.
Use `managed_tool_config: {schedule: {enabled: false}, drive: null}` for sparse
capability changes. Multiagent `agents` accepts Template ID strings and
`{type: 'advisor', model: 'ultimate'}` objects.

New Forward Dream calls require a PAT or an admin SAT; an Identity SAT is not
supported. Inputs contain exactly one primary Memory Store or Identity/Template
source, optionally plus Session sources. Pairing `update` changes an active
binding; supply at least one nonempty Identity or Template ID. Use pairing
`create` to complete a pending pairing. Pending records preserve empty
`identity_id`, `template_id`, and `paired_at` strings.

Identity `auto_memory_store=false` disables automatic default-store creation.
Independent mounts now accept `access="read_write"`; omit access for a new
read-only mount, or to preserve an existing mount's permission. Schedule
`resources` accepts file entries and `[]` clears them; Run retrieval supports
`include_initial_events=true` to return the saved input snapshot.

Managed cloud Environment `config.storage.buckets` supports up to eight OSS
mounts. When the resulting configuration has buckets, explicitly include beta
`oss-bucket-2026-09-23` (`Betas` in Go, `betas` in Python/TS). Send credentials
only when creating or replacing them; omit `credential` on an existing named
bucket to keep it. Responses expose a read view without role ARN or AccessKey
secret. `storage: {buckets: []}` clears mounts.

Managed `OAuth.Start` (Go) / `oauth.start` (Python/TS) returns `authorization_url`,
`state`, and `callback_origin`; the user completes authorization in a browser.
Client secrets go in the POST body, never in a URL. This method does not open a
browser or complete consent automatically.

See the official [Outcome contract](https://docs.qoder.com/cloud-agents/api/forward/sessions/send-events),
[Identity overrides](https://docs.qoder.com/cloud-agents/api/forward/identities/upsert-config),
[Dream inputs](https://docs.qoder.com/cloud-agents/api/forward/dreams/create),
[OSS storage](https://docs.qoder.com/cloud-agents/api/environments/storage-buckets),
and [OAuth flow](https://docs.qoder.com/cloud-agents/api/vaults/start-oauth).
