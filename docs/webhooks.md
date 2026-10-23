# Forward Webhooks

Available in the next SDK release. Configure account notifications with a PAT or
administrator SAT. Identity SATs cannot manage webhook endpoints. Use the same
regional Forward client and shared authentication configuration as other APIs.

## Endpoint operations

All paths are relative to `/api/v1/forward`.

| Method | Path | Result |
| --- | --- | --- |
| POST | `/webhook/endpoints` | Create; HTTP 201, includes `signing_secret` once |
| GET | `/webhook/endpoints` | List; `limit` and `after_id`, preserving server order |
| GET | `/webhook/endpoints/{endpoint_id}` | Retrieve |
| PUT | `/webhook/endpoints/{endpoint_id}` | Partial update |
| DELETE | `/webhook/endpoints/{endpoint_id}` | Delete; HTTP 204, no response body |
| POST | `/webhook/endpoints/{endpoint_id}/enable` | Enable |
| POST | `/webhook/endpoints/{endpoint_id}/disable` | Disable |
| POST | `/webhook/endpoints/{endpoint_id}/test` | HTTP 202, `event_id` and `delivery_rows` |

- `events` accepts full event names or `*`. Strings remain open for future event
  types; the SDK does not maintain a closed event enumeration. The current official
  catalog includes `forward.schedule.archived`.
- Omitted update fields are unchanged. `active: false` disables an endpoint.
  `events` replaces the subscription list. `metadata` merges keys; a null entry
  deletes that key. Create metadata values are strings.
- Securely store the create response's `signing_secret` before leaving the creation
  flow. List/retrieve/update cannot recover it. Do not log the create response.
- `test` only queues a synthetic event; 202 and a positive `delivery_rows` do not
  confirm receipt. A disabled endpoint may return zero rows. Verify actual delivery
  at your receiver. The SDK does not poll delivery state or automatically replay
  a test POST without an idempotency key.

## Manage subscriptions

The following uses an already configured `client` and a callback URL that you
control. Only call `test` when that receiver is ready. Use a unique idempotency key
for creation, and reuse it only for the same request.

```typescript
const created = await client.webhooks.endpoints.create({
  url: callbackURL, events: ['forward.schedule.archived'], metadata: {team: 'sdk'},
}, {idempotencyKey: createKey});
// Persist created.signing_secret securely; never print the response.
await client.webhooks.endpoints.retrieve(created.id);
await client.webhooks.endpoints.update(created.id, {active: false, metadata: {old_key: null}});
await client.webhooks.endpoints.enable(created.id);
const accepted = await client.webhooks.endpoints.test(created.id);
for await (const endpoint of client.webhooks.endpoints.list({limit: 20})) console.log(endpoint.id);
```

Requests return the existing `APIPromise`/`PagePromise`, with `.withResponse()` and
`AbortSignal` support. The verifier is asynchronous and uses Web Crypto HMAC verification.

## Verify deliveries

See [the runnable example](../examples/forward/webhooks.mjs):

```typescript
import {verifyWebhookSignature} from 'qca-sdk/forward';

const rawBody = new Uint8Array(await request.arrayBuffer());
await verifyWebhookSignature(rawBody, request.headers, signingSecret);
const event = JSON.parse(new TextDecoder().decode(rawBody));
```

Pass the **original HTTP request body bytes**, all request headers, and the stored
`whsec_...` secret. Verification is local and makes no API call. It checks
`Webhook-ID`, `Webhook-Timestamp` and `Webhook-Signature`, decodes the secret with
standard Base64, and verifies HMAC-SHA256 over `id.timestamp.raw_body`. It accepts
any matching `v1` signature in the whitespace-separated header, checks a fixed
300-second past/future window, and rejects malformed or mismatched input with a
webhook verification error. Keep the receiver clock synchronized.

Parse JSON only after verification; do not reserialize it before checking the
signature. Preserve unknown event types and fields. Ordinary events contain
`data.type`; the synthetic test event instead has `endpoint_id`, `emitted_at` and
`note`, with no required `data`. The `Webhook-Event-Type` header is not part of the
signed message; use the verified payload for business decisions.

In a real HTTP handler, reject verification failures, bound the body size, store
accepted events durably, and deduplicate using `Webhook-ID` before acknowledging
with 2xx. Retries share the same ID. The SDK does not supply a queue or a deduplication
database. The examples only parse an authenticated delivery and list endpoints;
they do not start a production receiver or create subscriptions automatically.

## Clean up a test endpoint

Run this step separately for a temporary test endpoint, after your receiver has
confirmed receipt and successfully verified the expected test delivery. Keep the
endpoint active while waiting: disabling or deleting it can discard queued
deliveries. HTTP 202 and `delivery_rows` confirm queuing, not receipt.

```typescript
await client.webhooks.endpoints.disable(created.id);
await client.webhooks.endpoints.delete(created.id);
```

## Validation boundary

Offline tests cover all eight HTTP contracts, errors, cursor paging, omitted/null/
false updates, empty bodies, signature vectors, tampering, expired/future timestamps,
multiple signature candidates and unknown fields. Live CN/Global callback delivery
requires a reachable receiver controlled by the application team and is not implied
by these tests.

References: [API overview](https://docs.qoder.com/zh/cloud-agents/api/webhooks/overview),
[receiving events](https://docs.qoder.com/zh/cloud-agents/api/webhooks/receive).
